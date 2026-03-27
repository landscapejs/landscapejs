// ---------------------------------------------------------------------------
// Perlin noise constants
// ---------------------------------------------------------------------------

const PERLIN_YWRAPB = 4;
const PERLIN_YWRAP  = 1 << PERLIN_YWRAPB;
const PERLIN_ZWRAPB = 8;
const PERLIN_ZWRAP  = 1 << PERLIN_ZWRAPB;
const PERLIN_SIZE   = 4095;
const PERLIN_OCTAVES    = 4;
const PERLIN_AMP_FALLOFF = 0.5;

const scaledCosine = (i: number): number => 0.5 * (1.0 - Math.cos(i * Math.PI));

// ---------------------------------------------------------------------------
// Random class
// ---------------------------------------------------------------------------

export class Random {
    readonly seed: number;

    /** Underlying PRNG — splitmix32 by default. */
    private readonly rnd: () => number;

    /**
     * Per-instance Perlin table, lazily initialised on first noise() call.
     * Keeping it on the instance prevents different seeds from corrupting each other.
     */
    private perlinTable: Float64Array | null = null;

    constructor(seed: number) {
        this.seed = seed;
        this.rnd = this.splitmix32(seed);
    }

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------

    /** Returns a Perlin noise value in roughly [0, 1] for the given coordinates. */
    noise(x: number, y = 0, z = 0): number {
        if (!this.perlinTable) {
            this.perlinTable = new Float64Array(PERLIN_SIZE + 1);
            for (let i = 0; i <= PERLIN_SIZE; i++) {
                this.perlinTable[i] = this.rnd();
            }
        }
        const p = this.perlinTable;

        // Perlin only works on positive coords.
        if (x < 0) x = -x;
        if (y < 0) y = -y;
        if (z < 0) z = -z;

        let xi = Math.floor(x);
        let yi = Math.floor(y);
        let zi = Math.floor(z);
        let xf = x - xi;
        let yf = y - yi;
        let zf = z - zi;

        let result = 0;
        let ampl   = 0.5;

        for (let o = 0; o < PERLIN_OCTAVES; o++) {
            let offset = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);

            const rxf = scaledCosine(xf);
            const ryf = scaledCosine(yf);

            let n1 = p[offset & PERLIN_SIZE];
            n1 += rxf * (p[(offset + 1) & PERLIN_SIZE] - n1);
            let n2 = p[(offset + PERLIN_YWRAP) & PERLIN_SIZE];
            n2 += rxf * (p[(offset + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
            n1 += ryf * (n2 - n1);

            offset += PERLIN_ZWRAP;
            n2 = p[offset & PERLIN_SIZE];
            n2 += rxf * (p[(offset + 1) & PERLIN_SIZE] - n2);
            let n3 = p[(offset + PERLIN_YWRAP) & PERLIN_SIZE];
            n3 += rxf * (p[(offset + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
            n2 += ryf * (n3 - n2);

            n1 += scaledCosine(zf) * (n2 - n1);

            result += n1 * ampl;
            ampl   *= PERLIN_AMP_FALLOFF;

            xi <<= 1; xf *= 2;
            yi <<= 1; yf *= 2;
            zi <<= 1; zf *= 2;

            if (xf >= 1) { xi++; xf--; }
            if (yf >= 1) { yi++; yf--; }
            if (zf >= 1) { zi++; zf--; }
        }

        return result;
    }

    /** Returns a random float in [min, max). */
    float(min: number, max: number): number {
        return this.rnd() * (max - min) + min;
    }

    /** Returns a random integer in [min, max). */
    int(min: number, max: number): number {
        return Math.floor(this.rnd() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min));
    }

    /** Returns a raw random float in [0, 1). */
    random(): number {
        return this.rnd();
    }

    // -------------------------------------------------------------------------
    // PRNGs
    // -------------------------------------------------------------------------

    private splitmix32(seed: number): () => number {
        let a = seed;
        return (): number => {
            a = (a + 0x9e3779b9) | 0;
            let t = a ^ (a >>> 16);
            t = Math.imul(t, 0x21f0aaad);
            t = t ^ (t >>> 15);
            t = Math.imul(t, 0x735a2d97);
            return ((t ^ (t >>> 15)) >>> 0) / 4294967296;
        };
    }

    private mulberry32(seed: number): () => number {
        let a = seed;
        return (): number => {
            a = (a + 0x6D2B79F5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }
}
