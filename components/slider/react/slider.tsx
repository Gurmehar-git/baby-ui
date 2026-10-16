"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import {
	type ComponentProps,
	type CSSProperties,
	type PointerEvent,
	useEffect,
	useRef,
	useState,
} from "react";
import { cn } from "../../lib/react/cn";
import {
	sliderInlineSplit,
	sliderLayout,
	sliderRulerOffset,
	sliderRulerTicks,
	sliderRulerValueAt,
	sliderThumbCenter,
	sliderWaveBars,
} from "./core";
import { attachElastic } from "./elastic";
import {
	type SliderMark,
	type SliderSize,
	type SliderVariant,
	slider,
	sliderPercent,
} from "./variants";

export type { SliderMark, SliderSize, SliderVariant };

export interface SliderProps
	extends Omit<
		ComponentProps<typeof SliderPrimitive.Root>,
		"value" | "defaultValue" | "onValueChange" | "onValueCommitted" | "orientation"
	> {
	/** Controlled value; an array renders one thumb per entry. */
	value?: number | number[];
	defaultValue?: number | number[];
	onValueChange?: (value: number | number[]) => void;
	/** Fires once a drag or key press settles. */
	onValueCommit?: (value: number | number[]) => void;
	/** Accessible name; also the header title when `showValue` is on. */
	label?: string;
	/** `default`, `track` and `bubble` go vertical; the other variants render horizontal. */
	orientation?: "horizontal" | "vertical";
	/** `inline`, `fluid`, `wave` and `ruler` are single-thumb; a range falls back to `track`. */
	variant?: SliderVariant;
	size?: SliderSize;
	/** Header with the label and the live value. */
	showValue?: boolean;
	formatValue?: (value: number) => string;
	/** Ticks under the track; clicking one jumps there. */
	marks?: SliderMark[];
	/** Dragging past either end stretches the track like elastic, then it springs back. */
	elastic?: boolean;
}

const THUMB_WIDTH = 20;

