import { Color, colorFromHex, randomBlue } from './color.js';
import { Star }     from './star.js';
import { Mountain } from './mountain.js';
import { Moon }     from './moon.js';
import { Sun }      from './sun.js';
import { Random }   from './random.js';
import { Codec, SerializedOptions } from './encode.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MIN_STARS     = 100;
const MAX_STARS     = 15000;
const MIN_MOUNTAINS = 0;
const MAX_MOUNTAINS = 25;
const MIN_WAVES     = 0;
const MAX_WAVES     = 12;

const GROUND_COLORS = [
    '#FFA500', '#C4A484', '#B7CCA9', '#E2D03B', '#800020', '#829FAD',
    '#93C572', '#4CBB17', '#32CD32', '#228B22', '#016403', '#6C8E68',
    '#3F9B0B', '#7CFC00', '#814f3e', '#96776e', '#c1a89a', '#a6e156',
    '#8d9f40', '#263525', '#301a17', '#1e281e', '#495846', '#121510',
    '#7f6f55', '#54534f', '#879b35', '#9c9495', '#e7e5ec', '#a47d5d',
    '#bfc0bd', '#ad8c89', '#d5adb3', '#9d8563', '#e3d3b8', '#435654',
] as const;

const MOON_COLORS = ['#ffffff', '#fffefd', '#fff0f0', '#ffcdcd'] as const;

// ---------------------------------------------------------------------------
// Options interface
// ---------------------------------------------------------------------------

export interface LandscapeOptions {
    container: string;
    seed?: string | null;
    callback?: ((landscape: LandscapeJS) => void) | null;
    randomSeed?: number;
    drawSky?: boolean;
    drawStars?: boolean;
    drawMoon?: boolean;
    drawSun?: boolean;
    drawMountains?: boolean;
    drawWaves?: boolean;
    drawGround?: boolean;
    drawWater?: boolean;
    drawBubbles?: boolean;
    numberOfStars?: number;
    maxNumberOfStars?: number;
    numberOfShootingStars?: number;
    numberOfPolyStars?: number;
    numberOfMountains?: number;
    maxNumberOfMountains?: number;
    numberOfWaves?: number;
    dayTime?: boolean;
    underwater?: boolean;
    horizontLine?: number;
    skyColor1?: string | null;
    skyColor2?: string | null;
    groundColor1?: string | null;
    groundColor2?: string | null;
}

/** Keys that are persisted into the encoded seed. */
type PersistableKey = Exclude<keyof LandscapeOptions, 'container' | 'seed' | 'callback'>;

const PERSISTABLE_KEYS: PersistableKey[] = [
    'randomSeed', 'dayTime', 'underwater',
    'drawSky', 'drawStars', 'drawMoon', 'drawSun',
    'drawMountains', 'drawWaves', 'drawGround', 'drawWater', 'drawBubbles',
    'numberOfStars', 'numberOfShootingStars', 'numberOfPolyStars',
    'numberOfMountains', 'numberOfWaves',
    'horizontLine', 'skyColor1', 'skyColor2', 'groundColor1', 'groundColor2',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function drawGradient(
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    w: number, h: number,
    topColor: Color, bottomColor: Color,
): void {
    const gradient = ctx.createLinearGradient(x, y, x, y + h);
    gradient.addColorStop(0, topColor.rgba());
    gradient.addColorStop(1, bottomColor.rgba());
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, w, h);
}

function clamp(val: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, val));
}

// ---------------------------------------------------------------------------
// LandscapeJS
// ---------------------------------------------------------------------------

export class LandscapeJS {
    // Canvas & rendering
    readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private readonly scale: number;
    readonly width: number;
    readonly height: number;

    // Seeding & randomness
    readonly randomSeed: number;
    private readonly random: Random;
    readonly seed: string;

    // Options
    readonly drawSky: boolean;
    readonly drawStars: boolean;
    readonly drawMoon: boolean;
    readonly drawSun: boolean;
    readonly drawMountains: boolean;
    readonly drawGround: boolean;
    readonly drawWater: boolean;
    readonly drawBubbles: boolean;
    readonly drawWaves: boolean;
    readonly dayTime: boolean;
    readonly underwater: boolean;
    readonly horizontLine: number;

    // Hex color overrides (strings or null — never a Color object)
    private skyColor1: string | null;
    private skyColor2: string | null;
    private groundColor1: string | null;
    private groundColor2: string | null;

    // Star counts
    readonly numberOfStars: number;
    readonly numberOfShootingStars: number;
    readonly numberOfPolyStars: number;
    readonly numberOfMountains: number;
    readonly numberOfWaves: number;

