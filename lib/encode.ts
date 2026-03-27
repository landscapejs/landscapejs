import LZString from "lz-string";

export type SerializedOptions = Record<string, unknown>;

export class Codec {
    encode(obj: SerializedOptions): string {
        // Sort keys so the same logical config always produces the same seed.
        const sorted = Object.fromEntries(
            Object.keys(obj).sort().map(k => [k, obj[k]])
        );
        return LZString.compressToBase64(JSON.stringify(sorted));
    }

    decode(seed: string): SerializedOptions {
        const json = LZString.decompressFromBase64(seed);
        if (!json) throw new Error("Failed to decompress seed — it may be corrupt or invalid.");
        return JSON.parse(json) as SerializedOptions;
    }
}
