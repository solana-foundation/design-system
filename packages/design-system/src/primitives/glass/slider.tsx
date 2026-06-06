'use client';

import {
    type ChangeEvent,
    type ChangeEventHandler,
    type CSSProperties,
    type InputHTMLAttributes,
    type PointerEventHandler,
    type RefObject,
    type ReactNode,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from 'react';
import { GlassRefraction, getGlassFilterBleed, getGlassFilterId, getGlassFilterVersion } from './glass-refraction';
import { GlassSurface, type GlassSurfaceProps } from './glass-surface';
import { generateDisplacementMapImageData } from './displacement-map';

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const DEFAULT_CONTROL_HEIGHT = 44;
const DEFAULT_LENS_WIDTH = 63;
const DEFAULT_LENS_HEIGHT = 34;
const DEFAULT_LENS_RADIUS = 80;
const DEFAULT_SLIDER_WIDTH = 244;
const DEFAULT_STEP = 1;
const DEFAULT_TRACK_HEIGHT = 9;
const CANVAS_STRENGTH = 0.62;
const SAFARI_USER_AGENT = /^((?!chrome|android).)*safari/i;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getPercent = (value: number, min: number, max: number) => {
    if (max <= min) return 0;

    return ((clamp(value, min, max) - min) / (max - min)) * 100;
};

const sanitizeId = (id: string) => id.replaceAll(/[^a-zA-Z0-9_-]/g, '');

const getDecimalPlaces = (value: number) => {
    if (Number.isInteger(value)) return 0;

    const valueString = value.toString().toLowerCase();
    const exponentParts = valueString.split('e-');

    if (exponentParts.length === 2) {
        return Number(exponentParts[1]);
    }

    return valueString.split('.')[1]?.length ?? 0;
};

const snapValueToStep = (
    value: number,
    min: number,
    max: number,
    step: InputHTMLAttributes<HTMLInputElement>['step'],
) => {
    const clampedValue = clamp(value, min, max);

    if (step === 'any') return clampedValue;

    const stepValue = Number(step ?? DEFAULT_STEP);
    if (!Number.isFinite(stepValue) || stepValue <= 0) return clampedValue;

    const snappedValue = min + Math.round((clampedValue - min) / stepValue) * stepValue;
    const precision = Math.max(getDecimalPlaces(stepValue), getDecimalPlaces(min));

    return Number(clamp(snappedValue, min, max).toFixed(precision));
};

const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
) => {
    const r = Math.max(0, Math.min(radius, width / 2, height / 2));

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
};

const isInsideRoundedRect = (x: number, y: number, width: number, height: number, radius: number) => {
    const r = Math.max(0, Math.min(radius, width / 2, height / 2));
    const cx = Math.max(r, Math.min(width - r, x));
    const cy = Math.max(r, Math.min(height - r, y));
    const dx = x - cx;
    const dy = y - cy;

    return dx * dx + dy * dy <= r * r;
};

const isTransparentColor = (color: string) =>
    color === 'transparent' || color === 'rgba(0, 0, 0, 0)' || color === 'rgb(0 0 0 / 0)' || color.endsWith('/ 0)');

const getCanvasBackgroundColor = (element: HTMLElement | null) => {
    let current: HTMLElement | null = element;

    while (current) {
        const backgroundColor = getComputedStyle(current).backgroundColor.trim();

        if (backgroundColor && !isTransparentColor(backgroundColor)) {
            return backgroundColor;
        }

        current = current.parentElement;
    }

    return '#ffffff';
};

const sampleImageChannel = (
    data: Uint8ClampedArray,
    width: number,
    height: number,
    x: number,
    y: number,
    channel: number,
) => {
    const sx = clamp(x, 0, width - 1);
    const sy = clamp(y, 0, height - 1);
    const x0 = Math.floor(sx);
    const y0 = Math.floor(sy);
    const x1 = Math.min(width - 1, x0 + 1);
    const y1 = Math.min(height - 1, y0 + 1);
    const tx = sx - x0;
    const ty = sy - y0;
    const i00 = (y0 * width + x0) * 4 + channel;
    const i10 = (y0 * width + x1) * 4 + channel;
    const i01 = (y1 * width + x0) * 4 + channel;
    const i11 = (y1 * width + x1) * 4 + channel;
    const top = data[i00] * (1 - tx) + data[i10] * tx;
    const bottom = data[i01] * (1 - tx) + data[i11] * tx;

    return top * (1 - ty) + bottom * ty;
};

