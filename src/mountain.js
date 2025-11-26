import { Color } from './color.js';
import { map } from './map.js'
import { noise } from './random.js';

let height = window.innerHeight / 2;
let width = window.innerWidth;


export class Mountain {
    constructor(canvas, cMin, cMax, nMin, nMax, tI, color, blur=0) {
        this.time = Math.random() * 99;
        this.currentMin = cMin;
        this.currentMax = cMax;
        this.newMin = nMin;
        this.newMax = nMax;
        this.timeInterval = tI;
        this.lengthInterval = 1;
        this.mLength = 0;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.height = canvas.height / 2;
        this.width = canvas.width;
        this.color = color;
        this.blur = blur;
    }

    getVertex() {
        this.time += this.timeInterval;
        this.mLength += this.lengthInterval;
        let noiseValue = noise(this.time);
        let x = map(noiseValue, this.currentMin, this.currentMax, this.newMin, -this.height + this.newMax);
        return [this.mLength + 1, this.height - (-x)];
    }

    draw() {
        this.ctx.save();
        this.ctx.fillStyle = this.color.rgba();
        let shape = new Path2D();
        shape.moveTo(0, height*2);
        for (let j = 0; j < this.width; j++) {
            let v = this.getVertex();
            shape.lineTo(v[0], v[1]);
        }
        shape.lineTo(width, height*2);
        shape.closePath();
        this.ctx.filter = `blur(${this.blur}px)`;
        this.ctx.fill(shape);
        this.ctx.restore();
    }
}