    // Scene objects
    private moon: Moon | null = null;
    private sun:  Sun  | null = null;
    private stars:        Star[]     = [];
    private shootingStars: Star[]    = [];
    private polyStars:    Star[]     = [];
    private bubbles:      Star[]     = [];
    private mountains:    Mountain[] = [];
    private waves:        Mountain[] = [];

    // Computed during init
    private colorPalette: Color[] = [];

    private horizontLineHeight = 0;
    private baseLineHeight = 0;

    // Optional callback
    private readonly callback: ((landscape: LandscapeJS) => void) | null;

    constructor({
        container,
        seed = null,
        callback = null,
        randomSeed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        drawSky = true,
        drawStars = true,
        drawMoon = true,
        drawSun = true,
        drawMountains = true,
        drawWaves = true,
        drawGround = true,
        drawWater = true,
        drawBubbles = true,
        numberOfStars = -1,
        numberOfShootingStars = -1,
        numberOfPolyStars = -1,
        numberOfMountains = 0,
        numberOfWaves = 0,
        dayTime = Math.random() < 0.5,
        underwater = false,
        horizontLine = 0.5,
        skyColor1 = null,
        skyColor2 = null,
        groundColor1 = null,
        groundColor2 = null,
    }: LandscapeOptions) {
        // -- Set up canvas --
        const div = document.querySelector<HTMLElement>(container);
        if (!div) throw new Error(`Container "${container}" not found.`);

        div.querySelectorAll('canvas').forEach(el => el.remove());
        this.canvas = document.createElement('canvas');
        div.prepend(this.canvas);

        this.ctx   = this.canvas.getContext('2d', { willReadFrequently: true })!;
        this.scale = window.devicePixelRatio || 1;

        const w = div.offsetWidth;
        const h = div.offsetHeight;
        this.canvas.style.width  = `${w}px`;
        this.canvas.style.height = `${h}px`;
        this.canvas.width  = Math.floor(w * this.scale);
        this.canvas.height = Math.floor(h * this.scale);

        this.width  = this.canvas.width;
        this.height = this.canvas.height;

        // -- Resolve options (either from seed or directly) --
        const codec = new Codec();

        if (seed) {
            const decoded = codec.decode(seed);
            randomSeed          = (decoded.randomSeed          as number)  ?? randomSeed;
            drawSky             = (decoded.drawSky             as boolean) ?? drawSky;
            drawStars           = (decoded.drawStars           as boolean) ?? drawStars;
            drawMoon            = (decoded.drawMoon            as boolean) ?? drawMoon;
            drawSun             = (decoded.drawSun             as boolean) ?? drawSun;
            drawMountains       = (decoded.drawMountains       as boolean) ?? drawMountains;
            drawWaves           = (decoded.drawWaves           as boolean) ?? drawWaves;
            drawGround          = (decoded.drawGround          as boolean) ?? drawGround;
            drawWater           = (decoded.drawWater           as boolean) ?? drawWater;
            drawBubbles         = (decoded.drawBubbles         as boolean) ?? drawBubbles;
            numberOfStars       = (decoded.numberOfStars       as number)  ?? numberOfStars;
            numberOfShootingStars = (decoded.numberOfShootingStars as number) ?? numberOfShootingStars;
            numberOfPolyStars   = (decoded.numberOfPolyStars   as number)  ?? numberOfPolyStars;
            numberOfMountains   = (decoded.numberOfMountains   as number)  ?? numberOfMountains;
            numberOfWaves       = (decoded.numberOfWaves       as number)  ?? numberOfWaves;
            dayTime             = (decoded.dayTime             as boolean) ?? dayTime;
            underwater          = (decoded.underwater          as boolean) ?? underwater;
            horizontLine        = (decoded.horizontLine        as number)  ?? horizontLine;
            skyColor1           = (decoded.skyColor1           as string)  ?? skyColor1;
            skyColor2           = (decoded.skyColor2           as string)  ?? skyColor2;
            groundColor1        = (decoded.groundColor1        as string)  ?? groundColor1;
            groundColor2        = (decoded.groundColor2        as string)  ?? groundColor2;
        }

        // -- Encode seed from the resolved options --
        const options: SerializedOptions = { randomSeed, dayTime };
        const passedOpts: LandscapeOptions = {
            container, seed, callback, randomSeed, drawSky, drawStars, drawMoon, drawSun,
            drawMountains, drawWaves, drawGround, drawWater, drawBubbles,
            numberOfStars, numberOfShootingStars, numberOfPolyStars,
            numberOfMountains, numberOfWaves, dayTime, underwater,
            horizontLine, skyColor1, skyColor2, groundColor1, groundColor2,
        };

        for (const key of PERSISTABLE_KEYS) {
            if (passedOpts[key] != null) options[key] = passedOpts[key];
        }

        this.seed = codec.encode(options);

        // -- Assign fields --
        this.callback        = callback;
        this.randomSeed      = randomSeed;
        this.random          = new Random(randomSeed);
        this.drawSky         = drawSky;
        this.drawStars       = drawStars;
        this.drawMoon        = drawMoon;
        this.drawSun         = drawSun;
        this.drawMountains   = drawMountains;
        this.drawGround      = drawGround;
        this.drawWater       = drawWater;
        this.drawBubbles     = drawBubbles;
        this.drawWaves       = drawWaves;
        this.dayTime         = dayTime;
        this.underwater      = underwater;
        this.horizontLine    = horizontLine;
        this.skyColor1   = skyColor1;
        this.skyColor2   = skyColor2;
        this.groundColor1 = groundColor1;
        this.groundColor2 = groundColor2;

        const rng = this.random;
        this.numberOfStars         = numberOfStars < 0
            ? rng.int(MIN_STARS, MAX_STARS) : numberOfStars;
        this.numberOfShootingStars = numberOfShootingStars < 0
            ? rng.int(1, 5) : numberOfShootingStars;
        this.numberOfPolyStars     = numberOfPolyStars < 0
            ? rng.int(3, 10) : numberOfPolyStars;
        this.numberOfMountains = clamp(
            numberOfMountains || rng.int(MIN_MOUNTAINS, MAX_MOUNTAINS),
            MIN_MOUNTAINS, MAX_MOUNTAINS,
        );
        this.numberOfWaves = clamp(
            numberOfWaves || rng.int(MIN_WAVES, MAX_WAVES),
            MIN_WAVES, MAX_WAVES,
        );

        this.maxNumberOfStars = MAX_STARS;
        this.maxNumberOfMountains = MAX_MOUNTAINS;

        this.init();
    }

