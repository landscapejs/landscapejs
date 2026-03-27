import { Color } from "./color.js";
import { Random } from "./random.js";

export class Mountain {
    private readonly ctx: CanvasRenderingContext2D;
    private readonly random: Random;
    private readonly width: number;
    private readonly baseHeight: number;
    private readonly height: number;
    private readonly color: Color;
    private readonly blur: number;
    private readonly fill: boolean;
    private readonly timeInterval: number;
    private readonly lengthInterval: number;
    private readonly currentMin: number;
    private readonly currentMax: number;
    private readonly newMin: number;
    private readonly newMax: number;

    private time: number;
    private cursorX = 0;

    constructor(
        canvas: HTMLCanvasElement,
        random: Random,
        horizontLineHeight: number,
        cMin: number,
        cMax: number,
        nMin: number,
        nMax: number,
        timeInterval: number,
        color: Color,
        blur = 0,
        fill = true,
        lengthInterval = 1,
    ) {
        this.ctx            = canvas.getContext('2d')!;
        this.random         = random;
        this.time           = random.random() * 99;
        this.currentMin     = cMin;
        this.currentMax     = cMax;
        this.newMin         = nMin;
        this.newMax         = nMax;
        this.timeInterval   = timeInterval;
        this.lengthInterval = lengthInterval;
        this.width          = canvas.width;
        this.baseHeight     = canvas.height * 0.05;
        this.height         = horizontLineHeight - this.baseHeight;
        this.color          = color;
        this.blur           = blur;
        this.fill           = fill;
    }

    private nextVertex(): [x: number, y: number] {
        this.time    += this.timeInterval;
        this.cursorX += this.lengthInterval;

        const noiseValue = this.random.noise(this.time);
        const mapped     = this.mapRange(
            noiseValue,
            this.currentMin, this.currentMax,
            this.newMin,     -this.height + this.newMax,
        );
        return [this.cursorX + 1, this.height + mapped];
    }

    draw(): void {
        const { ctx, color, blur, fill, width, height, baseHeight, lengthInterval } = this;

        ctx.save();
        ctx.fillStyle   = color.rgba();
        ctx.strokeStyle = color.rgba();
        ctx.filter      = `blur(${blur}px)`;

        const path = new Path2D();
        path.moveTo(-100 * lengthInterval, height + baseHeight);

        for (let j = 0; j < width; j++) {
            const [x, y] = this.nextVertex();
            path.lineTo(x, y);
        }

        if (fill) {
            path.lineTo(width, height + baseHeight);
            path.closePath();
            ctx.fill(path);
        }
        ctx.stroke(path);
        ctx.restore();
    }

    private mapRange(
        n: number,
        inMin: number, inMax: number,
        outMin: number, outMax: number,
    ): number {
        return (n - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;
    }
}
