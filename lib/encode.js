export class Codec {

    encode(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);

        const binaryString = String.fromCharCode.apply(null, data);
        return btoa(binaryString);
    }

    decode(b64) {
        const binaryString = atob(b64);
        // Create a Uint8Array from the binary string.
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    }

}
