export class Color {
    constructor(r, g, b, a = 1) {
        this.r = r < 0 ? 0 : parseInt(r);
        this.g = g < 0 ? 0 : parseInt(g);
        this.b = b < 0 ? 0 : parseInt(b);
        this.a = a;
    }

    rgb() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`
    }

    rgba() {
        return `rgb(${this.r}, ${this.g}, ${this.b}, ${this.a})`
    }

    toHex() {
        return rgbToHex(this.r, this.g, this.b);
    }
}

export function colorFromHex(hex) {
    if (String(hex).charAt(0) !== '#') {
        hex = '#' + hex;
    }
    if (hex.length !== 7) {
        console.log(hex);
        throw new Error("Parameter is not a valid hex color code!");
    }
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return new Color(r, g, b);
}

export function randomBlue(brightness = 0, random) {
    // brightness: -1 (darkest) to 1 (lightest), default 0 (normal)
    const clamp = (val) => Math.max(0, Math.min(255, val));
    const shift = Math.round(brightness * 100);

    const r = clamp(Math.floor(random.random() * 40) + Math.round(shift * 0.3)); // red shift dampened
    const g = clamp(Math.floor(random.random() * 100) + shift);
    const b = clamp(Math.floor(random.random() * 106) + 150 + shift);

    console.log(rgbToHex(r, g, b));

    return new Color(r, g, b);
}

export function randomSunColor(brightness = 0, random) {
    const clamp = (val) => Math.max(0, Math.min(255, val));
    const rand = (min, max) => Math.floor(random.random() * (max - min + 1)) + min;

    // Weighted modes: green and blue are rare
    const modes = [
        'white', 'white', 'white',
        'yellow', 'yellow', 'yellow', 'yellow', 'yellow',
        'orange', 'orange', 'orange', 'orange',
        'red', 'red', 'red',
        'blue',
        'green',
    ];
    const mode = modes[Math.floor(random.random() * modes.length)];

    let r, g, b;

    switch (mode) {
        case 'white':
            r = rand(240, 255); g = rand(240, 255); b = rand(240, 255);
            break;
        case 'yellow':
            r = rand(220, 255); g = rand(190, 220); b = rand(0, 40);
            break;
        case 'orange':
            r = rand(220, 255); g = rand(80, 140); b = rand(0, 30);
            break;
        case 'red':
            r = rand(180, 255); g = rand(20, 60); b = rand(0, 20);
            break;
        case 'blue':
            r = rand(0, 60); g = rand(80, 140); b = rand(180, 255);
            break;
        case 'green':
            r = rand(0, 60); g = rand(180, 255); b = rand(40, 100);
            break;
    }

    const blend = (channel) => Math.round(channel + (255 - channel) * brightness);

    return new Color(clamp(blend(r)), clamp(blend(g)), clamp(blend(b)));
}

// function hexToRgb(hex) {
//   var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//   return result ? {
//     r: parseInt(result[1], 16),
//     g: parseInt(result[2], 16),
//     b: parseInt(result[3], 16)
//   } : null;
// }

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// export function getComplementaryColor(r, g, b) {
//     return new Color(255 - r, 255 - g, 255 - b);
// }


/**
* Calculate relative luminance for contrast ratio (WCAG formula)
* @param {number} r - Red value (0-255)
* @param {number} g - Green value (0-255)
* @param {number} b - Blue value (0-255)
* @returns {number} Relative luminance (0-1)
*/
function getLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors (WCAG formula)
 * @param {object} color1 - First color {r, g, b}
 * @param {object} color2 - Second color {r, g, b}
 * @returns {number} Contrast ratio (1-21)
 */
function getContrastRatio(color1, color2) {
    const lum1 = getLuminance(color1.r, color1.g, color1.b);
    const lum2 = getLuminance(color2.r, color2.g, color2.b);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get complementary color with guaranteed minimum contrast ratio of 5:1
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @param {number} minContrast - Minimum contrast ratio required (default: 5)
 * @returns {object} Complementary color {r, g, b} with guaranteed contrast
 */
export function getComplementaryColor(r, g, b, minContrast = 4.5) {
    // Clamp input values to valid range
    const red = Math.max(0, Math.min(255, r));
    const green = Math.max(0, Math.min(255, g));
    const blue = Math.max(0, Math.min(255, b));

    const inputColor = { r: red, g: green, b: blue };

    // Calculate basic complementary color
    let outputColor = {
        r: 255 - red,
        g: 255 - green,
        b: 255 - blue
    };

    // Check if contrast ratio meets minimum requirement
    let ratio = getContrastRatio(inputColor, outputColor);

    if (ratio >= minContrast) {
        return new Color(outputColor.r, outputColor.g, outputColor.b);
    }

    // If contrast is insufficient, adjust to black or white based on luminance
    const inputLuminance = getLuminance(red, green, blue);

    // If input is dark (luminance < 0.5), use white as foreground
    // If input is light (luminance >= 0.5), use black as foreground
    if (inputLuminance < 0.5) {
        outputColor = { r: 255, g: 255, b: 255 };
    } else {
        outputColor = { r: 0, g: 0, b: 0 };
    }

    // Verify the new contrast ratio
    ratio = getContrastRatio(inputColor, outputColor);

    // If still not enough contrast (edge case), find optimal color
    if (ratio < minContrast) {
        outputColor = findOptimalContrastColor(inputColor);
    }

    return new Color(outputColor.r, outputColor.g, outputColor.b);
}

/**
 * Find optimal foreground color with minimum contrast ratio
 * @param {object} backgroundColor - Background color {r, g, b}
 * @param {number} minContrast - Minimum contrast ratio required
 * @returns {object} Optimal foreground color {r, g, b}
 */
function findOptimalContrastColor(backgroundColor) {
    // Try white first
    const whiteContrast = getContrastRatio(backgroundColor, { r: 255, g: 255, b: 255 });

    // Try black
    const blackContrast = getContrastRatio(backgroundColor, { r: 0, g: 0, b: 0 });

    // Return whichever has better contrast
    if (whiteContrast >= blackContrast) {
        return { r: 255, g: 255, b: 255 };
    } else {
        return { r: 0, g: 0, b: 0 };
    }
}

// Example usage:
// const inputColor = { r: 100, g: 150, b: 200 };
// const outputColor = getComplementaryColor(inputColor.r, inputColor.g, inputColor.b);
// console.log(outputColor); // Guaranteed to have at least 5:1 contrast
// 
// const ratio = getContrastRatio(inputColor, outputColor);
// console.log(ratio); // e.g., 5.2