    // -------------------------------------------------------------------------
    // Initialisation
    // -------------------------------------------------------------------------

    private init(): void {
        this.horizontLineHeight = this.height - this.height * this.horizontLine;
        this.baseLineHeight     = this.underwater
            ? this.horizontLineHeight + 50
            : this.height;

        this.buildColorPalette();

        if (!this.underwater) {
            if (this.drawMountains) this.createMountains();
            if (this.drawStars)     this.createStars();
            if (!this.dayTime && this.drawMoon) this.createMoon();
            if (this.dayTime  && this.drawSun)  this.createSun();
        } else {
            if (this.drawWaves)   this.createWaves();
            if (this.drawStars)   this.createStars();
            if (this.drawBubbles) this.createBubbles();
            if (this.drawMoon)    this.createMoon();
        }
    }

    // -------------------------------------------------------------------------
    // Color palette
    // -------------------------------------------------------------------------

    private buildColorPalette(): void {
        const { random, dayTime, underwater } = this;

        const isBlue   = random.random() < 0.25;
        const isBright = random.random() < 0.5;

        const rStart = dayTime || underwater ? (underwater ? 100 : 150) : 0;
        const gStart = rStart;
        const bStart = rStart;
        const rEnd   = dayTime ? 255 : 200;
        const gEnd   = rEnd;
        const bEnd   = rEnd;

        let red   = random.int(rStart, rEnd);
        let green = random.int(gStart, gEnd);
        let blue  = random.int(bStart, bEnd);

        if (isBlue) {
            let brightness = dayTime ? random.random() : random.random() * -1;
            if (isBright) brightness = 1;
            const c = randomBlue(brightness, random);
            red = c.r; green = c.g; blue = c.b;
        }

        const rVariant = isBright ? 200 : -185;
        const gVariant = isBright ? 200 : -175;
        const bVariant = isBright ?  60 :  -55;

        let red2   = red   + rVariant;
        let green2 = green + gVariant;
        let blue2  = blue  + bVariant;

        // Apply hex overrides if provided
        if (this.skyColor1) {
            try {
                const c = colorFromHex(this.skyColor1);
                red = c.r; green = c.g; blue = c.b;
            } catch {
                console.warn(`Invalid skyColor1: "${this.skyColor1}"`);
            }
        }
        if (this.skyColor2) {
            try {
                const c = colorFromHex(this.skyColor2);
                red2 = c.r; green2 = c.g; blue2 = c.b;
            } catch {
                console.warn(`Invalid skyColor2: "${this.skyColor2}"`);
            }
        }

        const count    = underwater ? this.numberOfWaves : this.numberOfMountains;
        const variantR = (rEnd - red)   / count;
        const variantG = (gEnd - green) / count;
        const variantB = (bEnd - blue)  / count;

        this.colorPalette = Array.from({ length: count }, (_, i) =>
            new Color(red + i * variantR, green + i * variantG, blue + i * variantB),
        );

        const skyA = isBright ? new Color(red2, green2, blue2) : new Color(red,  green,  blue);
        const skyB = isBright ? new Color(red,  green,  blue)  : new Color(red2, green2, blue2);
        this.colorPalette.push(skyA, skyB);

        this.skyColor1 = skyA.hex();
        this.skyColor2 = skyB.hex();
    }

