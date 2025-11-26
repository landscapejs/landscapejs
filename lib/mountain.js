export class Mountain {
    constructor(canvas, random, horizontLineHeight, cMin, cMax, nMin, nMax, tI, color, blur = 0, fill = true, lengthInterval = 1) {
        this.random = random;
        this.time = this.random.random() * 99;
        this.currentMin = cMin;
        this.currentMax = cMax;
        this.newMin = nMin;
        this.newMax = nMax;
        this.timeInterval = tI;
        this.lengthInterval = lengthInterval;
        this.mLength = 0;
        this.canvas = canvas;
        this.scale = window.devicePixelRatio || 1;
        this.ctx = canvas.getContext('2d');
        // this.ctx.scale(this.scale, this.scale);
        this.baseHeight = this.canvas.height * .05;
        this.height = horizontLineHeight - this.baseHeight;
        this.width = canvas.width;
        this.color = color;
        this.blur = blur;
        this.fill = fill;
    }

    getVertex() {
        this.time += this.timeInterval;
        this.mLength += this.lengthInterval;
        let noiseValue = this.random.noise(this.time);
        let x = this.map(noiseValue, this.currentMin, this.currentMax, this.newMin, -this.height + this.newMax);
        return [this.mLength + 1, this.height - (-x)];
    }

    draw() {
        console.log('draw mountain')
        this.ctx.save();
        this.ctx.fillStyle = this.color.rgba();
        this.ctx.strokeStyle = this.color.rgba();
        this.ctx.filter = `blur(${this.blur}px)`;
        let shape = new Path2D();
        shape.moveTo(-100 * this.lengthInterval, this.height + this.baseHeight);
        for (let j = 0; j < this.width; j++) {
            let v = this.getVertex();
            shape.lineTo(v[0], v[1]);
        }
        if (this.fill) {
            shape.lineTo(this.width, this.height + this.baseHeight);
            shape.closePath();
            this.ctx.fill(shape);
        }
        this.ctx.stroke(shape);
        this.ctx.restore();
    }

    map(n, start1, stop1, start2, stop2, withinBounds) {
        const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
        if (!withinBounds) {
            return newval;
        }
        if (start2 < stop2) {
            return this.constrain(newval, start2, stop2);
        } else {
            return this.constrain(newval, stop2, start2);
        }
    }

    constrain(n, low, high) {
        return Math.max(Math.min(n, high), low);
    }

}