export function Slider({
	className,
	value: valueProp,
	defaultValue,
	min = 0,
	max = 100,
	step = 1,
	orientation: orientationProp = "horizontal",
	label,
	variant: variantProp = "default",
	size = "default",
	showValue = false,
	formatValue = (v) => String(v),
	marks = [],
	elastic = false,
	onValueChange,
	onValueCommit,
	disabled,
	...props
}: SliderProps) {
	const [internal, setInternal] = useState<number | number[]>(defaultValue ?? min);
	const value = valueProp ?? internal;
	const isRange = Array.isArray(value);
	const values = isRange ? value : [value];
	const { variant, orientation } = sliderLayout(variantProp, orientationProp, isRange);
	const styles = slider({ variant, size });
	const first = values[0] ?? min;
	const percent = sliderPercent(first, min, max);

	const emit = (next: number[]) => {
		const out = isRange ? next : (next[0] ?? min);
		if (valueProp === undefined) setInternal(out);
		onValueChange?.(out);
	};
	const jumpTo = (target: number) => {
		if (!isRange) return emit([target]);
		const nearest = values.reduce(
			(best, v, i) =>
				Math.abs(v - target) < Math.abs((values[best] ?? 0) - target) ? i : best,
			0,
		);
		emit(values.map((v, i) => (i === nearest ? target : v)));
	};

	// Base UI marks dragging on the DOM only; the wave crest needs it in render.
	const [dragging, setDragging] = useState(false);
	useEffect(() => {
		if (!dragging) return;
		const stop = () => setDragging(false);
		window.addEventListener("pointerup", stop);
		window.addEventListener("pointercancel", stop);
		return () => {
			window.removeEventListener("pointerup", stop);
			window.removeEventListener("pointercancel", stop);
		};
	}, [dragging]);

	// Inline: the handle parts where it crosses the label or the value.
	const controlRef = useRef<HTMLDivElement>(null);
	const labelRef = useRef<HTMLSpanElement>(null);
	const valueRef = useRef<HTMLSpanElement>(null);
	const [boxes, setBoxes] = useState({ width: 0, label: [0, 0], value: [0, 0] });
	useEffect(() => {
		const control = controlRef.current;
		if (!elastic || !control) return;
		return attachElastic(control, () => control.dataset.orientation === "vertical");
	}, [elastic]);
	useEffect(() => {
		if (variant !== "inline") return;
		const control = controlRef.current;
		if (!control) return;
		const measure = () => {
			const origin = control.getBoundingClientRect().left;
			const span = (el: HTMLElement | null) => {
				const r = el?.getBoundingClientRect();
				return r ? [r.left - origin, r.right - origin] : [0, 0];
			};
			setBoxes({
				width: control.offsetWidth,
				label: span(labelRef.current),
				value: span(valueRef.current),
			});
		};
		measure();
		const observer = new ResizeObserver(measure);
		for (const el of [control, labelRef.current, valueRef.current])
			if (el) observer.observe(el);
		return () => observer.disconnect();
	}, [variant]);
	const split =
		variant === "inline" && boxes.width
			? sliderInlineSplit(sliderThumbCenter(percent, boxes.width, THUMB_WIDTH), [
					{ start: boxes.label[0] ?? 0, end: boxes.label[1] ?? 0 },
					{ start: boxes.value[0] ?? 0, end: boxes.value[1] ?? 0 },
				])
			: 0;

	// Ruler: the strip follows the pointer in px; the value snaps to the nearest step.
	const drag = useRef<{ id: number; x: number; offset: number } | null>(null);
	const [stripOffset, setStripOffset] = useState<number | null>(null);
	const onRulerDown = (event: PointerEvent<HTMLDivElement>) => {
		if (disabled || event.button !== 0) return;
		event.currentTarget.setPointerCapture(event.pointerId);
		drag.current = {
			id: event.pointerId,
			x: event.clientX,
			offset: sliderRulerOffset(first, min, step),
		};
		event.currentTarget.parentElement
			?.querySelector<HTMLElement>("input")
			?.focus({ preventScroll: true });
	};
	const onRulerMove = (event: PointerEvent<HTMLDivElement>) => {
		const active = drag.current;
		if (!active || active.id !== event.pointerId) return;
		const lowest = sliderRulerOffset(max, min, step);
		const offset = Math.min(
			0,
			Math.max(lowest, active.offset + event.clientX - active.x),
		);
		setStripOffset(offset);
		const next = sliderRulerValueAt(offset, min, max, step);
		if (next !== first) emit([next]);
	};
	const onRulerUp = (event: PointerEvent<HTMLDivElement>) => {
		if (drag.current?.id !== event.pointerId) return;
		drag.current = null;
		setStripOffset(null);
		onValueCommit?.(first);
	};

	const overlayText = (
		<>
			<span ref={labelRef} className={styles.inlineLabel()}>
				{label}
			</span>
			<span ref={valueRef} className={styles.inlineValue()}>
				{formatValue(first)}
			</span>
		</>
	);

	return (
		<SliderPrimitive.Root
			data-slot="slider"
			data-variant={variant}
			value={values}
			min={min}
			max={max}
			step={step}
			orientation={orientation}
			disabled={disabled}
			thumbAlignment="edge"
			onValueChange={(next) => emit(next as number[])}
			onValueCommitted={(next) => {
				const list = next as number[];
				onValueCommit?.(isRange ? list : (list[0] ?? min));
			}}
			className={cn(styles.root(), className)}
			{...props}
		>
			{showValue && variant !== "inline" && variant !== "fluid" && variant !== "ruler" ? (
				<div className={styles.header()}>
					<span className={styles.title()}>{label}</span>
					<span className={styles.value()}>{values.map(formatValue).join(" - ")}</span>
				</div>
			) : null}
			{variant === "ruler" ? (
				<div
					aria-hidden="true"
					className={styles.ruler()}
					onPointerDown={onRulerDown}
					onPointerMove={onRulerMove}
					onPointerUp={onRulerUp}
					onPointerCancel={onRulerUp}
				>
					<div className={styles.rulerReadout()}>{formatValue(first)}</div>
					<div className={styles.rulerWindow()}>
						<div
							data-settling={stripOffset === null || undefined}
							className={styles.rulerStrip()}
							style={{
								transform: `translateX(${stripOffset ?? sliderRulerOffset(first, min, step)}px)`,
							}}
						>
							{sliderRulerTicks(min, max, step).map((tick) => (
								<span
									key={tick.value}
									className={styles.rulerTick()}
									style={{ left: tick.offset }}
								>
									<span
										data-major={tick.major || undefined}
										className={styles.rulerTickLine()}
									/>
									{tick.major ? (
										<span className={styles.rulerTickLabel()}>{tick.value}</span>
									) : null}
								</span>
							))}
						</div>
						<span className={styles.rulerNeedle()} />
					</div>
				</div>
			) : null}
			<SliderPrimitive.Control
				ref={controlRef}
				className={styles.control()}
				onPointerDown={() => setDragging(true)}
			>
				{variant === "fluid" ? (
					<div aria-hidden="true" className={styles.overlay()}>
						{overlayText}
					</div>
				) : null}
				<SliderPrimitive.Track data-slot="slider-track" className={styles.track()}>
					<SliderPrimitive.Indicator data-slot="slider-range" className={styles.range()}>
						{variant === "fluid" ? (
							<span aria-hidden="true" className={styles.fillText()}>
								<span className={styles.inlineLabel()}>{label}</span>
								<span className={styles.inlineValue()}>{formatValue(first)}</span>
							</span>
						) : null}
					</SliderPrimitive.Indicator>
				</SliderPrimitive.Track>
				{variant === "inline" ? (
					<div aria-hidden="true" className={styles.overlay()}>
						{overlayText}
					</div>
				) : null}
				{variant === "wave" ? (
					<div aria-hidden="true" className={styles.overlay()}>
						{sliderWaveBars(percent, dragging).map((bar, i) => (
							<span
								// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
								key={i}
								data-filled={bar.filled || undefined}
								className={styles.bar()}
								style={
									{
										"--bar-scale": bar.scale,
										transitionDelay: `${bar.delayMs}ms`,
									} as CSSProperties
								}
							/>
						))}
					</div>
				) : null}
				{values.map((v, index) => (
					<SliderPrimitive.Thumb
						// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
						key={index}
						index={index}
						getAriaLabel={label ? () => label : undefined}
						getAriaValueText={(formatted, raw) =>
							formatValue ? formatValue(raw) : formatted
						}
						data-slot="slider-thumb"
						className={styles.thumb()}
						style={
							variant === "inline"
								? ({ "--slider-split": split } as CSSProperties)
								: undefined
						}
					>
						{variant === "bubble" ? (
							<span aria-hidden="true" className={styles.bubble()}>
								{formatValue(v)}
							</span>
						) : null}
					</SliderPrimitive.Thumb>
				))}
			</SliderPrimitive.Control>
			{marks.length > 0 && orientation === "horizontal" && variant !== "ruler" ? (
				<div className={styles.marks()}>
					{marks.map((mark) => (
						<span
							key={mark.value}
							className={styles.mark()}
							style={{ left: `${sliderPercent(mark.value, min, max)}%` }}
						>
							<span aria-hidden="true" className={styles.markDot()} />
							{mark.label ? (
								<button
									type="button"
									disabled={disabled}
									className={styles.markButton()}
									onClick={() => jumpTo(mark.value)}
								>
									{mark.label}
								</button>
							) : null}
						</span>
					))}
				</div>
			) : null}
		</SliderPrimitive.Root>
	);
}