const SliderVisual = ({ inert = false }: { inert?: boolean }) => (
    <span aria-hidden={inert ? 'true' : undefined} className="gds-slider__visual">
        <span className="gds-slider__track">
            <span className="gds-slider__fill" />
        </span>
    </span>
);

interface SliderCanvasLensProps {
    chroma: number;
    controlHeight: number;
    controlWidth: number;
    depth: number;
    dome: number;
    edge: number;
    glow: number;
    hostRef: RefObject<HTMLSpanElement | null>;
    lensHeight: number;
    lensRadius: number;
    lensWidth: number;
    lensX: number;
    lensY: number;
    mapSize: number;
    scaleX: number;
    scaleY: number;
    splay: number;
    trackHeight: number;
    valuePercent: number;
}

const SliderCanvasLens = ({
    chroma,
    controlHeight,
    controlWidth,
    depth,
    dome,
    edge,
    glow,
    hostRef,
    lensHeight,
    lensRadius,
    lensWidth,
    lensX,
    lensY,
    mapSize,
    scaleX,
    scaleY,
    splay,
    trackHeight,
    valuePercent,
}: SliderCanvasLensProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || controlWidth <= 0 || controlHeight <= 0 || lensWidth <= 0 || lensHeight <= 0) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        const pixelRatio = Math.max(1, Math.min(window.devicePixelRatio || 1, 3));
        const lensPixelWidth = Math.max(1, Math.round(lensWidth * pixelRatio));
        const lensPixelHeight = Math.max(1, Math.round(lensHeight * pixelRatio));
        const sourceWidth = Math.max(1, Math.round(controlWidth * pixelRatio));
        const sourceHeight = Math.max(1, Math.round(controlHeight * pixelRatio));

        if (canvas.width !== lensPixelWidth || canvas.height !== lensPixelHeight) {
            canvas.width = lensPixelWidth;
            canvas.height = lensPixelHeight;
        }

        const sourceCanvas = document.createElement('canvas');
        sourceCanvas.width = sourceWidth;
        sourceCanvas.height = sourceHeight;
        const sourceCtx = sourceCanvas.getContext('2d', { alpha: true });
        if (!sourceCtx) return;

        sourceCtx.scale(pixelRatio, pixelRatio);

        const hostStyle = getComputedStyle(hostRef.current ?? canvas);
        const trackColor = hostStyle.getPropertyValue('--gds-slider-track-bg').trim() || 'rgba(148, 163, 184, 0.34)';
        const fillColor = hostStyle.getPropertyValue('--gds-slider-fill-bg').trim() || '#2f7dff';
        const sourceBackground = getCanvasBackgroundColor(hostRef.current ?? canvas);
        const trackLeft = lensWidth / 2;
        const trackWidth = Math.max(0, controlWidth - lensWidth);
        const trackTop = controlHeight / 2 - trackHeight / 2;

        sourceCtx.fillStyle = sourceBackground;
        sourceCtx.fillRect(0, 0, controlWidth, controlHeight);
        drawRoundedRect(sourceCtx, trackLeft, trackTop, trackWidth, trackHeight, trackHeight / 2);
        sourceCtx.fillStyle = trackColor;
        sourceCtx.fill();

        drawRoundedRect(
            sourceCtx,
            trackLeft,
            trackTop,
            trackWidth * (valuePercent / 100),
            trackHeight,
            trackHeight / 2,
        );
        sourceCtx.fillStyle = fillColor;
        sourceCtx.fill();

        const scenePixels = sourceCtx.getImageData(0, 0, sourceWidth, sourceHeight);
        const mapPixels = generateDisplacementMapImageData({
            depth,
            dome,
            edge,
            glow,
            lensH: lensHeight,
            lensW: lensWidth,
            mapSize,
            radius: lensRadius,
            splay,
        });
        if (!mapPixels) return;

        const out = ctx.createImageData(lensPixelWidth, lensPixelHeight);
        const rawBaseScale = Math.max(scaleX, scaleY);
        const baseScale = rawBaseScale * CANVAS_STRENGTH;
        const ratioX = rawBaseScale > 0 ? scaleX / rawBaseScale : 0;
        const ratioY = rawBaseScale > 0 ? scaleY / rawBaseScale : 0;
        const scaleR = baseScale * (1 + 0.2 * chroma);
        const scaleG = baseScale * (1 + 0.1 * chroma);
        const scaleB = baseScale;

        for (let y = 0; y < lensPixelHeight; y += 1) {
            for (let x = 0; x < lensPixelWidth; x += 1) {
                const outIndex = (y * lensPixelWidth + x) * 4;
                const cssX = (x + 0.5) / pixelRatio;
                const cssY = (y + 0.5) / pixelRatio;

                if (!isInsideRoundedRect(cssX, cssY, lensWidth, lensHeight, lensRadius)) {
                    out.data[outIndex + 3] = 0;
                    continue;
                }

                const mx = Math.max(0, Math.min(mapPixels.width - 1, Math.floor((cssX / lensWidth) * mapPixels.width)));
                const my = Math.max(
                    0,
                    Math.min(mapPixels.height - 1, Math.floor((cssY / lensHeight) * mapPixels.height)),
                );
                const mapIndex = (my * mapPixels.width + mx) * 4;
                const mapDx = (mapPixels.data[mapIndex] / 255 - 0.5) * ratioX;
                const mapDy = (mapPixels.data[mapIndex + 1] / 255 - 0.5) * ratioY;
                const gx = lensX + cssX;
                const gy = lensY + cssY;

                out.data[outIndex] = sampleImageChannel(
                    scenePixels.data,
                    sourceWidth,
                    sourceHeight,
                    (gx + mapDx * scaleR) * pixelRatio,
                    (gy + mapDy * scaleR) * pixelRatio,
                    0,
                );
                out.data[outIndex + 1] = sampleImageChannel(
                    scenePixels.data,
                    sourceWidth,
                    sourceHeight,
                    (gx + mapDx * scaleG) * pixelRatio,
                    (gy + mapDy * scaleG) * pixelRatio,
                    1,
                );
                out.data[outIndex + 2] = sampleImageChannel(
                    scenePixels.data,
                    sourceWidth,
                    sourceHeight,
                    (gx + mapDx * scaleB) * pixelRatio,
                    (gy + mapDy * scaleB) * pixelRatio,
                    2,
                );
                out.data[outIndex + 3] = 255;

                const spec = Math.max(0, mapPixels.data[mapIndex + 2] - 128) / 127;
                if (spec > 0) {
                    const alpha = Math.min(0.52, spec * 0.52);
                    out.data[outIndex] = Math.round(out.data[outIndex] * (1 - alpha) + 255 * alpha);
                    out.data[outIndex + 1] = Math.round(out.data[outIndex + 1] * (1 - alpha) + 255 * alpha);
                    out.data[outIndex + 2] = Math.round(out.data[outIndex + 2] * (1 - alpha) + 255 * alpha);
                }
            }
        }

        ctx.putImageData(out, 0, 0);
    }, [
        chroma,
        controlHeight,
        controlWidth,
        depth,
        dome,
        edge,
        glow,
        hostRef,
        lensHeight,
        lensRadius,
        lensWidth,
        lensX,
        lensY,
        mapSize,
        scaleX,
        scaleY,
        splay,
        trackHeight,
        valuePercent,
    ]);

    return <canvas aria-hidden="true" className="gds-slider__lens-canvas" ref={canvasRef} />;
};

