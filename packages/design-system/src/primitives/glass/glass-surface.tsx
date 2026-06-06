'use client';

import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { glassTokens } from './tokens';

type GlassTone = 'dark' | 'light' | 'clear';
type GlassShape = 'rounded' | 'pill';

export interface GlassSurfaceProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    tone?: GlassTone;
    shape?: GlassShape;
    elevated?: boolean;
    interactive?: boolean;
    blur?: keyof typeof glassTokens.blur;
}

export function GlassSurface({
    children,
    className,
    tone = 'dark',
    shape = 'rounded',
    elevated = true,
    interactive = false,
    blur = 'default',
    style,
    ...props
}: GlassSurfaceProps) {
    const classes = [
        'gds-glass-surface',
        `gds-glass-surface--${tone}`,
        `gds-glass-surface--${shape}`,
        elevated ? 'gds-glass-surface--elevated' : '',
        interactive ? 'gds-glass-surface--interactive' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            className={classes}
            style={{ '--gds-glass-blur': glassTokens.blur[blur], ...style } as CSSProperties}
            {...props}
        >
            <span aria-hidden="true" className="gds-glass-surface__shine" />
            <div className="gds-glass-surface__content">{children}</div>
        </div>
    );
}

export interface GlassLensProps extends GlassSurfaceProps {
    width?: number | string;
    height?: number | string;
}

export function GlassLens({ width = 300, height = 132, style, shape = 'pill', ...props }: GlassLensProps) {
    return <GlassSurface shape={shape} style={{ width, height, ...style }} {...props} />;
}