    // -------------------------------------------------------------------------
    // Scene object factories
    // -------------------------------------------------------------------------

    private createMountains(): void {
        const mountainStep = this.random.float(0.003, 0.03);
        const heightSeed   = this.random.float(3.3, 7);
        const heightSub    = (0.324 - (this.numberOfMountains / MAX_MOUNTAINS) * 100 * 0.0016) - 0.064;

        for (let i = 0; i < this.numberOfMountains; i++) {
            const hSeed = i === 0 ? heightSeed   : heightSeed   - heightSub * i;
            const mStep = i === 0 ? mountainStep : mountainStep / i;
            this.mountains.push(new Mountain(
                this.canvas, this.random, this.horizontLineHeight,
                0, hSeed, 0, 4, mStep,
                this.colorPalette[i], 0, true, 1,
            ));
        }
    }

    private createWaves(): void {
        const BASE_HEIGHT_SEED  = 4;
        const BASE_MOUNTAIN_STEP = 0.004;
        const HEIGHT_SUB        = 10;

        let currentHeightSeed  = BASE_HEIGHT_SEED;
        let currentHorizLine   = this.horizontLineHeight * 3;

        for (let i = 0; i < this.numberOfWaves; i++) {
            if (i > 0) {
                const gap  = HEIGHT_SUB * (i * 0.1) * (this.underwater ? -1 : 1);
                currentHeightSeed  = BASE_HEIGHT_SEED + gap;
                currentHorizLine  -= gap;
            }
            this.waves.push(new Mountain(
                this.canvas, this.random, currentHorizLine,
                0, currentHeightSeed, 0, 4, BASE_MOUNTAIN_STEP,
                new Color(255, 255, 255), 0, false, 3,
            ));
        }
    }

    private createStars(): void {
        const { canvas, random, width, horizontLineHeight } = this;
        const mkStar = (): Star =>
            new Star(canvas, random, random.int(0, width), random.int(0, horizontLineHeight));

        this.stars         = Array.from({ length: this.numberOfStars },         mkStar);
        this.shootingStars = Array.from({ length: this.numberOfShootingStars }, mkStar);
        this.polyStars     = Array.from({ length: this.numberOfPolyStars },     mkStar);
    }

    private createBubbles(): void {
        const count = this.random.int(this.width * 0.02, this.width * 0.05);
        this.bubbles = Array.from({ length: count }, () =>
            new Star(
                this.canvas, this.random,
                this.random.int(0, this.width),
                this.random.int(this.horizontLineHeight + this.baseLineHeight, this.height),
            ),
        );
    }

    private createMoon(): void {
        const moonR = this.random.int(this.height / 70, this.height / 7);
        const x     = this.random.int(2 * moonR, this.width - 2 * moonR);
        const y     = Math.floor(this.random.random() * this.height / 6 + moonR);
        const light = MOON_COLORS[this.random.int(0, MOON_COLORS.length - 1)];
        const dark  = this.colorPalette[this.colorPalette.length - 1].rgb();
        this.moon   = new Moon(this.canvas, this.random, this.random.random(), x, y, moonR, light, dark);
    }

    private createSun(): void {
        const r = this.random.int(this.height / 70, this.height / 7);
        const x = this.random.int(2 * r, this.width - 2 * r);
        const y = Math.floor(this.random.random() * this.height / 6 + r);
        this.sun = new Sun(this.canvas, this.random, this.random.random(), x, y, r);
    }

    // -------------------------------------------------------------------------
    // Public render entry point
    // -------------------------------------------------------------------------

    render(): void {
        if (this.underwater) {
            this.renderUnderwater();
        } else {
            this.renderLandscape();
        }
    }

    // -------------------------------------------------------------------------
    // Draw passes
    // -------------------------------------------------------------------------

