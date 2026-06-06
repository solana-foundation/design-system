export interface DisplacementMapParams {
    depth: number;
    dome: number;
    edge: number;
    glow: number;
    lensH: number;
    lensW: number;
    mapSize: number;
    radius: number;
    splay: number;
}

const canvas = typeof document === 'undefined' ? undefined : document.createElement('canvas');
const ctx = canvas?.getContext('2d', { willReadFrequently: true });

const erfApprox = (value: number) => Math.tanh(1.7724538509 * value);

const integrateDome = (radius: number, half: number) => {
    let sum = 0;

    for (let index = 0; index <= 200; index += 1) {
        const x = (index / 200) * half;
        const slope = x / Math.sqrt(radius * radius - x * x);
        sum += (index === 0 || index === 200 ? 0.5 : 1) * slope;
    }

    return sum / 200;
};

const computeDomeConstants = (depth: number, halfW: number, halfH: number) => {
    const safeDepth = Math.max(0.01, Math.min(depth, Math.min(halfW, halfH) - 1));
    const rx = (halfW * halfW + safeDepth * safeDepth) / (2 * safeDepth);
    const ry = (halfH * halfH + safeDepth * safeDepth) / (2 * safeDepth);
    const ix = integrateDome(rx, halfW);
    const iy = integrateDome(ry, halfH);

    return {
        rx,
        ry,
        scaleX: ix > 0 ? 0.5 / ix : 1,
        scaleY: iy > 0 ? 0.5 / iy : 1,
    };
};

const domeGradient = (value: number, radius: number, scale: number) => {
    const x = Math.min(value, 0.999 * radius);

    return (x / Math.sqrt(radius * radius - x * x)) * scale;
};

const roundedRectSdf = (x: number, y: number, halfW: number, halfH: number, radius: number) => {
    const qx = Math.abs(x) - halfW + radius;
    const qy = Math.abs(y) - halfH + radius;
    const ox = Math.max(qx, 0);
    const oy = Math.max(qy, 0);

    return Math.sqrt(ox * ox + oy * oy) + Math.min(Math.max(qx, qy), 0) - radius;
};

const clampByte = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

export const getDisplacementMapKey = (params: DisplacementMapParams) =>
    [
        params.lensW,
        params.lensH,
        params.radius,
        params.depth,
        params.dome,
        params.splay,
        params.glow,
        params.edge,
        params.mapSize,
    ].join('|');

export const generateDisplacementMapImageData = (params: DisplacementMapParams) => {
    if (!canvas || !ctx) return null;

    const size = params.mapSize;
    const halfW = params.lensW / 2;
    const halfH = params.lensH / 2;
    const radius = Math.min(params.radius, halfW, halfH);
    const depth = Math.max(0, params.depth);
    const innerHalfW = Math.max(0, halfW - depth);
    const innerHalfH = Math.max(0, halfH - depth);
    const innerRadius = Math.max(0, Math.min(radius, innerHalfW, innerHalfH));
    const invSigma = depth > 0 ? 1 / (depth * Math.SQRT2) : 1e6;
    const dome = params.dome > 0 ? computeDomeConstants(params.dome, halfW, halfH) : null;
    const splay = Math.max(0.001, params.splay);
    const splayActive = splay < 0.999;
    const edgeRange = 3;
    const glowThreshold = (1 - 0.62) * Math.SQRT2;
    const glowRange = 0.62 * Math.SQRT2;
    const specRotation = (45 * Math.PI) / 180;
    const specX = Math.cos(specRotation);
    const specY = Math.sin(specRotation);
    const minHalf = Math.max(1, Math.min(halfW, halfH));

    if (canvas.width !== size || canvas.height !== size) {
        canvas.width = size;
        canvas.height = size;
    }

    const image = ctx.createImageData(size, size);
    const { data } = image;
    const halfSize = Math.ceil(size / 2);

    const writePixel = (px: number, py: number, r: number, g: number, b: number) => {
        const index = (py * size + px) * 4;
        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = 255;
    };

    const writeSymmetricPixels = (px: number, py: number, r: number, g: number, b: number, neutral: boolean) => {
        const pxR = size - 1 - px;
        const pyB = size - 1 - py;

        writePixel(px, py, r, g, b);
        if (pxR !== px) writePixel(pxR, py, neutral ? r : 255 - r, g, b);
        if (pyB !== py) writePixel(px, pyB, r, neutral ? g : 255 - g, b);
        if (pxR !== px && pyB !== py) {
            writePixel(pxR, pyB, neutral ? r : 255 - r, neutral ? g : 255 - g, b);
        }
    };

    for (let py = 0; py < halfSize; py += 1) {
        const y = ((py + 0.5) / size) * (2 * halfH) - halfH;

        for (let px = 0; px < halfSize; px += 1) {
            const x = ((px + 0.5) / size) * (2 * halfW) - halfW;
            const outer = roundedRectSdf(x, y, halfW, halfH, radius);

            if (outer >= 0) {
                writeSymmetricPixels(px, py, 128, 128, 128, true);
                continue;
            }

            let gx: number;
            let gy: number;

            if (dome) {
                gx = Math.sign(x) * domeGradient(Math.abs(x), dome.rx, dome.scaleX);
                gy = Math.sign(y) * domeGradient(Math.abs(y), dome.ry, dome.scaleY);
            } else {
                gx = Math.max(-1, Math.min(1, x / halfW));
                gy = Math.max(-1, Math.min(1, y / halfH));
            }

            if (splayActive) {
                const edgeX = Math.max(0, 1 - (halfW - Math.abs(x)) / minHalf) * (1 - splay);
                const edgeY = Math.max(0, 1 - (halfH - Math.abs(y)) / minHalf) * (1 - splay);
                const originalLength = Math.hypot(gx, gy);
                gx *= 1 - edgeY;
                gy *= 1 - edgeX;

                const nextLength = Math.hypot(gx, gy);
                if (nextLength > 0.001) {
                    gx *= originalLength / nextLength;
                    gy *= originalLength / nextLength;
                }
            }

            const inner = roundedRectSdf(x, y, innerHalfW, innerHalfH, innerRadius);
            const falloff = 0.5 * (1 + erfApprox(inner * invSigma));
            const r = (0.5 - 0.5 * gx * falloff) * 255;
            const g = (0.5 - 0.5 * gy * falloff) * 255;
            const baseNx = Math.max(-1, Math.min(1, x / halfW));
            const baseNy = Math.max(-1, Math.min(1, y / halfH));
            const highlightAxis = Math.abs(baseNx * specX + baseNy * specY);
            let spec = 0;

            if (params.glow > 0) {
                const t = Math.min(1, Math.max(0, (highlightAxis - glowThreshold) / glowRange));
                spec += params.glow * t ** 1.5 * falloff;
            }

            if (params.edge > 0) {
                const edgeMask = outer < 0 ? Math.max(0, 1 + outer / edgeRange) : 0;
                spec += params.edge * edgeMask * highlightAxis ** 1.2;
            }

            writeSymmetricPixels(px, py, clampByte(r), clampByte(g), clampByte(128 + 127 * Math.min(1, spec)), false);
        }
    }

    ctx.putImageData(image, 0, 0);

    return image;
};

export const generateDisplacementMap = (params: DisplacementMapParams) => {
    if (!canvas) return '';

    const image = generateDisplacementMapImageData(params);
    if (!image) return '';

    return canvas.toDataURL('image/png');
};
