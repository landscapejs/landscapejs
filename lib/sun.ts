import { Color, randomSunColor } from "./color.js";
import { Random } from "./random.js";

export class Sun {
    private readonly ctx: CanvasRenderingContext2D;
    private readonly random: Random;
    private readonly color: Color;
    private readonly glow: number;

    readonly x: number;
    readonly y: number;
    readonly r: number;

    constructor(
        canvas: HTMLCanvasElement,
        random: Random,
        phase = 0,
        x = 0,
        y = 0,
        r = 0,
    ) {
        this.ctx    = canvas.getContext('2d')!;
        this.random = random;
        this.x      = x > 0 ? x : canvas.width  / 2;
        this.y      = y > 0 ? y : canvas.height / 2;
        this.r      = r > 0 ? r : 100;
        this.glow   = this.r * 10;
        this.color  = randomSunColor(phase, random);
    }

    draw(): void {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.drawBody();
        this.ctx.restore();
    }

    // -------------------------------------------------------------------------

    private drawBody(): void {
        const { ctx, r, color, glow, random } = this;

        // Outer glow gradient
        const glowBrightness = random.float(0.1, 0.9);
        const glowRadius     = r * random.int(1, 8);
        const gradient       = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
        gradient.addColorStop(0, color.withAlpha(glowBrightness).rgba());
        gradient.addColorStop(1, color.withAlpha(0).rgba());

        ctx.beginPath();
        ctx.arc(0, 0, glowRadius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core disc
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.shadowBlur  = glow;
        ctx.shadowColor = color.rgba();
        ctx.fillStyle   = color.rgba();
        ctx.fill();
    }
}
