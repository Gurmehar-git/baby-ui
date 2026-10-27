"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import {
	type ComponentProps,
	type CSSProperties,
	createContext,
	type ReactNode,
	useContext,
	useRef,
	useState,
} from "react";
import { cn } from "../../lib/cn";
import { Spinner } from "../../spinner/react/spinner";
import {
	type SlideToUnlockSize,
	type SlideToUnlockVariant,
	slideToUnlock,
} from "../variants";

export type { SlideToUnlockSize, SlideToUnlockVariant };

type SlideContext = {
	value: number;
	variant: SlideToUnlockVariant;
	size: SlideToUnlockSize;
	label: string;
	loading: boolean;
};
const SlideCtx = createContext<SlideContext | null>(null);

function useSlide(part: string) {
	const context = useContext(SlideCtx);
	if (!context) throw new Error(`${part} must be used inside <SlideToUnlock>`);
	return context;
}

export interface SlideToUnlockProps
	extends Omit<
		ComponentProps<typeof SliderPrimitive.Root>,
		"value" | "defaultValue" | "onValueChange" | "onValueCommitted" | "children"
	> {
	children: ReactNode;
	label: string;
	value?: number;
	defaultValue?: number;
	onValueChange?: (value: number) => void;
	onComplete?: () => void;
	threshold?: number;
	variant?: SlideToUnlockVariant;
	/** Outer height on the Button ladder; the handle and text scale with it. */
	size?: SlideToUnlockSize;
	/** Overrides the size's handle diameter, as pixels or a CSS length. */
	handleSize?: number | string;
	/** The caller's action is running: the handle shows a spinner and stops responding. */
	loading?: boolean;
}

export function SlideToUnlock({
	children,
	label,
	value: valueProp,
	defaultValue = 0,
	onValueChange,
	onComplete,
	threshold = 90,
	variant = "default",
	size = "xl",
	handleSize,
	loading = false,
	className,
	style,
	disabled,
	onKeyDown,
	onPointerDown,
	...props
}: SlideToUnlockProps) {
	const [ownValue, setOwnValue] = useState(defaultValue);
	// Keyboard steps commit one at a time, so only a released drag springs back below the threshold.
	const keyed = useRef(false);
	const value = Math.min(100, Math.max(0, valueProp ?? ownValue));
	const setValue = (next: number) => {
		if (valueProp === undefined) setOwnValue(next);
		onValueChange?.(next);
	};
	const s = slideToUnlock({ variant, size });
	const handle = typeof handleSize === "number" ? `${handleSize}px` : handleSize;
	return (
		<SlideCtx.Provider value={{ value, variant, size, label, loading }}>
			<SliderPrimitive.Root
				data-slot="slide-to-unlock"
				data-loading={loading || undefined}
				aria-busy={loading || undefined}
				value={[value]}
				min={0}
				max={100}
				step={1}
				disabled={disabled || loading}
				onKeyDown={(event) => {
					keyed.current = true;
					onKeyDown?.(event);
				}}
				onPointerDown={(event) => {
					keyed.current = false;
					onPointerDown?.(event);
				}}
				onValueChange={(next) => setValue(next[0] ?? 0)}
				onValueCommitted={(next) => {
					const committed = next[0] ?? 0;
					if (committed >= threshold) {
						setValue(100);
						onComplete?.();
					} else if (!keyed.current) {
						setValue(0);
					}
				}}
				className={cn(s.root(), className)}
				style={handle ? ({ "--slide-handle": handle, ...style } as CSSProperties) : style}
				thumbAlignment="edge"
				{...props}
			>
				{children}
			</SliderPrimitive.Root>
		</SlideCtx.Provider>
	);
}

export function SlideToUnlockTrack({
	className,
	children,
	...props
}: ComponentProps<typeof SliderPrimitive.Control>) {
	const { variant, size } = useSlide("SlideToUnlockTrack");
	const s = slideToUnlock({ variant, size });
	return (
		<SliderPrimitive.Control
			data-slot="slide-to-unlock-track"
			className={cn(s.control(), className)}
			{...props}
		>
			<SliderPrimitive.Track aria-hidden className={s.track()}>
				<SliderPrimitive.Indicator className={s.range()} />
			</SliderPrimitive.Track>
			{children}
		</SliderPrimitive.Control>
	);
}

export function SlideToUnlockText({
	className,
	style,
	...props
}: ComponentProps<"span">) {
	const { value, variant, size } = useSlide("SlideToUnlockText");
	return (
		<span
			data-slot="slide-to-unlock-text"
			className={cn(slideToUnlock({ variant, size }).text(), className)}
			style={{ opacity: Math.max(0, 1 - value / 45), ...style }}
			{...props}
		/>
	);
}

export function SlideToUnlockHandle({
	className,
	children,
	...props
}: ComponentProps<typeof SliderPrimitive.Thumb>) {
	const { variant, size, label, loading } = useSlide("SlideToUnlockHandle");
	return (
		<SliderPrimitive.Thumb
			index={0}
			aria-label={props["aria-label"] ?? label}
			data-slot="slide-to-unlock-handle"
			className={cn(slideToUnlock({ variant, size }).thumb(), className)}
			{...props}
		>
			{loading ? (
				<Spinner label={`${label}, in progress`} />
			) : (
				(children ?? (
					<svg viewBox="0 0 20 20" fill="none" aria-hidden>
						<path
							d="m7 4 6 6-6 6M3 4l6 6-6 6"
							stroke="currentColor"
							strokeWidth="1.7"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				))
			)}
		</SliderPrimitive.Thumb>
	);
}
