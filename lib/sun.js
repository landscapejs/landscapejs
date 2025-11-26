import { randomSunColor } from "./color.js";

export class Sun {
    constructor(canvas, random, phase = 0, x = 0, y = 0, r = 0) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.random = random;
        this.phase = phase;
        this.lineWidth = 0;
        this.x = x > 0 ? x : canvas.width / 2;
        this.y = y > 0 ? y : canvas.height / 2;
        this.r = r > 0 ? r : 100;
        this.offset = this.lineWidth / 2;
        this.glow = this.r * 10;
        this.color = randomSunColor(this.phase, this.random);
        console.log(`Sun phase: ${this.phase}`);
    }

    drawSun() {
        this.ctx.translate(this.offset, this.offset);

        // --- Glow ---
        const glowBrightness = this.random.float(0.1, 0.9);
        const glowLength = this.random.int(1, 8);
        const glow = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * glowLength);
        glow.addColorStop(0, this.color.rgb().replace(')', `, ${glowBrightness})`).replace('rgb', 'rgba'));
        glow.addColorStop(1, this.color.rgb().replace(')', ', 0)').replace('rgb', 'rgba'));
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.r * glowLength, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fillStyle = glow;
        this.ctx.fill();

        // --- Glow ---
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.r, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.shadowBlur = this.glow;
        this.ctx.fillStyle = this.color.rgba();
        this.ctx.shadowColor = this.color.rgba();
        this.ctx.fill();

    }

    draw() {
        console.log('Drawing sun!!!!')
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.drawSun();
        this.ctx.restore();
    }
}