export interface SliderProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'children' | 'defaultValue' | 'max' | 'min' | 'onChange' | 'type' | 'value'
> {
    /** Initial value for uncontrolled sliders. */
    defaultValue?: number;
    /** Label rendered above the slider. */
    label?: ReactNode;
    /** Maximum slider value. */
    max?: number;
    /** Minimum slider value. */
    min?: number;
    /** Native change handler for the underlying range input. */
    onChange?: ChangeEventHandler<HTMLInputElement>;
    /** Numeric value callback for controlled or uncontrolled usage. */
    onValueChange?: (value: number) => void;
    /** Displays the current value beside the label. */
    showValue?: boolean;
    /** Width of the full slider control. */
    sliderWidth?: CSSProperties['width'];
    /** Height of the slider interaction area. */
    controlHeight?: number;
    /** Height of the slider track. */
    trackHeight?: number;
    /** Formats the displayed value when `showValue` is enabled. */
    valueFormatter?: (value: number) => ReactNode;
    /** Controlled slider value. */
    value?: number;
    /** Source blur applied before displacement inside the glass node. */
    glassBlur?: number;
    /** Chromatic separation amount for the glass node. */
    glassChroma?: number;
    /** Edge falloff depth for the generated displacement map. */
    glassDepth?: number;
    /** Dome curvature for the generated displacement map. */
    glassDome?: number;
    /** Edge highlight strength for the glass node. */
    glassEdge?: number;
    /** Glow/specular strength for the glass node. */
    glassGlow?: number;
    /** Height of the glass lens node. */
    glassLensH?: number;
    /** Width of the glass lens node. */
    glassLensW?: number;
    /** How strongly the refracted source stays locked to the page while the node moves. */
    glassContentLock?: number;
    /** Displacement map resolution. */
    glassMapSize?: number;
    /** Optical content zoom inside the glass node. */
    glassMagnification?: number;
    /** Corner radius of the glass lens node. */
    glassRadius?: number;
    /** Horizontal displacement strength for the glass node. */
    glassScaleX?: number;
    /** Vertical displacement strength for the glass node. */
    glassScaleY?: number;
    /** Refreshes the SVG filter id as the lens changes, matching the Safari prototype workaround. */
    glassSafariRefresh?: boolean;
    /** Edge deformation/splay for the generated displacement map. */
    glassSplay?: number;
    /** Fast viewport target mode. The slider currently renders with the viewport path. */
    glassTargetMode?: boolean;
    /** Keeps full chroma/blur quality while pointer dragging. */
    glassFullDragFilter?: boolean;
    /** Enables backdrop frost on the moving lens. */
    glassDragFrost?: boolean;
    /** Emits glass tuning logs in development. */
    glassDebugLogs?: boolean;
    /** Glass tone applied to the thumb node. */
    thumbTone?: GlassSurfaceProps['tone'];
}