    private renderLandscape(): void {
        if (this.drawSky)       this.drawSky_();
        if (this.drawMountains) {
            for (let i = this.mountains.length - 1; i >= 0; i--) {
                this.mountains[i].draw();
            }
        }
        if (this.drawGround) this.drawGround_();
        this.done();
    }

    private renderUnderwater(): void {
        this.drawSky_();

        if (this.drawWaves) {
            for (let i = this.waves.length - 1; i >= 0; i--) {
                this.waves[i].draw();
            }
        }

        if (this.drawWater) {
            const { ctx, width, height, horizontLineHeight } = this;
            const white = new Color(255, 255, 255);

            // Surface gradient
            drawGradient(ctx, 0, horizontLineHeight, width, height - horizontLineHeight, white, white);

            // Radial highlight
            const cx = width / 2;
            const cr = width / 2;
            const radial = ctx.createRadialGradient(cx, horizontLineHeight, cr / 10, cx, horizontLineHeight, cr);
            radial.addColorStop(0, white.rgba());
            radial.addColorStop(1, white.withAlpha(0).rgba());
            ctx.fillStyle = radial;
            ctx.fillRect(0, horizontLineHeight, width, height - horizontLineHeight);
        }

        if (this.drawBubbles) {
            this.bubbles.forEach(b => b.draw(false, true));
        }

        this.done();
    }

    private drawSky_(): void {
        const p = this.colorPalette;
        drawGradient(
            this.ctx,
            0, 0, this.width, this.horizontLineHeight,
            p[p.length - 1], p[p.length - 2],
        );

        if (!this.dayTime) {
            if (this.drawStars) {
                this.stars.forEach(s => s.draw());
                this.shootingStars.forEach(s => s.draw(true, false, false));
                this.polyStars.forEach(s => s.draw(false, true, false));
            }
            if (this.drawMoon) this.moon?.draw();
        } else {
            if (this.drawSun) this.sun?.draw();
        }
    }

    private drawGround_(horizLine = this.horizontLineHeight): void {
        const { ctx, random, width, height, baseLineHeight, colorPalette } = this;

        // Pick ground colors (override if provided)
        let gc1 = GROUND_COLORS[random.int(0, GROUND_COLORS.length - 1)];
        let gc2 = GROUND_COLORS[random.int(0, GROUND_COLORS.length - 1)];

        if (this.groundColor1) {
            try { gc1 = this.groundColor1; }
            catch { console.warn(`Invalid groundColor1: "${this.groundColor1}"`); }
        }
        if (this.groundColor2) {
            try { gc2 = this.groundColor2; }
            catch { console.warn(`Invalid groundColor2: "${this.groundColor2}"`); }
        }
        this.groundColor1 = gc1;
        this.groundColor2 = gc2;

        const baseColor = colorPalette[0];

        // Base fill
        ctx.fillStyle = baseColor.rgba();
        ctx.fillRect(0, horizLine, width, height - horizLine);

        // Blended gradient fill
        const BLUR = 2;
        const gradient = ctx.createLinearGradient(0, horizLine, 0, baseLineHeight);
        gradient.addColorStop(0,   baseColor.rgb());
        gradient.addColorStop(0.2, gc1);
        gradient.addColorStop(1,   gc2);
        ctx.fillStyle = gradient;
        ctx.filter    = `blur(${BLUR}px)`;
        ctx.fillRect(-BLUR, horizLine - BLUR, width + BLUR, baseLineHeight - horizLine + BLUR);
        ctx.fillRect(0, horizLine, width, baseLineHeight - horizLine);
        ctx.filter = 'none';

        // Radial highlight
        const radial = ctx.createRadialGradient(
            width / 2, horizLine, (width / 2) / 5,
            width / 2, horizLine, width / 2,
        );
        radial.addColorStop(0, new Color(255, 255, 255, 0.3).rgba());
        radial.addColorStop(1, new Color(255, 255, 255, 0).rgba());
        ctx.fillStyle = radial;
        ctx.fillRect(0, horizLine, width, height - baseLineHeight);
        ctx.fillRect(0, horizLine, width, baseLineHeight - horizLine);

        drawGradient(ctx, 0, horizLine, width, horizLine - horizLine * 1.07,
            new Color(255, 255, 255, 0.3), new Color(255, 255, 255, 0));
        drawGradient(ctx, 0, horizLine, width, horizLine - baseLineHeight,
            new Color(255, 255, 255, 0.3), new Color(255, 255, 255, 0));
    }

    // -------------------------------------------------------------------------

    private done(): void {
        this.callback?.(this);
    }
}
