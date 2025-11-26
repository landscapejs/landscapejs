import { Color, colorFromHex } from "./color.js";

const starSmallRadiusMin = 0.1;
const starSmallRadiusMax = 1.1;
const starBigRadiusMin = 1.2;
const starBigRadiusMax = 1.8;
const starBigChance = 0.003;

export class Star {
    constructor(canvas, random , x, y) {
        this.canvas = canvas;
        this.random = random;
        this.x = x;
        this.y = y;
    }

    draw(shootingStar = false, polyStar = false, bubble = false) {
        let ctx = this.canvas.getContext('2d');
        let isABigStar = this.random.random() < starBigChance;
        if (shootingStar) {
            isABigStar = false;
        }

        let radius = this.random.float(starSmallRadiusMin, starSmallRadiusMax);
        let alpha = this.random.random() * 0.7 + 0.2;

        let color = new Color(this.random.int(225, 255), this.random.int(225, 255), this.random.int(225, 255), alpha);
        ctx.fillStyle = color.rgba();
        ctx.strokeStyle = color.rgba();

        if (isABigStar) {
            console.log('isABigStar!')
            radius = this.random.float(starBigRadiusMin, starBigRadiusMax);
            ctx.save();
            const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius * 6);
            glow.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.55)`);
            glow.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius * 6, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        if (polyStar) {
            this.polyStar(
                ctx,
                this.x,
                this.y,
                radius * this.random.int(4, 8),
                this.random.int(4, 5), // number of sides
                this.random.float(0.7, 0.9), // pointyness
                this.random.random() * 360 // rotation of the star
            );
        }

        if (shootingStar) {
            console.log('shooting star');
            color = colorFromHex("#FFFFFF");
            ctx.fillStyle = color.rgb();
            ctx.strokeStyle = color.rgb();
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            let endX = this.random.int(this.x - 50, this.x + 50);
            let endY = this.random.int(this.y - 50, this.y + 50);
            ctx.lineTo(endX, endY);
            let gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
            gradient.addColorStop(0, color.rgba());
            gradient.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`);
            ctx.strokeStyle = gradient;
            ctx.closePath();
            ctx.stroke();
        }
        ctx.restore();
    }

    polyStar(ctx, x, y, radius, sides, pointSize, angle) {
        ctx.save();
        var x = this.x, y = this.y;
        var radius = radius;
        var angle = (angle || 0) / 180 * Math.PI;
        var sides = sides;
        var ps = 1 - (pointSize || 0);
        var a = Math.PI / sides;

        ctx.moveTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
        ctx.beginPath();
        for (var i = 0; i < sides; i++) {
            angle += a;
            if (ps != 1) {
                ctx.lineTo(x + Math.cos(angle) * radius * ps, y + Math.sin(angle) * radius * ps);
            }
            angle += a;
            ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.fill();
        ctx.restore();
    }
}
