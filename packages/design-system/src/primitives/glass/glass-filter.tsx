'use client';

import { useMemo } from 'react';
import { generateDisplacementMap, type DisplacementMapParams } from './displacement-map';

export interface GlassFilterProps {
    blur?: number;
    chroma?: number;
    depth?: number;
    dome?: number;
    edge?: number;
    filterId: string;
    glow?: number;
    height: number;
    lensHeight: number;
    lensRadius: number;
    lensWidth: number;
    lensX: number;
    lensY: number;
    magnification?: number;
    mapSize?: number;
    scaleX?: number;
    scaleY?: number;
    splay?: number;
    width: number;
}

const DEFAULT_MAP_PARAMS = {
    depth: 3.5,
    dome: 0,
    edge: 0,
    glow: 0,
    mapSize: 512,
    splay: 0.49,
} as const;

const colorMatrixForScale = (scaleX: number, scaleY: number) => {
    const base = Math.max(scaleX, scaleY);
    const rx = base > 0 ? scaleX / base : 0;
    const ry = base > 0 ? scaleY / base : 0;

    return `${rx} 0 0 0 ${0.5 * (1 - rx)}  0 ${ry} 0 0 ${0.5 * (1 - ry)}  0 0 1 0 0  0 0 0 1 0`;
};

export function GlassFilter({
    blur = 0.25,
    chroma = 0,
    depth = DEFAULT_MAP_PARAMS.depth,
    dome = DEFAULT_MAP_PARAMS.dome,
    edge = DEFAULT_MAP_PARAMS.edge,
    filterId,
    glow = DEFAULT_MAP_PARAMS.glow,
    height,
    lensHeight,
    lensRadius,
    lensWidth,
    lensX,
    lensY,
    mapSize = DEFAULT_MAP_PARAMS.mapSize,
    scaleX = 38,
    scaleY = 38,
    splay = DEFAULT_MAP_PARAMS.splay,
    width,
}: GlassFilterProps) {
    const mapParams: DisplacementMapParams = useMemo(
        () => ({
            ...DEFAULT_MAP_PARAMS,
            depth,
            dome,
            edge,
            glow,
            lensH: lensHeight,
            lensW: lensWidth,
            mapSize,
            radius: lensRadius,
            splay,
        }),
        [depth, dome, edge, glow, lensHeight, lensRadius, lensWidth, mapSize, splay],
    );
    const mapUrl = useMemo(() => generateDisplacementMap(mapParams), [mapParams]);
    const matrix = colorMatrixForScale(scaleX, scaleY);
    const baseScale = Math.max(scaleX, scaleY);
    const specStrength = 1.8;

    return (
        <svg aria-hidden="true" className="gds-filter-svg" focusable="false">
            <defs>
                <filter
                    colorInterpolationFilters="sRGB"
                    filterUnits="userSpaceOnUse"
                    height={height}
                    id={filterId}
                    primitiveUnits="userSpaceOnUse"
                    width={width}
                    x={0}
                    y={0}
                >
                    <feFlood floodColor="rgb(128,128,128)" floodOpacity="1" result="mapBg" />
                    <feImage
                        height={lensHeight}
                        href={mapUrl}
                        preserveAspectRatio="none"
                        result="rawMap"
                        width={lensWidth}
                        x={lensX}
                        y={lensY}
                    />
                    <feComposite in="rawMap" in2="mapBg" operator="over" result="map" />
                    <feColorMatrix in="map" result="scaledMap" type="matrix" values={matrix} />
                    <feGaussianBlur in="SourceGraphic" result="blurred" stdDeviation={blur * 0.18} />
                    <feDisplacementMap
                        in="blurred"
                        in2="scaledMap"
                        scale={baseScale * (1 + 0.2 * chroma)}
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                    <feColorMatrix result="dispR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
                    <feDisplacementMap
                        in="blurred"
                        in2="scaledMap"
                        scale={baseScale * (1 + 0.1 * chroma)}
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                    <feColorMatrix result="dispG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" />
                    <feDisplacementMap
                        in="blurred"
                        in2="scaledMap"
                        scale={baseScale}
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                    <feColorMatrix result="dispB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
                    <feComposite in="dispR" in2="dispG" k1={0} k2={1} k3={1} k4={0} operator="arithmetic" result="rg" />
                    <feComposite
                        in="rg"
                        in2="dispB"
                        k1={0}
                        k2={1}
                        k3={1}
                        k4={0}
                        operator="arithmetic"
                        result="lensResult"
                    />
                    <feFlood
                        floodColor="black"
                        floodOpacity="1"
                        height={lensHeight}
                        result="lensMask"
                        width={lensWidth}
                        x={lensX}
                        y={lensY}
                    />
                    <feComposite in="lensResult" in2="lensMask" operator="in" result="maskedLens" />
                    <feComposite in="SourceGraphic" in2="lensMask" operator="out" result="holedSource" />
                    <feColorMatrix
                        in="map"
                        result="specMask"
                        type="matrix"
                        values={`0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 ${specStrength} 0 ${-0.5 * specStrength}`}
                    />
                    <feComposite in="specMask" in2="lensMask" operator="in" result="maskedSpec" />
                    <feComposite in="maskedLens" in2="holedSource" operator="over" result="withLens" />
                    <feComposite in="maskedSpec" in2="withLens" operator="over" />
                </filter>
            </defs>
        </svg>
    );
}
