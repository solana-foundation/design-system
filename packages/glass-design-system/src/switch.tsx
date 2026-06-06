'use client';

import {
    type ChangeEvent,
    type ChangeEventHandler,
    type CSSProperties,
    type InputHTMLAttributes,
    type KeyboardEventHandler,
    type MouseEventHandler,
    type PointerEventHandler,
    type ReactNode,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from 'react';
import { GlassFilter } from './glass-filter';
import { GlassSurface, type GlassSurfaceProps } from './glass-surface';

const DEFAULT_CONTROL_HEIGHT = 52;
const DEFAULT_LENS_HEIGHT = 34;
const DEFAULT_LENS_WIDTH = 64;
const DEFAULT_LENS_RADIUS = 80;
const DEFAULT_SWITCH_WIDTH = 116;
const DEFAULT_TRACK_HEIGHT = 42;
const ACTIVE_RELEASE_MS = 320;
const ACTIVE_LENS_SCALE = 1.85;
const DRAG_THRESHOLD_PX = 4;
const END_PADDING_X = 5;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const sanitizeId = (id: string) => id.replaceAll(/[^a-zA-Z0-9_-]/g, '');

const SwitchVisual = ({ inert = false, source = false }: { inert?: boolean; source?: boolean }) => (
    <span
        aria-hidden={inert ? 'true' : undefined}
        className={['gds-switch__visual', source ? 'gds-switch__visual--source' : ''].filter(Boolean).join(' ')}
    >
        <span className="gds-switch__track">
            <span className="gds-switch__fill" />
        </span>
    </span>
);

export interface SwitchProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'checked' | 'children' | 'defaultChecked' | 'onChange' | 'type'
> {
    /** Holds the active glass stage for demos or externally controlled interactions. */
    active?: boolean;
    /** Controlled checked state. */
    checked?: boolean;
    /** Height of the switch interaction area. */
    controlHeight?: number;
    /** Initial checked state for uncontrolled switches. */
    defaultChecked?: boolean;
    /** Source blur applied before displacement inside the glass node. */
    glassBlur?: number;
    /** Chromatic separation amount for the glass node. */
    glassChroma?: number;
    /** How strongly the refracted source stays locked to the page while the node moves. */
    glassContentLock?: number;
    /** Edge falloff depth for the generated displacement map. */
    glassDepth?: number;
    /** Dome curvature for the generated displacement map. */
    glassDome?: number;
    /** Edge highlight strength for the glass node. */
    glassEdge?: number;
    /** Emits glass tuning logs in development. */
    glassDebugLogs?: boolean;
    /** Glow/specular strength for the glass node. */
    glassGlow?: number;
    /** Height of the glass thumb node. */
    glassLensH?: number;
    /** Width of the glass thumb node. */
    glassLensW?: number;
    /** Displacement map resolution. */
    glassMapSize?: number;
    /** Optical content zoom inside the glass node. */
    glassMagnification?: number;
    /** Corner radius of the glass thumb node. */
    glassRadius?: number;
    /** Refreshes the SVG filter id as the lens changes, matching the slider workaround. */
    glassSafariRefresh?: boolean;
    /** Horizontal displacement strength for the glass node. */
    glassScaleX?: number;
    /** Vertical displacement strength for the glass node. */
    glassScaleY?: number;
    /** Edge deformation/splay for the generated displacement map. */
    glassSplay?: number;
    /** Text rendered beside the switch. */
    label?: ReactNode;
    /** Native change handler for the underlying checkbox input. */
    onChange?: ChangeEventHandler<HTMLInputElement>;
    /** Boolean checked callback for controlled or uncontrolled usage. */
    onCheckedChange?: (checked: boolean) => void;
    /** Width of the switch control. */
    switchWidth?: CSSProperties['width'];
    /** Glass tone applied to the thumb node. */
    thumbTone?: GlassSurfaceProps['tone'];
    /** Height of the switch track. */
    trackHeight?: number;
}

export function Switch({
    active,
    checked,
    className,
    controlHeight,
    defaultChecked = false,
    disabled = false,
    glassBlur = 0,
    glassChroma = 0,
    glassContentLock = 0.55,
    glassDebugLogs = false,
    glassDepth = 3.5,
    glassDome = 0,
    glassEdge = 0,
    glassGlow = 0,
    glassLensH = DEFAULT_LENS_HEIGHT,
    glassLensW = DEFAULT_LENS_WIDTH,
    glassMapSize = 512,
    glassMagnification = 1,
    glassRadius = DEFAULT_LENS_RADIUS,
    glassSafariRefresh = true,
    glassScaleX = 50,
    glassScaleY = 58,
    glassSplay = 0.49,
    id,
    label,
    onBlur,
    onChange,
    onCheckedChange,
    onKeyDown,
    onKeyUp,
    onLostPointerCapture,
    onPointerCancel,
    onPointerDown,
    onPointerUp,
    style,
    switchWidth = DEFAULT_SWITCH_WIDTH,
    thumbTone = 'clear',
    trackHeight = DEFAULT_TRACK_HEIGHT,
    ...props
}: SwitchProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const labelId = label ? `${inputId}-label` : undefined;
    const filterIdBase = `gds-glass-switch-filter-${sanitizeId(generatedId)}`;
    const controlRef = useRef<HTMLButtonElement>(null);
    const dragStartXRef = useRef(0);
    const hasDraggedRef = useRef(false);
    const isPointerActiveRef = useRef(false);
    const releaseTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
    const isControlled = checked !== undefined;
    const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
    const [controlSize, setControlSize] = useState({ height: 0, width: 0 });
    const [isPressed, setIsPressed] = useState(false);
    const [dragRatio, setDragRatio] = useState<number | null>(null);
    const isActive = isPressed || active === true;
    const currentChecked = isControlled ? checked : uncontrolledChecked;
    const checkedRatio = currentChecked ? 1 : 0;
    const visualRatio = dragRatio ?? checkedRatio;
    const visualColorOpacity = visualRatio;
    const resolvedControlHeight = controlHeight ?? Math.max(DEFAULT_CONTROL_HEIGHT, glassLensH);
    const isGlassReady = !disabled && isActive && controlSize.width > 0 && controlSize.height > 0;
    const classes = [
        'gds-switch',
        currentChecked ? 'gds-switch--checked' : '',
        isActive ? 'gds-switch--pressed' : '',
        dragRatio !== null ? 'gds-switch--dragging' : '',
        disabled ? 'gds-switch--disabled' : '',
        label ? 'gds-switch--with-label' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');
    const lensGeometry = useMemo(() => {
        const availableWidth = Math.max(0, controlSize.width - END_PADDING_X * 2);
        const travel = Math.max(0, availableWidth - glassLensW);
        const lensX = END_PADDING_X + travel * visualRatio;
        const lensY = Math.max(0, (controlSize.height - glassLensH) / 2);

        return {
            lensTravelCenterX: END_PADDING_X + travel / 2,
            lensX,
            lensY,
        };
    }, [controlSize.height, controlSize.width, glassLensH, glassLensW, visualRatio]);
    const activeLensWidth = isActive ? glassLensW * ACTIVE_LENS_SCALE : glassLensW;
    const activeLensHeight = isActive ? glassLensH * ACTIVE_LENS_SCALE : glassLensH;
    const filterVersion = [
        Math.round(controlSize.width),
        Math.round(controlSize.height),
        Math.round(activeLensWidth),
        Math.round(activeLensHeight),
        glassRadius,
        glassMapSize,
        Math.round(glassMagnification * 100),
        Math.round(glassSplay * 1000),
        Math.round(glassChroma * 1000),
        Math.round(glassDepth * 100),
        Math.round(glassDome * 100),
        Math.round(glassEdge * 1000),
        Math.round(glassGlow * 1000),
        Math.round(glassBlur * 100),
        Math.round(glassScaleX * 100),
        Math.round(glassScaleY * 100),
    ].join('-');
    const filterId = glassSafariRefresh ? `${filterIdBase}-${filterVersion}` : filterIdBase;
    const contentLock = clamp(glassContentLock, 0, 1);
    const lensSourceX =
        lensGeometry.lensTravelCenterX + (lensGeometry.lensX - lensGeometry.lensTravelCenterX) * contentLock;
    const filterBleed = Math.ceil(Math.max(glassScaleX, glassScaleY) * (1 + 0.2 * glassChroma) + glassBlur + 4);
    const filterWidth = controlSize.width + filterBleed * 2;
    const filterHeight = controlSize.height + filterBleed * 2;
    const activeLensOffsetX = (activeLensWidth - glassLensW) / 2;
    const activeLensOffsetY = (activeLensHeight - glassLensH) / 2;
    const renderedLensX = lensGeometry.lensX - activeLensOffsetX;
    const renderedLensY = lensGeometry.lensY - activeLensOffsetY;
    const lensFilterX = lensSourceX - activeLensOffsetX + filterBleed;
    const lensFilterY = lensGeometry.lensY - activeLensOffsetY + filterBleed;
    const lensContentTransform = `translate3d(${-lensFilterX}px, ${-lensFilterY}px, 0)`;

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

    useEffect(
        () => () => {
            if (releaseTimerRef.current) {
                window.clearTimeout(releaseTimerRef.current);
            }
        },
        [],
    );

    useEffect(() => {
        if (import.meta.env.PROD || !glassDebugLogs) return;

        console.info('[glass-switch]', {
            checked: currentChecked,
            active: isActive,
            controlHeight: resolvedControlHeight,
            glassBlur,
            glassChroma,
            glassContentLock,
            glassDepth,
            glassDome,
            glassEdge,
            glassGlow,
            glassLensH,
            glassLensW,
            glassMapSize,
            glassMagnification,
            glassRadius,
            glassSafariRefresh,
            glassScaleX,
            glassScaleY,
            glassSplay,
            switchWidth,
            trackHeight,
        });
    }, [
        isActive,
        currentChecked,
        glassBlur,
        glassChroma,
        glassContentLock,
        glassDebugLogs,
        glassDepth,
        glassDome,
        glassEdge,
        glassGlow,
        activeLensHeight,
        activeLensWidth,
        glassLensH,
        glassLensW,
        glassMapSize,
        glassMagnification,
        glassRadius,
        glassSafariRefresh,
        glassScaleX,
        glassScaleY,
        glassSplay,
        resolvedControlHeight,
        switchWidth,
        trackHeight,
    ]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextChecked = event.currentTarget.checked;

        if (!isControlled) {
            setUncontrolledChecked(nextChecked);
        }

        onCheckedChange?.(nextChecked);
        onChange?.(event);
    };

    const applyChecked = (nextChecked: boolean) => {
        if (nextChecked === currentChecked) return;

        if (!isControlled) {
            setUncontrolledChecked(nextChecked);
        }

        onCheckedChange?.(nextChecked);
    };

    const holdActiveState = () => {
        setIsPressed(true);

        if (releaseTimerRef.current) {
            window.clearTimeout(releaseTimerRef.current);
        }

        releaseTimerRef.current = window.setTimeout(() => {
            setIsPressed(false);
            releaseTimerRef.current = null;
        }, ACTIVE_RELEASE_MS);
    };

    const getPointerRatio = (clientX: number) => {
        const control = controlRef.current;
        if (!control) return checkedRatio;

        const rect = control.getBoundingClientRect();
        const availableWidth = Math.max(0, rect.width - END_PADDING_X * 2);
        const travel = Math.max(1, availableWidth - glassLensW);

        return clamp((clientX - rect.left - END_PADDING_X - glassLensW / 2) / travel, 0, 1);
    };

    const handleControlClick: MouseEventHandler<HTMLButtonElement> = event => {
        if (event.detail > 0 && hasDraggedRef.current) {
            event.preventDefault();
            hasDraggedRef.current = false;
            return;
        }

        holdActiveState();
        applyChecked(!currentChecked);
    };

    const handlePointerDown: PointerEventHandler<HTMLButtonElement> = event => {
        if (disabled) return;

        if (releaseTimerRef.current) {
            window.clearTimeout(releaseTimerRef.current);
            releaseTimerRef.current = null;
        }

        dragStartXRef.current = event.clientX;
        hasDraggedRef.current = false;
        isPointerActiveRef.current = true;
        setIsPressed(true);
        setDragRatio(null);

        if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.setPointerCapture(event.pointerId);
        }

        onPointerDown?.(event as unknown as Parameters<NonNullable<typeof onPointerDown>>[0]);
    };

    const handlePointerMove: PointerEventHandler<HTMLButtonElement> = event => {
        if (!isPointerActiveRef.current || disabled) return;

        event.preventDefault();

        const dragDistance = Math.abs(event.clientX - dragStartXRef.current);
        if (dragDistance >= DRAG_THRESHOLD_PX) {
            hasDraggedRef.current = true;
            setDragRatio(getPointerRatio(event.clientX));
        }
    };

    const handlePointerUp: PointerEventHandler<HTMLButtonElement> = event => {
        const nextRatio = getPointerRatio(event.clientX);
        const dragDistance = Math.abs(event.clientX - dragStartXRef.current);
        const isDragGesture = hasDraggedRef.current || dragDistance >= DRAG_THRESHOLD_PX;

        isPointerActiveRef.current = false;
        setDragRatio(null);

        if (isDragGesture) {
            event.preventDefault();
            hasDraggedRef.current = true;
            applyChecked(nextRatio >= 0.5);
        }

        holdActiveState();

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        onPointerUp?.(event as unknown as Parameters<NonNullable<typeof onPointerUp>>[0]);
    };

    const handlePointerCancel: PointerEventHandler<HTMLButtonElement> = event => {
        isPointerActiveRef.current = false;
        setIsPressed(false);
        setDragRatio(null);
        onPointerCancel?.(event as unknown as Parameters<NonNullable<typeof onPointerCancel>>[0]);
    };

    const handleLostPointerCapture: PointerEventHandler<HTMLButtonElement> = event => {
        isPointerActiveRef.current = false;

        if (!releaseTimerRef.current) {
            setIsPressed(false);
            setDragRatio(null);
        }

        onLostPointerCapture?.(event as unknown as Parameters<NonNullable<typeof onLostPointerCapture>>[0]);
    };

    const handleKeyDown: KeyboardEventHandler<HTMLButtonElement> = event => {
        if (!disabled && event.key === ' ') {
            setIsPressed(true);
        }

        onKeyDown?.(event as unknown as Parameters<NonNullable<typeof onKeyDown>>[0]);
    };

    const handleKeyUp: KeyboardEventHandler<HTMLButtonElement> = event => {
        if (event.key === ' ') {
            setIsPressed(false);
        }

        onKeyUp?.(event as unknown as Parameters<NonNullable<typeof onKeyUp>>[0]);
    };

    const handleBlur: InputHTMLAttributes<HTMLInputElement>['onBlur'] = event => {
        setIsPressed(false);
        setDragRatio(null);
        onBlur?.(event);
    };

    return (
        <span
            className={classes}
            style={
                {
                    '--gds-switch-hit-area': `${resolvedControlHeight}px`,
                    '--gds-switch-lens-height': `${activeLensHeight}px`,
                    '--gds-switch-lens-left': `${renderedLensX}px`,
                    '--gds-switch-lens-radius': `${glassRadius}px`,
                    '--gds-switch-lens-top': `${renderedLensY}px`,
                    '--gds-switch-lens-width': `${activeLensWidth}px`,
                    '--gds-switch-color-opacity': visualColorOpacity,
                    '--gds-switch-track-height': `${trackHeight}px`,
                    '--gds-switch-width': typeof switchWidth === 'number' ? `${switchWidth}px` : switchWidth,
                    ...style,
                } as CSSProperties
            }
        >
            <button
                aria-checked={currentChecked}
                aria-label={label ? undefined : props['aria-label']}
                aria-labelledby={labelId}
                className="gds-switch__control"
                disabled={disabled}
                onBlur={() => {
                    isPointerActiveRef.current = false;
                    setIsPressed(false);
                    setDragRatio(null);
                }}
                onClick={handleControlClick}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                onLostPointerCapture={handleLostPointerCapture}
                onPointerCancel={handlePointerCancel}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                ref={controlRef}
                role="switch"
                type="button"
            >
                {isGlassReady && (
                    <GlassFilter
                        blur={glassBlur}
                        chroma={glassChroma}
                        depth={glassDepth}
                        dome={glassDome}
                        edge={glassEdge}
                        filterId={filterId}
                        glow={glassGlow}
                        height={filterHeight}
                        lensHeight={activeLensHeight}
                        lensRadius={glassRadius}
                        lensWidth={activeLensWidth}
                        lensX={lensFilterX}
                        lensY={lensFilterY}
                        magnification={glassMagnification}
                        mapSize={glassMapSize}
                        scaleX={glassScaleX}
                        scaleY={glassScaleY}
                        splay={glassSplay}
                        width={filterWidth}
                    />
                )}
                <span aria-hidden="true" className="gds-switch__rail">
                    <SwitchVisual inert />
                    <span className="gds-switch__lens">
                        {isGlassReady ? (
                            <>
                                <span
                                    className="gds-switch__lens-content"
                                    style={
                                        {
                                            '--gds-switch-lens-filter': `url(#${filterId})`,
                                            height: filterHeight,
                                            transform: lensContentTransform,
                                            width: filterWidth,
                                        } as CSSProperties
                                    }
                                >
                                    <span
                                        className="gds-switch__lens-source"
                                        style={{
                                            height: controlSize.height,
                                            transform: `translate3d(${filterBleed}px, ${filterBleed}px, 0)`,
                                            width: controlSize.width,
                                        }}
                                    >
                                        <span className="gds-switch__lens-source-bg" />
                                        <SwitchVisual inert source />
                                    </span>
                                </span>
                                <GlassSurface
                                    blur="default"
                                    className="gds-switch__lens-glass"
                                    elevated
                                    shape="pill"
                                    style={{ borderRadius: glassRadius }}
                                    tone={thumbTone}
                                />
                            </>
                        ) : (
                            <span className="gds-switch__thumb" />
                        )}
                    </span>
                </span>
            </button>
            <input
                {...props}
                aria-hidden="true"
                checked={currentChecked}
                className="gds-switch__input"
                disabled={disabled}
                id={inputId}
                onBlur={handleBlur}
                onChange={handleChange}
                tabIndex={-1}
                type="checkbox"
            />
            {label && (
                <span className="gds-switch__label" id={labelId}>
                    {label}
                </span>
            )}
        </span>
    );
}