export function Slider({
    className,
    controlHeight,
    defaultValue,
    disabled = false,
    glassBlur = 0,
    glassChroma = 0,
    glassDepth = 3.5,
    glassDome = 0,
    glassEdge = 0,
    glassGlow = 0,
    glassContentLock = 0.86,
    glassLensH = DEFAULT_LENS_HEIGHT,
    glassLensW = DEFAULT_LENS_WIDTH,
    glassMapSize = 512,
    glassMagnification = 1.4,
    glassRadius = DEFAULT_LENS_RADIUS,
    glassScaleX = 38,
    glassScaleY = 38,
    glassSafariRefresh = true,
    glassSplay = 0.49,
    glassTargetMode = true,
    glassFullDragFilter = true,
    glassDragFrost = false,
    glassDebugLogs = false,
    id,
    label,
    max = DEFAULT_MAX,
    min = DEFAULT_MIN,
    onChange,
    onBlur,
    onLostPointerCapture,
    onPointerCancel,
    onPointerDown,
    onPointerUp,
    onValueChange,
    showValue = false,
    sliderWidth = DEFAULT_SLIDER_WIDTH,
    step,
    style,
    thumbTone = 'clear',
    trackHeight = DEFAULT_TRACK_HEIGHT,
    value,
    valueFormatter,
    ...props
}: SliderProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const filterIdBase = `gds-glass-slider-filter-${sanitizeId(generatedId)}`;
    const controlRef = useRef<HTMLSpanElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const skipDispatchedInputRef = useRef(false);
    const isControlled = value !== undefined;
    const initialValue = defaultValue ?? min;
    const currentValueRef = useRef(initialValue);
    const [uncontrolledValue, setUncontrolledValue] = useState(initialValue);
    const [controlSize, setControlSize] = useState({ height: 0, width: 0 });
    const [isSafari] = useState(() => typeof navigator !== 'undefined' && SAFARI_USER_AGENT.test(navigator.userAgent));
    const [isDragging, setIsDragging] = useState(false);
    const currentValue = isControlled ? value : uncontrolledValue;
    currentValueRef.current = currentValue;
    const valuePercent = getPercent(currentValue, min, max);
    const valueRatio = valuePercent / 100;
    const isGlassActive = !disabled && isDragging;
    const classes = [
        'gds-slider',
        isGlassActive ? 'gds-slider--active' : '',
        disabled ? 'gds-slider--disabled' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');
    const formattedValue = valueFormatter ? valueFormatter(currentValue) : currentValue;
    const resolvedControlHeight = controlHeight ?? Math.max(DEFAULT_CONTROL_HEIGHT, glassLensH);
    const lensGeometry = useMemo(() => {
        const travel = Math.max(0, controlSize.width - glassLensW);
        const lensX = travel * valueRatio;
        const lensY = Math.max(0, (controlSize.height - glassLensH) / 2);

        return {
            lensCenterX: lensX + glassLensW / 2,
            lensTravelCenterX: travel / 2,
            lensX,
            lensY,
        };
    }, [controlSize.height, controlSize.width, glassLensH, glassLensW, valueRatio]);
    const activeGlassBlur = glassFullDragFilter || !isDragging ? glassBlur : 0;
    const activeGlassScaleX = glassFullDragFilter || !isDragging ? glassScaleX : Math.min(glassScaleX, 4);
    const activeGlassScaleY = glassFullDragFilter || !isDragging ? glassScaleY : Math.min(glassScaleY, 4);
    const filterVersion = getGlassFilterVersion({
        blur: activeGlassBlur,
        chroma: glassChroma,
        controlHeight: controlSize.height,
        controlWidth: controlSize.width,
        depth: glassDepth,
        dome: glassDome,
        edge: glassEdge,
        glow: glassGlow,
        lensHeight: glassLensH,
        lensRadius: glassRadius,
        lensWidth: glassLensW,
        magnification: glassMagnification,
        mapSize: glassMapSize,
        scaleX: activeGlassScaleX,
        scaleY: activeGlassScaleY,
        splay: glassSplay,
    });
    const filterId = getGlassFilterId({
        baseId: filterIdBase,
        refresh: glassSafariRefresh,
        version: filterVersion,
    });
    const contentLock = clamp(glassContentLock, 0, 1);
    const lensSourceX =
        lensGeometry.lensTravelCenterX + (lensGeometry.lensX - lensGeometry.lensTravelCenterX) * contentLock;
    const filterBleed = getGlassFilterBleed({
        blur: activeGlassBlur,
        chroma: glassChroma,
        scaleX: activeGlassScaleX,
        scaleY: activeGlassScaleY,
    });
    const filterWidth = controlSize.width + filterBleed * 2;
    const filterHeight = controlSize.height + filterBleed * 2;
    const lensFilterX = lensSourceX + filterBleed;
    const lensFilterY = lensGeometry.lensY + filterBleed;
    const lensContentTransform = `translate3d(${-lensFilterX}px, ${-lensFilterY}px, 0)`;
    const lensClasses = [
        'gds-slider__lens',
        glassDragFrost ? 'gds-slider__lens--frost' : '',
        glassTargetMode ? 'gds-slider__lens--target-mode' : 'gds-slider__lens--source-mode',
    ]
        .filter(Boolean)
        .join(' ');
    const useCanvasLens = glassTargetMode && isSafari;

    const applyValue = (nextValue: number) => {
        if (nextValue === currentValueRef.current) return false;

        currentValueRef.current = nextValue;

        if (!isControlled) {
            setUncontrolledValue(nextValue);
        }

        onValueChange?.(nextValue);

        return true;
    };

    const dispatchInputChange = (nextValue: number) => {
        const input = inputRef.current;
        if (!input) return;

        const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;

        skipDispatchedInputRef.current = true;
        valueSetter?.call(input, String(nextValue));
        input.dispatchEvent(new Event('input', { bubbles: true }));
        skipDispatchedInputRef.current = false;
    };

    const updateValueFromPointer = (clientX: number) => {
        const control = controlRef.current;
        if (!control) return;

        const rect = control.getBoundingClientRect();
        const travel = Math.max(1, rect.width - glassLensW);
        const pointerRatio = clamp((clientX - rect.left - glassLensW / 2) / travel, 0, 1);
        const nextValue = snapValueToStep(min + pointerRatio * (max - min), min, max, step);

        if (applyValue(nextValue)) {
            dispatchInputChange(nextValue);
        }
    };

    useEffect(() => {
        const control = controlRef.current;
        if (!control) return undefined;

        const updateSize = () => {
            const rect = control.getBoundingClientRect();
            setControlSize({ height: rect.height, width: rect.width });
        };
        updateSize();

        const resizeObserver = new ResizeObserver(updateSize);
        resizeObserver.observe(control);

        return () => resizeObserver.disconnect();
    }, []);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextValue = event.currentTarget.valueAsNumber;

        if (!skipDispatchedInputRef.current) {
            applyValue(nextValue);
        }

        onChange?.(event);
    };

    const handlePointerDown: PointerEventHandler<HTMLSpanElement> = event => {
        if (disabled) return;

        event.preventDefault();
        inputRef.current?.focus({ preventScroll: true });
        setIsDragging(true);
        updateValueFromPointer(event.clientX);

        if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.setPointerCapture(event.pointerId);
        }

        onPointerDown?.(event as unknown as Parameters<NonNullable<typeof onPointerDown>>[0]);
    };

    const handlePointerMove: PointerEventHandler<HTMLSpanElement> = event => {
        if (!isDragging || disabled) return;

        event.preventDefault();
        updateValueFromPointer(event.clientX);
    };

    const handlePointerUp: PointerEventHandler<HTMLSpanElement> = event => {
        setIsDragging(false);

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        onPointerUp?.(event as unknown as Parameters<NonNullable<typeof onPointerUp>>[0]);
    };

    const handlePointerCancel: PointerEventHandler<HTMLSpanElement> = event => {
        setIsDragging(false);
        onPointerCancel?.(event as unknown as Parameters<NonNullable<typeof onPointerCancel>>[0]);
    };

    const handleBlur: InputHTMLAttributes<HTMLInputElement>['onBlur'] = event => {
        setIsDragging(false);
        onBlur?.(event);
    };

    const handleLostPointerCapture: PointerEventHandler<HTMLSpanElement> = event => {
        setIsDragging(false);
        onLostPointerCapture?.(event as unknown as Parameters<NonNullable<typeof onLostPointerCapture>>[0]);
    };

    useEffect(() => {
        if (import.meta.env.PROD || !glassDebugLogs) return;

        console.info('[glass-slider]', {
            activeGlassBlur,
            activeGlassScaleX,
            activeGlassScaleY,
            glassChroma,
            glassDepth,
            glassDome,
            glassEdge,
            glassGlow,
            glassContentLock,
            glassLensH,
            glassLensW,
            glassMapSize,
            glassMagnification,
            glassRadius,
            glassSafariRefresh,
            glassSplay,
            glassTargetMode,
            resolvedControlHeight,
            sliderWidth,
            trackHeight,
            value: currentValue,
        });
    }, [
        activeGlassBlur,
        activeGlassScaleX,
        activeGlassScaleY,
        currentValue,
        glassChroma,
        glassDebugLogs,
        glassDepth,
        glassDome,
        glassEdge,
        glassGlow,
        glassContentLock,
        glassLensH,
        glassLensW,
        glassMapSize,
        glassMagnification,
        glassRadius,
        glassSafariRefresh,
        glassSplay,
        glassTargetMode,
        resolvedControlHeight,
        sliderWidth,
        trackHeight,
    ]);

    return (
        <label
            className={classes}
            htmlFor={inputId}
            style={
                {
                    '--gds-slider-percent': `${valuePercent}%`,
                    '--gds-slider-hit-area': `${resolvedControlHeight}px`,
                    '--gds-slider-lens-height': `${glassLensH}px`,
                    '--gds-slider-lens-left': `${lensGeometry.lensX}px`,
                    '--gds-slider-lens-radius': `${glassRadius}px`,
                    '--gds-slider-lens-top': `${lensGeometry.lensY}px`,
                    '--gds-slider-lens-width': `${glassLensW}px`,
                    '--gds-slider-track-height': `${trackHeight}px`,
                    '--gds-slider-thumb-left': `${lensGeometry.lensCenterX}px`,
                    width: sliderWidth,
                    ...style,
                } as CSSProperties
            }
        >
            {(label || showValue) && (
                <span className="gds-slider__header">
                    {label && <span className="gds-slider__label">{label}</span>}
                    {showValue && <span className="gds-slider__value">{formattedValue}</span>}
                </span>
            )}
            <span
                className="gds-slider__control"
                ref={controlRef}
                onLostPointerCapture={handleLostPointerCapture}
                onPointerCancel={handlePointerCancel}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                <span aria-hidden="true" className="gds-slider__rail">
                    <SliderVisual inert />
                    <span className={lensClasses}>
                        {isGlassActive ? (
                            <>
                                {useCanvasLens ? (
                                    <SliderCanvasLens
                                        chroma={glassChroma}
                                        controlHeight={controlSize.height}
                                        controlWidth={controlSize.width}
                                        depth={glassDepth}
                                        dome={glassDome}
                                        edge={glassEdge}
                                        glow={glassGlow}
                                        hostRef={controlRef}
                                        lensHeight={glassLensH}
                                        lensRadius={glassRadius}
                                        lensWidth={glassLensW}
                                        lensX={lensSourceX}
                                        lensY={lensGeometry.lensY}
                                        mapSize={glassMapSize}
                                        scaleX={activeGlassScaleX}
                                        scaleY={activeGlassScaleY}
                                        splay={glassSplay}
                                        trackHeight={trackHeight}
                                        valuePercent={valuePercent}
                                    />
                                ) : (
                                    <GlassRefraction
                                        blur={activeGlassBlur}
                                        chroma={glassChroma}
                                        contentClassName="gds-slider__lens-content"
                                        depth={glassDepth}
                                        dome={glassDome}
                                        edge={glassEdge}
                                        filterHeight={filterHeight}
                                        filterId={filterId}
                                        filterVariableName="--gds-slider-lens-filter"
                                        filterWidth={filterWidth}
                                        glow={glassGlow}
                                        lensContentTransform={lensContentTransform}
                                        lensFilterX={lensFilterX}
                                        lensFilterY={lensFilterY}
                                        lensHeight={glassLensH}
                                        lensRadius={glassRadius}
                                        lensWidth={glassLensW}
                                        magnification={glassMagnification}
                                        mapSize={glassMapSize}
                                        scaleX={activeGlassScaleX}
                                        scaleY={activeGlassScaleY}
                                        sourceChildren={
                                            <>
                                                <span className="gds-slider__lens-source-bg" />
                                                <SliderVisual inert />
                                            </>
                                        }
                                        sourceClassName="gds-slider__lens-source"
                                        sourceHeight={controlSize.height}
                                        sourceTransform={`translate3d(${filterBleed}px, ${filterBleed}px, 0)`}
                                        sourceWidth={controlSize.width}
                                        splay={glassSplay}
                                        surfaceClassName="gds-slider__lens-glass"
                                        tone={thumbTone}
                                    />
                                )}
                                {useCanvasLens && (
                                    <GlassSurface
                                        blur="default"
                                        className="gds-slider__lens-glass"
                                        elevated
                                        shape="pill"
                                        style={{ borderRadius: glassRadius }}
                                        tone={thumbTone}
                                    />
                                )}
                            </>
                        ) : (
                            <span className="gds-slider__thumb" />
                        )}
                    </span>
                </span>
                <input
                    {...props}
                    className="gds-slider__input"
                    disabled={disabled}
                    id={inputId}
                    max={max}
                    min={min}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={inputRef}
                    step={step}
                    type="range"
                    value={isControlled ? value : undefined}
                    defaultValue={isControlled ? undefined : initialValue}
                />
            </span>
        </label>
    );
}
