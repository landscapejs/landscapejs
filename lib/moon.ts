import { Random } from "./random.js";

const DEG_TO_RAD = Math.PI / 180;

export class Moon {
    private readonly ctx: CanvasRenderingContext2D;
    private readonly random: Random;

    /** Phase in degrees [0, 360). */
    private readonly phaseDeg: number;

    readonly x: number;
    readonly y: number;
    readonly r: number;

    private readonly light: string;
    private readonly dark: string;
    private readonly glow: number;

    constructor(
        canvas: HTMLCanvasElement,
        random: Random,
        phase = 0,
        x = 0,
        y = 0,
        r = 0,
        light = '#fff',
        dark  = '#000',
    ) {
        this.ctx      = canvas.getContext('2d')!;
        this.random   = random;
        this.phaseDeg = 360 * phase;
        this.x        = x > 0 ? x : canvas.width  / 2;
        this.y        = y > 0 ? y : canvas.height / 2;
        this.r        = r > 0 ? r : 100;
        this.light    = light;
        this.dark     = dark;
        this.glow     = this.r / 2;
    }

    draw(): void {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.drawDisc();
        this.drawPhase(this.phaseDeg);
        this.ctx.restore();
    }

    // -------------------------------------------------------------------------

    private drawDisc(): void {
        const { ctx, r, dark, random } = this;

        if (random.random() < 0.2) {
            ctx.rotate(random.int(0, 360) * DEG_TO_RAD);
        }

        ctx.beginPath();
        ctx.arc(r, r, r, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.fillStyle = dark;
        ctx.fill();
    }

    private drawPhase(phase: number): void {
        const { ctx, r, light, glow } = this;

        ctx.fillStyle = light;
        ctx.lineWidth = 0;

        const f = Math.cos(phase * DEG_TO_RAD);

        ctx.beginPath();
        ctx.moveTo(f * r * Math.cos(0) + r, r * Math.sin(0) + r);

        for (let i = 0; i <= 360; i++) {
            const cos  = Math.cos(i * DEG_TO_RAD);
            const useF = phase <= 180 ? cos > 0 : cos < 0;
            const px   = (useF ? f * r * cos : r * cos) + r;
            const py   = r * Math.sin(i * DEG_TO_RAD) + r;
            ctx.lineTo(px, py);
        }

        ctx.closePath();
        ctx.shadowBlur  = glow;
        ctx.shadowColor = light;
        ctx.fill();
    }
}
