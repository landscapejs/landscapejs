import { Color, colorFromHex } from "./color.js";
import { Random } from "./random.js";

const STAR_SMALL_RADIUS_MIN = 0.1;
const STAR_SMALL_RADIUS_MAX = 1.1;
const STAR_BIG_RADIUS_MIN   = 1.2;
const STAR_BIG_RADIUS_MAX   = 1.8;
const STAR_BIG_CHANCE       = 0.003;

export class Star {
    private readonly ctx: CanvasRenderingContext2D;
    private readonly random: Random;
    readonly x: number;
    readonly y: number;

    constructor(canvas: HTMLCanvasElement, random: Random, x: number, y: number) {
        this.ctx    = canvas.getContext('2d')!;
        this.random = random;
        this.x      = x;
        this.y      = y;
    }

    draw(shootingStar = false, polyStar = false, _bubble = false): void {
        const { ctx, random, x, y } = this;

        const isBigStar = !shootingStar && random.random() < STAR_BIG_CHANCE;
        let radius = isBigStar
            ? random.float(STAR_BIG_RADIUS_MIN, STAR_BIG_RADIUS_MAX)
            : random.float(STAR_SMALL_RADIUS_MIN, STAR_SMALL_RADIUS_MAX);

        const alpha = random.random() * 0.7 + 0.2;
        let color   = new Color(random.int(225, 255), random.int(225, 255), random.int(225, 255), alpha);

        ctx.fillStyle   = color.rgba();
        ctx.strokeStyle = color.rgba();

        // Big star halo glow
        if (isBigStar) {
            ctx.save();
            const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 6);
            glow.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.55)`);
            glow.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(x, y, radius * 6, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        // Star body
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        if (polyStar) {
            this.drawPolyStar(
                ctx,
                x,
                y,
                radius * random.int(4, 8),
                random.int(4, 5),
                random.float(0.7, 0.9),
                random.random() * 360,
            );
        }

        if (shootingStar) {
            color = colorFromHex("#FFFFFF");
            const endX = random.int(x - 50, x + 50);
            const endY = random.int(y - 50, y + 50);

            const gradient = ctx.createLinearGradient(x, y, endX, endY);
            gradient.addColorStop(0, color.rgba());
            gradient.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`);

            ctx.strokeStyle = gradient;
            ctx.fillStyle   = color.rgb();
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(endX, endY);
            ctx.closePath();
            ctx.stroke();
        }

        ctx.restore();
    }

    /**
     * Draws a star polygon.
     * Fixed: the original ignored the x/y/radius params and used this.x/this.y instead.
     */
    private drawPolyStar(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        radius: number,
        sides: number,
        pointiness: number,
        angleDeg: number,
    ): void {
        ctx.save();
        const innerScale = 1 - pointiness;
        const stepAngle  = Math.PI / sides;
        let angle        = (angleDeg / 180) * Math.PI;

        ctx.beginPath();
        ctx.moveTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);

        for (let i = 0; i < sides; i++) {
            angle += stepAngle;
            if (innerScale !== 1) {
                ctx.lineTo(
                    x + Math.cos(angle) * radius * innerScale,
                    y + Math.sin(angle) * radius * innerScale,
                );
            }
            angle += stepAngle;
            ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
        }

        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.fill();
        ctx.restore();
    }
}
