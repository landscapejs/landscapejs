import { Color } from './color.js'
import { Star } from './star.js'
import { Mountain } from './mountain.js'
import { Moon } from './moon.js'
import { randomInt } from './random.js';


let minNumberOfMountains = 5;
let maxNumberOfMountains = 5;


class Landscape {
    constructor(canvas, drawSky = true, drawStars = true, drawMoon = true, drawMountains = true, drawGround = true, numberOfMountains = 0, dayTime = false, underwater = false) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.moon = null;
        this.stars = [];
        this.mountains = [];
        this.numberOfMountains = numberOfMountains > 0 ? numberOfMountains : randomInt(minNumberOfMountains, maxNumberOfMountains);
        this.drawSky = drawSky;
        this.drawStars = drawStars;
        this.drawMoon = drawMoon;
        this.drawMountains = drawMountains;
        this.drawGround = drawGround;
        this.init();
    }

    init() {
        if (this.numberOfMountains > maxNumberOfMountains) {
            this.numberOfMountains = maxNumberOfMountains;
        } else if (this.numberOfMountains < minNumberOfMountains) {
            this.numberOfMountains = minNumberOfMountains;
        }
        console.log(`Number of mountains: ${this.numberOfMountains}`)
        this.createColorPallete();

        if (this.drawMountains) {
            this.createMountains();
        }
        if (this.drawStars) {
            this.createStars();
        }
        if (this.drawMoon) {
            this.createMoon();
        }
    }

    createColorPallete() {
        this.red = Math.floor((Math.random() * 200));
        this.green = Math.floor((Math.random() * 200));
        this.blue = Math.floor((Math.random() * 220));
        this.lightBlue = Math.floor(this.blue / 100 * (Math.random() * 100));

        let skyColor1 = new Color(this.red - 10, this.green - 10, this.blue + 50, 0.7);
        let skyColor2 = new Color(this.red + 200, this.green + 200, this.blue + 60, 0);

        this.colorPallete = [];
        // let variant = 150 / this.numberOfMountains;
        for (let i = 0; i < this.numberOfMountains; i++) {
            this.colorPallete.push(new Color(this.red + (i * 30), this.green + (i * 30), this.blue + (i * 30)));
        }

        this.colorPallete.push(skyColor1);
        this.colorPallete.push(skyColor2);

        // console.log(this.colorPallete);
    }

    createMountains() {
        let mountainSeed = Math.random() * (.015 - .005) + .005;
        let heightSeed = Math.random() * (this.height * .005 - 2.75) + 2.75;
        // let heightSub = 1 / this.numberOfMountains;
        let heightSub = .35;
        let _heightSeed = heightSeed;
        let _mountainSeed = mountainSeed;

        for (let i = 0; i < this.numberOfMountains; i++) {
            this.blur = 0;
            // if (i > this.numberOfMountains / 2) {
            //    this.blur = i > 2 ? 2 : i; 
            // }

            if (i >= 0) {
                _heightSeed = heightSeed - (heightSub * (i));
                _mountainSeed = mountainSeed / i;
            }

            console.log(`heightSeed (new): ${heightSeed - (heightSub * (i))}`);

            // this.mountains.push(new Mountain(this.canvas, 0, heightSeed - (heightSub * (i)), 0, 4, mountainSeed, this.colorPallete[this.numberOfMountains - i - 1], this.blur));
            this.mountains.push(new Mountain(this.canvas, 0, _heightSeed, 0, 4, _mountainSeed, this.colorPallete[i], this.blur));

            // var mount1 = new Mountain(canvas, 0, heightSeed, 0, 4, mountainSeed, new Color(r + 50, g + 50, b + 50));
            // var mount2 = new Mountain(canvas, 0, heightSeed - heightSub, 0, 4, mountainSeed / 1, new Color(r + 40, g + 40, b + 40));
            // var mount3 = new Mountain(canvas, 0, heightSeed - (heightSub * 1.5), 0, 4, mountainSeed / 2, new Color(r + 20, g + 20, b + 20));
            // var mount4 = new Mountain(canvas, 0, heightSeed - (heightSub * 2), 0, 4, mountainSeed / 3, new Color(r, g, b));
            // var mount5 = new Mountain(canvas, 0, heightSeed - (heightSub * 2.5), 0, 4, mountainSeed / 4, new Color(r - 20, g - 20, b - 20));
            // var mount6 = new Mountain(canvas, 0, heightSeed - (heightSub * 3), 0, 4, mountainSeed / 8, new Color(r - 40, g - 40, b - 40));

        }
        console.log(this.mountains);
    }

    createStars() {
        let numberOfStars = randomInt(this.width * 0.1, this.width);
        // console.log(`Number of stars: ${numberOfStars}`);
        for (let i = 0; i < numberOfStars; i++) {
            this.stars.push(new Star(this.canvas, randomInt(0, this.width), randomInt(0, this.height)));
        }
    }

    createMoon() {
        let moonRadius = randomInt(this.height / 100, this.height / 10);
        let moonX = randomInt(2 * moonRadius, this.width - 2 * moonRadius);
        let moonY = parseInt((Math.random() * this.height / 5) + moonRadius);

        let colors = ['#ffaeaeff', '#ffffffff', '#fffefdff', '#fff0f0ff', '#ffffffff', '#ff8caeff', '#ffa9bdff', '#ffb68cff', '#ffcdcdff', '#FFFFFF'];
        // let lightColor = '#fff';
        let lightColor = colors[Math.floor(Math.random() * colors.length)];
        let darkColor = this.colorPallete[this.colorPallete.length - 2].rgb();
        this.moon = new Moon(this.canvas, Math.random(), moonX, moonY, moonRadius, lightColor, darkColor, true);
    }

    draw() {
        if (this.drawSky) {
            this.ctx.fillStyle = this.colorPallete[this.colorPallete.length - 2].rgb();
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        if (this.drawStars) {
            for (let star of this.stars) {
                star.draw();
            }
            for (let i = randomInt(0, 5); i > 0; i--) {
                var s = new Star(this.canvas, randomInt(0, this.width), randomInt(0, this.height / 2));
                s.draw(true);
            }
        }
        if (this.drawMoon) {
            this.moon.draw();
        }
        if (this.drawMountains) {
            for (let i = this.numberOfMountains - 1; i >= 0; i--) {
                this.mountains[i].draw();
            }
        }
        if (this.drawGround) {
            let color1 = this.colorPallete[this.colorPallete.length - 2];
            let color2 = this.colorPallete[this.colorPallete.length - 1];
            let color3 = new Color(color1.r - 100, color1.g - 100, color1.b - 100);
            let color4 = new Color(color1.r + 100, color1.g + 100, color1.b + 100);
            setGradient(this.canvas, 0, this.height - this.height / 100 * 45, this.width, this.height / 100 * 5, color2, color1);
            setGradient(this.canvas, 0, this.height - this.height / 100 * 40, this.width, this.height / 100 * 40, color3, color4);
        }
    }
}

