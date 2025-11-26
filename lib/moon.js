const rad = Math.PI / 180;

export class Moon {
    constructor(canvas, random, phase = 0, x = 0, y = 0, r = 0, light = '#fff', dark = '#000') {
        this.random = random;
        this.phase = 360 * phase;
        this.lineWidth = 0;
        this.x = x > 0 ? x : canvas.width / 2;
        this.y = y > 0 ? y : canvas.height / 2;
        this.r = r > 0 ? r : 100;
        this.light = light;
        this.dark = dark;
        this.offset = this.lineWidth / 2;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.glow = this.r / 2;
        console.log(`Moon phase: ${this.phase}`);
        console.log(`Moon position: ${this.x}, ${this.y}`);
        // console.log(`Moon glow: ${this.glow}`);
        // console.log(`Moon position: ${this.x},${this.y}`);
        // console.log(`Moon radius: ${this.r}`);
        // console.log(`Moon offset: ${this.offset}`);
    }

    drawMoon() {
        this.ctx.translate(this.offset, this.offset);
        if (this.random.random() < 0.2) {
            this.ctx.rotate(this.random.int(0, 360) * Math.PI / 180);
        }
        this.ctx.beginPath();
        this.ctx.arc(this.r, this.r, this.r, 0, 2 * Math.PI, true);
        this.ctx.closePath();
        this.ctx.fillStyle = this.dark;
        this.ctx.fill();
    }

    /*
    drawMoon2() {
        this.ctx.translate(this.offset, this.offset);
        this.ctx.beginPath();
        this.ctx.arc(this.r, this.r, this.r, 0, 2 * Math.PI, true);
        this.ctx.closePath();
        this.ctx.fillStyle = this.light;
        // this.ctx.strokeStyle = this.light;
        // this.ctx.lineWidth = this.lineWidth;
        this.ctx.shadowBlur = this.glow;
        this.ctx.shadowColor = this.light;
        this.ctx.fill();
        // this.ctx.stroke();
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = 'transparent';
    }
    */

    drawShadow(phase) {
        this.ctx.fillStyle = this.light;
        const f = Math.cos(phase * rad);
        this.ctx.lineWidth = 0;
        this.ctx.beginPath();
        let x = f * this.r * Math.cos(0) + this.r;
        let y = this.r * Math.sin(0) + this.r;
        this.ctx.moveTo(x, y);

        if (phase <= 180) {
            for (let i = 0; i <= 360; i++) {
                const cosi = Math.cos(i * rad);
                if (cosi > 0) {
                    x = f * this.r * Math.cos(i * rad) + this.r;
                } else {
                    x = this.r * Math.cos(i * rad) + this.r;
                }
                y = this.r * Math.sin(i * rad) + this.r - 1;

                this.ctx.lineTo(x, y + 1);
            }
        } else {
            for (let i = 0; i <= 360; i++) {
                const cosi = Math.cos(i * rad);
                if (cosi < 0) {
                    x = f * this.r * Math.cos(i * rad) + this.r;
                } else {
                    x = this.r * Math.cos(i * rad) + this.r;
                }
                y = this.r * Math.sin(i * rad) + this.r - 1;

                this.ctx.lineTo(x, y + 1);
            }
        }
        this.ctx.closePath();
        this.ctx.shadowBlur = this.glow;
        this.ctx.shadowColor = this.light;
        this.ctx.fill();
    }

    /*
    drawShadow2(phase) {
        // console.log(`Shadow phase: ${phase}`);
        this.ctx.beginPath();
        this.ctx.arc(this.r, this.r, this.r, -Math.PI / 2, Math.PI / 2, true);
        this.ctx.closePath();
        this.ctx.fillStyle = this.dark;
        this.ctx.fill();

        this.ctx.translate(this.r, this.r);
        this.ctx.scale(phase, 1);
        this.ctx.translate(-this.r, -this.r);
        this.ctx.beginPath();
        this.ctx.arc(this.r, this.r, this.r, -Math.PI / 2, Math.PI / 2, true);
        this.ctx.closePath();
        this.ctx.fillStyle = phase > 0 ? this.light : this.dark;
        this.ctx.fill();
    }
    */

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.drawMoon();
        this.drawShadow(this.phase);
        this.ctx.restore();
    }

    /*
    drawComplex2() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        if (this.phase <= 0.5) {
            this.drawMoon();
            this.drawShadow(4 * this.phase - 1);
        } else {
            this.ctx.translate(this.r + 2 * this.offset, this.r + 2 * this.offset);
            this.ctx.rotate(Math.PI);
            this.ctx.translate(-this.r, -this.r);
            this.drawMoon();
            this.drawShadow(4 * (1 - this.phase) - 1);
        }
        this.ctx.restore();
    }
    */

    /*
    drawSimple() {
        this.ctx.save();
        this.ctx.fillStyle = this.light;
        this.ctx.beginPath();
        this.ctx.ellipse(this.x, this.y, this.r, this.r, 0, 0, 2 * Math.PI);
        if (this.phase > 0.8) {
            this.ctx.shadowBlur = this.glow;
            this.ctx.shadowColor = this.light;
        }
        this.ctx.fill();
        if (this.phase <= 0.8) {
            let side = Math.random() >= 0.5 ? 1 : -1
            this.ctx.fillStyle = this.dark;
            this.ctx.beginPath();
            this.ctx.ellipse(this.x + this.phase * this.r * side, this.y, this.r, this.r, 0, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        this.ctx.restore();
    }
    */
}
