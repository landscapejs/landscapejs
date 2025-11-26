import { Color } from "./color.js";
import { randomInt } from "./random.js";


export class Star {
    constructor(canvas, x, y) {
        this.canvas = canvas;
        this.x = x;
        this.y = y;
    }

    draw(shootingStar=false) {
        let randSize = random(3);
        let ctx = this.canvas.getContext('2d');
        ctx.save();
        let color = new Color(randomInt(200, 255), randomInt(200, 255), randomInt(200, 255), Math.random());
        ctx.fillStyle = color.rgba();
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, randSize, randSize, 0, 0, 2 * Math.PI);
        if (shootingStar) {
            console.log('shooting star');
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            let endX = randomInt(this.x-50, this.x+50);
            let endY = randomInt(this.y-50, this.y+50);
            ctx.lineTo(endX, endY);
            let gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
            gradient.addColorStop(0, color.rgba());
            gradient.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`);
            ctx.strokeStyle = gradient;
            ctx.stroke();
        }
        ctx.fill();
        ctx.restore();
    }
}

function random(max) {
  return Math.floor(Math.random() * max);
}
