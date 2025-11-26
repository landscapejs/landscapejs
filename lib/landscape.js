import { Color, colorFromHex, randomBlue } from './color.js'
import { Star } from './star.js'
import { Mountain } from './mountain.js'
import { Moon } from './moon.js'
import { Sun } from './sun.js'
import { Random } from './random.js'
import { Codec } from './encode.js'


let minNumberOfMountains = 3;
let maxNumberOfMountains = 25;
let minNumberOfWaves = 3;
let maxNumberOfWaves = 12;


export class LandscapeJS {
    constructor({ container, seed = 0, callback = null, randomSeed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER), drawSky = true, drawStars = true, drawMoon = true, drawSun = true, drawMountains = true, drawWaves = true, drawGround = true, drawWater = true, drawBubbles = true, numberOfMountains = 0, numberOfWaves = 0, dayTime = Math.random() < 0.5, underwater = false, horizontLine = .5, skyColor1 = null, skyColor2 = null, groundColor1 = null, groundColor2 = null } = {}) {
        try {
            const div = document.querySelector(container);
            this.canvas = document.createElement("canvas");
            div.appendChild(this.canvas);
            // this.canvas = document.querySelector(canvas);
            this.ctx = this.canvas.getContext("2d", { willReadFrequently: true })
            this.scale = window.devicePixelRatio || 1;

            // const w = this.canvas.width;
            // const h = this.canvas.height;
            const w = div.offsetWidth;
            const h = div.offsetHeight;
            console.log(`${w},${h}`)
            this.canvas.style.width = `${w}px`;
            this.canvas.style.height = `${h}px`;

            this.canvas.width = Math.floor(w * this.scale);
            this.canvas.height = Math.floor(h * this.scale);

            // this.ctx.scale(this.scale, this.scale);

            // const width = Math.floor(this.canvas.width * dpr);
            // const height = Math.floor(this.canvas.width * dpr);
            // this.canvas.width = width;
            // this.canvas.height = height;
            // this.canvas.style.width = width + 'px';
            // this.canvas.style.height = height + 'px';
            // this.ctx.scale(dpr, dpr);
        } catch (error) {
            throw error;
            // throw new Error(`Could not find a canvas element with the selector ${canvas}`);
        }
        this.callback = callback
        this.codec = new Codec();
        this.moon = null;
        this.sun = null;
        this.stars = [];
        this.bubbles = [];
        this.mountains = [];
        this.waves = [];
        let seedIsValid = false;
        if (typeof (arguments[1]) === "undefined") {
            arguments[1] = {};
        }
        if (seed) {
            console.log(`seed: ${seed}`);
            console.log(this.codec.decode(seed));
            let options;
            try {
                options = JSON.parse(this.codec.decode(seed));
                if ("randomSeed" in options) {
                    randomSeed = options.randomSeed;
                }
                if ("drawSky" in options) {
                    drawSky = options.drawSky;
                }
                if ("drawStars" in options) {
                    drawStars = options.drawStars;
                }
                if ("drawMoon" in options) {
                    drawMoon = options.drawMoon;
                }
                if ("drawSun" in options) {
                    drawSun = options.drawSun;
                }
                if ("drawMountains" in options) {
                    drawMountains = options.drawMountains;
                }
                if ("drawWaves" in options) {
                    drawWaves = options.drawWaves;
                }
                if ("drawGround" in options) {
                    drawGround = options.drawGround;
                }
                if ("drawWater" in options) {
                    drawWater = options.drawWater;
                }
                if ("drawBubbles" in options) {
                    drawBubbles = options.drawBubbles;
                }
                if ("numberOfMountains" in options) {
                    numberOfMountains = options.numberOfMountains;
                }
                if ("numberOfWaves" in options) {
                    numberOfWaves = options.numberOfWaves;
                }
                if ("dayTime" in options) {
                    dayTime = options.dayTime;
                }
                if ("underwater" in options) {
                    underwater = options.underwater;
                }
                if ("horizontLine" in options) {
                    horizontLine = options.horizontLine;
                }
                if ("skyColor1" in options) {
                    skyColor1 = options.skyColor1;
                }
                if ("skyColor2" in options) {
                    skyColor2 = options.skyColor2;
                }
                if ("groundColor1" in options) {
                    groundColor1 = options.groundColor1;
                }
                if ("groundColor2" in options) {
                    groundColor2 = options.groundColor2;
                }
            } catch (error) {
                console.error(`Invalid seed: ${seed}`);
            }
        }
        if (!seedIsValid) {
            if ("seed" in arguments[1]) {
                delete arguments[1].seed;
            }
            arguments[1].randomSeed = randomSeed;
            arguments[1].dayTime = dayTime;
        }
        this.randomSeed = randomSeed;
        this.random = new Random(this.randomSeed);
        console.log(`seed: ${seed}`);
        console.log(JSON.stringify(arguments[1]));
        this.seed = this.codec.encode(JSON.stringify(arguments[1]))
        console.log(this.seed);
        this.numberOfMountains = !numberOfMountains ? this.random.int(minNumberOfMountains, maxNumberOfMountains) : numberOfMountains;
        this.numberOfWaves = !numberOfWaves ? this.random.int(minNumberOfWaves, maxNumberOfWaves) : numberOfWaves;
        this.drawSky = drawSky;
        this.drawStars = drawStars;
        this.drawMoon = drawMoon;
        this.drawSun = drawSun;
        this.drawMountains = drawMountains;
        this.drawGround = drawGround;
        this.drawWater = drawWater;
        this.drawBubbles = drawBubbles;
        this.dayTime = dayTime;
        this.underwater = underwater;
        this.drawWaves = drawWaves;
        this.horizontLine = horizontLine;
        this.skyColor1 = skyColor1;
        this.skyColor2 = skyColor2;
        this.groundColor1 = groundColor1;
        this.groundColor2 = groundColor2;
        this.init();
    }

    init() {
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.horizontLineHeight = this.height * this.horizontLine;
        this.baseLineHeight = this.height;
        if (this.underwater) {
            // this.baseLineHeight = this.horizontLineHeight * .5;
            this.baseLineHeight = this.horizontLineHeight + 50;
        }

        if (this.numberOfMountains > maxNumberOfMountains) {
            this.numberOfMountains = maxNumberOfMountains;
        } else if (this.numberOfMountains < minNumberOfMountains) {
            this.numberOfMountains = minNumberOfMountains;
        }

        if (this.numberOfWaves > maxNumberOfWaves) {
            this.numberOfWaves = maxNumberOfWaves;
        } else if (this.numberOfWaves < minNumberOfWaves) {
            this.numberOfWaves = minNumberOfWaves;
        }

        console.log(`Day time: ${this.dayTime}`);
        console.log(`HorizontLine: ${this.horizontLine}`);
        this.createColorPallete();

        if (!this.underwater) {
            console.log(`Number of mountains: ${this.numberOfMountains}`);

            if (this.drawMountains) {
                this.createMountains();
            }
            if (this.drawStars) {
                this.createStars();
            }
            if (!this.dayTime && this.drawMoon) {
                this.createMoon();
            }
            if (this.dayTime && this.drawSun) {
                this.createSun();
            }
        } else {
            console.log(`Under water: ${this.underwater}`);
            if (this.drawWaves) {
                this.createWaves();
            }
            if (this.drawStars) {
                this.createStars();
            }
            if (this.drawBubbles) {
                this.createBubbles();
            }
            if (this.drawMoon) {
                this.createMoon();
            }
        }
    }

    createColorPallete() {
        const isBlue = this.random.random() < 0.25;
        const isBright = this.random.random() < 0.5;

        let rStart = this.dayTime ? 150 : 0;
        let gStart = this.dayTime ? 150 : 0;
        let bStart = this.dayTime ? 150 : 0;
        let rEnd = this.dayTime ? 255 : 200;
        let gEnd = this.dayTime ? 255 : 200;
        let bEnd = this.dayTime ? 255 : 200;

        let rVariant = isBright ? 200 : -185;
        let gVariant = isBright ? 200 : -175;
        let bVariant = isBright ? 60 : -55;

        if (this.underwater) {
            console.log("underwater!!!!")
            rStart = 100;
            gStart = 100;
            bStart = 100;
            rEnd = 255;
            gEnd = 255;
            bEnd = 255;
        }

        let red = this.random.int(rStart, rEnd);
        let green = this.random.int(gStart, gEnd);
        let blue = this.random.int(bStart, bEnd);

        if (isBlue) {
            let brightness = !this.dayTime ? this.random.random() * - 1 : this.random.random();
            if (isBright) {
                console.log("morning!!!!")
                brightness = 1
            }
            let c = randomBlue(brightness, this.random);
            console.log("Sky is blue!");
            red = c.r;
            green = c.g;
            blue = c.b;
        }

        let red2 = red + rVariant;
        let green2 = green + gVariant;
        let blue2 = blue + bVariant;

        if (this.skyColor1) {
            try {
                let color = colorFromHex(this.skyColor1);
                red = color.r;
                green = color.g;
                blue = color.b;
            } catch (error) {
                console.error(`Invalid color code: ${this.skyColor1}`);
            }
        }
        if (this.skyColor2) {
            try {
                let color = colorFromHex(this.skyColor2);
                red2 = color.r;
                green2 = color.g;
                blue2 = color.b;
            } catch (error) {
                console.error(`Invalid color code: ${this.skyColor2}`);
            }
        }

        console.log(`Sky 1 - red: ${red}, green: ${green}, blue: ${blue}`);
        console.log(`Sky 2 - red: ${red2}, green: ${green2}, blue: ${blue2}`);

        // this.lightBlue = Math.floor(this.blue / 100 * (this.random.random() * 100));
        // this.darkBlue = Math.floor(this.blue / 200 * (this.random.random() * 100));

        let numberOfColors = this.underwater ? this.numberOfWaves : this.numberOfMountains;

        this.colorPallete = [];
        let variant_r = (rEnd - red) / numberOfColors;
        let variant_g = (gEnd - green) / numberOfColors;
        let variant_b = (bEnd - blue) / numberOfColors;

        for (let i = 0; i < numberOfColors; i++) {
            let alpha = 1;
            // if (i === numberOfColors - 1) {
            //     alpha = .1
            // }
            // if (i === numberOfColors - 2) {
            //     alpha = .2
            // }
            // if (i === numberOfColors - 3) {
            //     alpha = .3
            // }
            this.colorPallete.push(new Color(red + (i * variant_r), green + (i * variant_g), blue + (i * variant_b), alpha));
        }

        if (isBright) {
            this.skyColor1 = new Color(red2, green2, blue2, 1);
            this.colorPallete.push(this.skyColor1);
            this.skyColor2 = new Color(red, green, blue, 1);
            this.colorPallete.push(this.skyColor2);
        } else {
            this.skyColor1 = new Color(red, green, blue, 1);
            this.colorPallete.push(new Color(red, green, blue, 1));
            this.skyColor2 = new Color(red2, green2, blue2, 1);
            this.colorPallete.push(new Color(red2, green2, blue2, 1));
        }

        console.log(this.colorPallete);
    }

    createMountains() {
        let mountainSeed = this.random.float(0.003, 0.03);
        let heightSeed = this.random.float(3.3, 7);
        let heightSub = this.random.float(.1, .26);
        heightSub = (0.324 - ((this.numberOfMountains / maxNumberOfMountains) * 100) * 0.0016) - 0.064;

        console.log(`heightSeed: ${heightSeed}`);
        console.log(`mountainSeed: ${mountainSeed}`);
        console.log(`heightSub: ${heightSub}`);

        let _heightSeed = heightSeed;
        let _mountainSeed = mountainSeed;

        for (let i = 0; i < this.numberOfMountains; i++) {
            let blur = 0;
            // let blur = i - (this.numberOfMountains - 3);
            // if (this.blur < 0) {
            //     this.blur = 0;
            // }

            if (i > 0) {
                _heightSeed = heightSeed - (heightSub * (i));
                _mountainSeed = mountainSeed / i;
            }
            this.mountains.push(new Mountain(this.canvas, this.random, this.horizontLineHeight, 0, _heightSeed, 0, 4, _mountainSeed, this.colorPallete[i], blur, true, 1));
        }
        console.log(this.mountains);
    }

    createWaves() {
        let mountainSeed = this.random.float(0.003, 0.08);
        let heightSeed = this.random.float(3.3, 7);
        let heightSub = this.random.float(.1, .26);
        heightSub = (0.324 - ((this.numberOfMountains / maxNumberOfMountains) * 100) * 0.0016) - 0.064;

        heightSeed = 4
        mountainSeed = .004
        heightSub = 10

        console.log(`heightSeed: ${heightSeed}`);
        console.log(`mountainSeed: ${mountainSeed}`);
        console.log(`heightSub: ${heightSub}`);

        let _heightSeed = heightSeed;
        let _mountainSeed = mountainSeed;
        let _horizontLineHeight = this.horizontLineHeight;

        // _horizontLineHeight = _horizontLineHeight + ((this.numberOfWaves + 6) * heightSeed);
        _horizontLineHeight = _horizontLineHeight + _horizontLineHeight * 2;

        // _horizontLineHeight = _horizontLineHeight + 150
        console.log(`horizontLineHeight: ${_horizontLineHeight}`);

        for (let i = 0; i < this.numberOfWaves; i++) {
            // this.blur = i - (this.numberOfWaves - 3);
            // if (this.blur < 0) {
            //     this.blur = 0;
            // }
            if (i > 0) {
                let gap = (heightSub * (i * .1));
                if (this.underwater) {
                    gap = gap * -1;
                }
                _heightSeed = heightSeed + gap;
                // _mountainSeed = _mountainSeed / i;
                _horizontLineHeight -= gap;
            }
            // this.waves.push(new Mountain(this.canvas, _horizontLineHeight, 0, _heightSeed, 0, 4, _mountainSeed, this.colorPallete[i], this.blur, false, 3));
            this.waves.push(new Mountain(this.canvas, this.random, _horizontLineHeight, 0, _heightSeed, 0, 4, _mountainSeed, new Color(255, 255, 255), 0, false, 3));
        }
        console.log(this.waves);
    }

    createStars() {
        let numberOfStars = this.random.int(this.width * 0.1, this.width);
        // console.log(`Number of stars: ${numberOfStars}`);
        for (let i = 0; i < numberOfStars; i++) {
            this.stars.push(new Star(this.canvas, this.random, this.random.int(0, this.width), this.random.int(0, this.horizontLineHeight)));
        }
    }

    createBubbles() {
        // let numberOfBubbles = this.random.int(this.width * 0.1, this.width * 0.15);
        let numberOfBubbles = this.random.int(this.width * .02, this.width * .05);
        console.log(`Number of bubbles: ${numberOfBubbles}`);
        for (let i = 0; i < numberOfBubbles; i++) {
            this.bubbles.push(new Star(this.canvas, this.random, this.random.int(0, this.width), this.random.int(this.horizontLineHeight + this.baseLineHeight, this.height)));
        }
    }

    createMoon() {
        let moonRadius = this.random.int(this.height / 70, this.height / 7);
        let x = this.random.int(2 * moonRadius, this.width - 2 * moonRadius);
        let y = parseInt((this.random.random() * this.height / 6) + moonRadius);
        let colors = ['#ffffff', '#fffefd', '#fff0f0', '#ffcdcd'];

        // let lightColor = '#fff';
        let lightColor = colors[this.random.int(0, colors.length - 1)];
        let darkColor = this.colorPallete[this.colorPallete.length - 1].rgb();
        this.moon = new Moon(this.canvas, this.random, this.random.random(), x, y, moonRadius, lightColor, darkColor);
    }

    createSun() {
        let radius = this.random.int(this.height / 70, this.height / 7);
        let x = this.random.int(2 * radius, this.width - 2 * radius);
        let y = parseInt((this.random.random() * this.height / 6) + radius);
        this.sun = new Sun(this.canvas, this.random, this.random.random(), x, y, radius);
    }

    render() {
        if (this.underwater) {
            this.drawUnderWater();
        } else {
            this.drawLandscape();
        }
    }

    drawUnderWater() {
        this._drawSky();
        // this._drawGround();

        if (!this.drawWaves) {
            for (let i = this.waves.length - 1; i >= 0; i--) {
                this.waves[i].draw();
            }
        }

        // WATER
        if (this.drawWater) {
            //water
            let colors = ['#61aaff', '#1b8dbe', '#28c1d6', '#63d3de', '#a3e4f5', '#b8f4ea', '#008080', '#35b5ac', '#89d5d2', '#bbf1f1', '#053355', '#0B9ED2', '#0f5e9c', '#2389da', '#1ca3ec', '#5abcd8'];
            // let color3 = colorFromHex(colors[this.random.int(0, colors.length - 1)]);
            // let color4 = colorFromHex(colors[this.random.int(0, colors.length - 1)]);
            // setGradient(this.canvas,  0, this.horizontLineHeight, this.width, this.height - this.horizontLineHeight, color3, color4);

            //surface
            let c1 = new Color(255, 255, 255, 1);
            let c2 = new Color(255, 255, 255, 1);
            setGradient(this.canvas, 0, this.horizontLineHeight, this.width, this.height - this.horizontLineHeight, c2, c1);

            //radial
            let x = this.width / 2
            let r = this.width / 2;
            let grad = this.ctx.createRadialGradient(x, this.horizontLineHeight, r / 10, x, this.horizontLineHeight, r);
            grad.addColorStop(0, c2.rgba());
            grad.addColorStop(1, c1.rgba());
            this.ctx.fillStyle = grad;
            // this.ctx.fillRect(0, this.horizontLineHeight, this.width, this.height);

            //deep
            let c3 = new Color(0, 0, 0, 0);
            let c4 = new Color(0, 0, 35, 1)
            // setGradient(this.canvas, 0, this.height - (this.height - this.horizontLineHeight)/4, this.width, (this.height - this.horizontLineHeight)/4, c3, c4);
        }

        // BUBBLES
        if (this.drawBubbles) {
            for (let bubble of this.bubbles) {
                bubble.draw(false, true);
            }
        }
    }

    _drawSky() {
        setGradient(this.canvas, 0, 0, this.width, this.horizontLineHeight, this.colorPallete[this.colorPallete.length - 1], this.colorPallete[this.colorPallete.length - 2]);
        // this.ctx.fillStyle = this.colorPallete[this.colorPallete.length - 2].rgb();
        // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.dayTime) {
            // STARS
            if (this.drawStars) {
                for (let star of this.stars) {
                    star.draw();
                }
                // shooting stars
                for (let i = this.random.int(1, 5); i > 0; i--) {
                    var s = new Star(this.canvas, this.random, this.random.int(0, this.width), this.random.int(0, this.horizontLineHeight));
                    s.draw(true, false, false);
                }
                // polystars
                for (let i = this.random.int(3, 10); i > 0; i--) {
                    var s = new Star(this.canvas, this.random, this.random.int(0, this.width), this.random.int(0, this.horizontLineHeight));
                    s.draw(false, true, false);
                }
            }
            // MOON
            if (this.drawMoon) {
                this.moon.draw();
            }
        } else {
            // SUN
            if (this.drawSun) {
                this.sun.draw();
            }
        }
    }

    _drawGround(horizontLineHeight = 0) {
        if (horizontLineHeight === 0) {
            horizontLineHeight = this.horizontLineHeight;
        }
        let colors = ['#FFA500', '#C4A484', '#B7CCA9', '#E2D03B', '#800020', '#829FAD', '#93C572', '#4CBB17', '#32CD32', '#228B22', '#016403', '#6C8E68', '#3F9B0B', '#7CFC00', '#814f3e', '#96776e', '#c1a89a', '#a6e156', '#8d9f40', '#263525', '#301a17', '#1e281e', '#495846', '#121510', '#7f6f55', '#54534f', '#879b35', '#9c9495', '#e7e5ec', '#a47d5d', '#bfc0bd', '#ad8c89', '#d5adb3', '#9d8563', '#e3d3b8', '#435654'];
        let groundColor1 = colors[this.random.int(0, colors.length - 1)];
        let groundColor2 = colors[this.random.int(0, colors.length - 1)];

        if (this.groundColor1) {
            try {
                let color = colorFromHex(this.groundColor1);
                groundColor1 = color;
            } catch (error) {
                console.error(`Invalid color code: ${this.groundColor1}`);
            }
        }
        if (this.groundColor2) {
            try {
                let color = colorFromHex(this.groundColor2);
                groundColor2 = color;
            } catch (error) {
                console.error(`Invalid color code: ${this.groundColor2}`);
            }
        }

        let color1 = this.colorPallete[0];
        this.groundColor1 = groundColor1;
        this.groundColor2 = groundColor2;

        // if (this.underwater) {
        //     color1 = new Color(0, 0, 255);
        //     groundColor1 = new Color(0, 0, this.lightBlue).rgb();
        //     groundColor2 = new Color(0, 0, this.blue).rgb();
        // }

        this.ctx.fillStyle = color1;
        this.ctx.fillRect(0, horizontLineHeight, this.width, this.height - horizontLineHeight);

        let gradient = this.ctx.createLinearGradient(0, horizontLineHeight, 0, this.baseLineHeight);
        let blur = 2;
        gradient.addColorStop(0, color1.rgb());
        gradient.addColorStop(.2, groundColor1);
        gradient.addColorStop(1, groundColor2);
        this.ctx.fillStyle = gradient;
        this.ctx.filter = `blur(${blur}px)`;
        this.ctx.fillRect(-blur, horizontLineHeight - blur, this.width + blur, this.baseLineHeight - horizontLineHeight + blur);
        this.ctx.fillRect(0, horizontLineHeight, this.width, this.baseLineHeight - horizontLineHeight);

        let x = this.width / 2
        let y = horizontLineHeight;
        let r = this.width / 2;
        let ctx = this.canvas.getContext('2d');
        let grad = ctx.createRadialGradient(x, y, r / 5, x, y, r);
        let c1 = new Color(255, 255, 255, 0.3);
        let c2 = new Color(255, 255, 255, 0)
        grad.addColorStop(0, c1.rgba());
        grad.addColorStop(1, c2.rgba());
        ctx.fillStyle = grad;
        ctx.fillRect(0, y, this.width, this.height - this.baseLineHeight);
        ctx.fillRect(0, y, this.width, this.baseLineHeight - horizontLineHeight);

        // setGradient(this.canvas, 0, this.baseLineHeight - horizontLineHeight * 1.3, this.width, horizontLineHeight, new Color(255, 255, 255, 0), new Color(255, 255, 255, 1));
        setGradient(this.canvas, 0, horizontLineHeight, this.width, horizontLineHeight - horizontLineHeight * 1.07, new Color(255, 255, 255, .3), new Color(255, 255, 255, 0));
        setGradient(this.canvas, 0, horizontLineHeight, this.width, horizontLineHeight - this.baseLineHeight, new Color(255, 255, 255, .3), new Color(255, 255, 255, 0));
    }

    drawLandscape() {
        // SKY
        if (this.drawSky) {
            this._drawSky();
        }
        // MOUNTAINS
        if (this.drawMountains) {
            for (let i = this.mountains.length - 1; i >= 0; i--) {
                this.mountains[i].draw();
            }
        }
        // GROUND
        if (this.drawGround) {
            this._drawGround();
        }

        this.done();
    }

    done() {
        if (this.callback) {
            this.callback(this);
        }
    }

    // resize() {
    //     console.log("resizing...");
    //     console.log(this.canvas);
    //     const ctx = this.canvas.getContext('2d');
    //     const dpr = window.devicePixelRatio || 1;
    //     const width = window.innerWidth;
    //     const height = window.innerHeight;
    //     this.width = width;
    //     this.height = height;
    //     this.canvas.width = Math.floor(width * dpr);
    //     this.canvas.height = Math.floor(height * dpr);
    //     this.canvas.style.width = width + 'px';
    //     this.canvas.style.height = height + 'px';
    //     ctx.scale(dpr, dpr);
    // }
}

function setGradient(canvas, x, y, w, h, c1, c2, axis) {
    let ctx = canvas.getContext('2d');
    let gradient = ctx.createLinearGradient(x, y, x, y + h);
    gradient.addColorStop(0, c1.rgba());
    gradient.addColorStop(1, c2.rgba());
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, w, h);
    // if (axis === Y_AXIS) {
    //     for (var i = y; i <= y + h; i++) {
    //         var inter = map(i, y, y + h, 0, 1);
    //         var c = lerpColor(c1, c2, inter);
    //         stroke(c);
    //         line(x, i, x + w, i);
    //     }
    // }
}