let width = window.innerWidth;
let height = window.innerHeight;

var landscapejsCanvas = document.getElementById('landscapejs');
landscapejsCanvas.width = width;
landscapejsCanvas.height = height;
let landscapejs = new Landscape(landscapejsCanvas);
landscapejs.draw();


function setGradient(canvas, x, y, w, h, c1, c2, axis) {
    let ctx = canvas.getContext('2d');
    let gradient = ctx.createLinearGradient(x, y, x, y + h);
    console.log(c1.rgba())
    console.log(c2.rgba())
    gradient.addColorStop(0, c1.rgba());
    gradient.addColorStop(1, c2.rgba());

    // Set the fill style and draw a rectangle
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, w, h);

    // noFill();
    // if (axis === Y_AXIS) {
    //     for (var i = y; i <= y + h; i++) {
    //         var inter = map(i, y, y + h, 0, 1);
    //         var c = lerpColor(c1, c2, inter);
    //         stroke(c);
    //         line(x, i, x + w, i);
    //     }
    // }
}


function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function copyStringToClipboard(e) {
    const rgb = e.target.style.backgroundColor;
    const splitRGB = rgb.replace(/^(rgb|rgba)\(/, '').replace(/\)$/, '').replace(/\s/g, '').split(',');
    const [r, g, b] = splitRGB;
    const hex = rgbToHex(parseInt(r), parseInt(g), parseInt(b));
    navigator.clipboard.writeText(hex);
    e.target.firstElementChild.innerHTML = 'Copied!';
}

function outFunc(e) {
    e.target.firstElementChild.innerHTML = 'Copy';
}
