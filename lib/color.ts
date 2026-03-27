// ---------------------------------------------------------------------------
// Shared interfaces & helpers
// ---------------------------------------------------------------------------

export interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface RandomSource {
    random(): number;
}

const clamp = (val: number, min = 0, max = 255): number =>
    Math.max(min, Math.min(max, val));

function componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
}

function rgbToHex(r: number, g: number, b: number): string {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

// ---------------------------------------------------------------------------
// Color class
// ---------------------------------------------------------------------------

export class Color {
    readonly r: number;
    readonly g: number;
    readonly b: number;
    readonly a: number;

    constructor(r: number, g: number, b: number, a = 1) {
        this.r = clamp(Math.trunc(r));
        this.g = clamp(Math.trunc(g));
        this.b = clamp(Math.trunc(b));
        this.a = clamp(a, 0, 1);
    }

    rgb(): string {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    /** Returns a valid CSS rgba() string. */
    rgba(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    hex(): string {
        return rgbToHex(this.r, this.g, this.b);
    }

    withAlpha(a: number): Color {
        return new Color(this.r, this.g, this.b, a);
    }
}

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

export function colorFromHex(hex: string): Color {
    if (!hex.startsWith('#')) hex = `#${hex}`;
    if (hex.length !== 7) {
        throw new Error(`"${hex}" is not a valid 6-digit hex color.`);
    }
    return new Color(
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
    );
}

// ---------------------------------------------------------------------------
// Random color generators
// ---------------------------------------------------------------------------

export function randomBlue(brightness = 0, random: RandomSource): Color {
    const shift = Math.round(brightness * 100);
    return new Color(
        Math.floor(random.random() * 40) + Math.round(shift * 0.3),
        Math.floor(random.random() * 100) + shift,
        Math.floor(random.random() * 106) + 150 + shift,
    );
}

type SunMode = 'white' | 'yellow' | 'orange' | 'red' | 'blue' | 'green';

/**
 * Weighted table: each entry is [mode, weight].
 * Replaces the repeated-string array from the original.
 */
const SUN_MODE_WEIGHTS: ReadonlyArray<[SunMode, number]> = [
    ['white',  3],
    ['yellow', 5],
    ['orange', 4],
    ['red',    3],
    ['blue',   1],
    ['green',  1],
];

const SUN_TOTAL_WEIGHT = SUN_MODE_WEIGHTS.reduce((sum, [, w]) => sum + w, 0);

function pickSunMode(random: RandomSource): SunMode {
    let target = random.random() * SUN_TOTAL_WEIGHT;
    for (const [mode, weight] of SUN_MODE_WEIGHTS) {
        target -= weight;
        if (target <= 0) return mode;
    }
    return 'white';
}

export function randomSunColor(brightness = 0, random: RandomSource): Color {
    const rand = (min: number, max: number): number =>
        Math.floor(random.random() * (max - min + 1)) + min;

    const mode = pickSunMode(random);

    let r: number, g: number, b: number;
    switch (mode) {
        case 'white':  r = rand(240, 255); g = rand(240, 255); b = rand(240, 255); break;
        case 'yellow': r = rand(220, 255); g = rand(190, 220); b = rand(0,   40);  break;
        case 'orange': r = rand(220, 255); g = rand(80,  140); b = rand(0,   30);  break;
        case 'red':    r = rand(180, 255); g = rand(20,   60); b = rand(0,   20);  break;
        case 'blue':   r = rand(0,    60); g = rand(80,  140); b = rand(180, 255); break;
        case 'green':  r = rand(0,    60); g = rand(180, 255); b = rand(40,  100); break;
    }

    const blend = (ch: number): number =>
        clamp(Math.round(ch + (255 - ch) * brightness));

    return new Color(blend(r), blend(g), blend(b));
}

// ---------------------------------------------------------------------------
// Contrast utilities (WCAG)
// ---------------------------------------------------------------------------

/** Linearises a single 0-255 channel, avoiding mutation. */
function linearise(c: number): number {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function getLuminance({ r, g, b }: RGB): number {
    return 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b);
}

function getContrastRatio(a: RGB, b: RGB): number {
    const l1 = getLuminance(a);
    const l2 = getLuminance(b);
    const lighter = Math.max(l1, l2);
    const darker  = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

export function getComplementaryColor(r: number, g: number, b: number): Color {
    return new Color(255 - r, 255 - g, 255 - b);
}

/**
 * Returns a complementary color guaranteed to meet the given minimum WCAG
 * contrast ratio (default 4.5 : 1 — AA level).
 * Falls back to whichever of pure white / pure black has the higher ratio.
 */
export function getComplementaryColor2(
    r: number,
    g: number,
    b: number,
    minContrast = 4.5,
): Color {
    const input: RGB = { r: clamp(r), g: clamp(g), b: clamp(b) };
    const complement: RGB = { r: 255 - input.r, g: 255 - input.g, b: 255 - input.b };

    if (getContrastRatio(input, complement) >= minContrast) {
        return new Color(complement.r, complement.g, complement.b);
    }

    const WHITE: RGB = { r: 255, g: 255, b: 255 };
    const BLACK: RGB = { r: 0,   g: 0,   b: 0   };
    const best = getContrastRatio(input, WHITE) >= getContrastRatio(input, BLACK)
        ? WHITE
        : BLACK;

    return new Color(best.r, best.g, best.b);
}
