'use client';

import type { CSSProperties, ReactNode } from 'react';
import { GlassFilter, type GlassFilterProps } from './glass-filter';
import { GlassSurface, type GlassSurfaceProps } from './glass-surface';

export interface GlassFilterVersionParams {
    blur: number;
    chroma: number;
    controlHeight: number;
    controlWidth: number;
    depth: number;
    dome: number;
    edge: number;
    glow: number;
    lensHeight: number;
    lensRadius: number;
    lensWidth: number;
    magnification: number;
    mapSize: number;
    scaleX: number;
    scaleY: number;
    splay: number;
}

export const getGlassFilterVersion = ({
    blur,
    chroma,
    controlHeight,
    controlWidth,
    depth,
    dome,
    edge,
    glow,
    lensHeight,
    lensRadius,
    lensWidth,
    magnification,
    mapSize,
    scaleX,
    scaleY,
    splay,
}: GlassFilterVersionParams) =>
    [
        Math.round(controlWidth),
        Math.round(controlHeight),
        Math.round(lensWidth),
        Math.round(lensHeight),
        lensRadius,
        mapSize,
        Math.round(magnification * 100),
        Math.round(splay * 1000),
        Math.round(chroma * 1000),
        Math.round(depth * 100),
        Math.round(dome * 100),
        Math.round(edge * 1000),
        Math.round(glow * 1000),
        Math.round(blur * 100),
        Math.round(scaleX * 100),
        Math.round(scaleY * 100),
    ].join('-');

export const getGlassFilterId = ({
    baseId,
    refresh,
    version,
}: {
    baseId: string;
    refresh: boolean;
    version: string;
}) => (refresh ? `${baseId}-${version}` : baseId);

export const getGlassFilterBleed = ({
    blur,
    chroma,
    scaleX,
    scaleY,
}: {
    blur: number;
    chroma: number;
    scaleX: number;
    scaleY: number;
}) => Math.ceil(Math.max(scaleX, scaleY) * (1 + 0.2 * chroma) + blur + 4);

export interface GlassRefractionProps extends Omit<
    GlassFilterProps,
    'filterId' | 'height' | 'lensX' | 'lensY' | 'width'
> {
    backdropClassName?: string;
    backdropStyle?: CSSProperties;
    contentClassName: string;
    contentStyle?: CSSProperties;
    filterHeight: number;
    filterId: string;
    filterVariableName: `--${string}`;
    filterWidth: number;
    lensContentTransform: string;
    lensFilterX: number;
    lensFilterY: number;
    sourceChildren: ReactNode;
    sourceClassName: string;
    sourceHeight: number;
    sourceStyle?: CSSProperties;
    sourceTransform: string;
    sourceWidth: number;
    surfaceClassName: string;
    surfaceStyle?: CSSProperties;
    tone?: GlassSurfaceProps['tone'];
}

export function GlassRefraction({
    backdropClassName = 'gds-glass-refraction__backdrop',
    backdropStyle,
    blur,
    chroma,
    contentClassName,
    contentStyle,
    depth,
    dome,
    edge,
    filterHeight,
    filterId,
    filterVariableName,
    filterWidth,
    glow,
    lensContentTransform,
    lensFilterX,
    lensFilterY,
    lensHeight,
    lensRadius,
    lensWidth,
    magnification,
    mapSize,
    scaleX,
    scaleY,
    sourceChildren,
    sourceClassName,
    sourceHeight,
    sourceStyle,
    sourceTransform,
    sourceWidth,
    splay,
    surfaceClassName,
    surfaceStyle,
    tone = 'clear',
}: GlassRefractionProps) {
    return (
        <>
            <GlassFilter
                blur={blur}
                chroma={chroma}
                depth={depth}
                dome={dome}
                edge={edge}
                filterId={filterId}
                glow={glow}
                height={filterHeight}
                lensHeight={lensHeight}
                lensRadius={lensRadius}
                lensWidth={lensWidth}
                lensX={lensFilterX}
                lensY={lensFilterY}
                magnification={magnification}
                mapSize={mapSize}
                scaleX={scaleX}
                scaleY={scaleY}
                splay={splay}
                width={filterWidth}
            />
            <span
                className={contentClassName}
                style={
                    {
                        [filterVariableName]: `url(#${filterId})`,
                        height: filterHeight,
                        transform: lensContentTransform,
                        width: filterWidth,
                        ...contentStyle,
                    } as CSSProperties
                }
            >
                <span className={backdropClassName} style={backdropStyle} />
                <span
                    className={sourceClassName}
                    style={{
                        height: sourceHeight,
                        transform: sourceTransform,
                        width: sourceWidth,
                        ...sourceStyle,
                    }}
                >
                    {sourceChildren}
                </span>
            </span>
            <GlassSurface
                blur="default"
                className={surfaceClassName}
                elevated
                shape="pill"
                style={{ borderRadius: lensRadius, ...surfaceStyle }}
                tone={tone}
            />
        </>
    );
}
