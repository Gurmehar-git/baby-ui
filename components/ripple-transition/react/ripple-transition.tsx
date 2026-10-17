"use client";

import {
	type AnimationEvent,
	type CSSProperties,
	type KeyboardEvent,
	type MouseEvent,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { cn } from "../../lib/cn";
import {
	layerState,
	placeRipple,
	type RipplePoint,
	type RippleTransitionImage,
	wrapIndex,
} from "../ripple";
import {
	RIPPLE_TRANSITION_RING_COUNT,
	type RippleTransitionRadius,
	type RippleTransitionRings,
	rippleTransition,
} from "../variants";

export type { RippleTransitionImage, RippleTransitionRadius, RippleTransitionRings };

export interface RippleTransitionProps {
	/** Images in order; clicking advances to the next one. */
	images: readonly RippleTransitionImage[];
	/** Controlled index of the current image. */
	value?: number;
	defaultValue?: number;
	onValueChange?: (value: number) => void;
	/** Reveal length in ms. */
	duration?: number;
	rings?: RippleTransitionRings;
	radius?: RippleTransitionRadius;
	/** Accessible name of the advance button. */
	label?: string;
	className?: string;
}

/** An image stack where the next image ripples open from the click point. */
export function RippleTransition({
	images,
	value: valueProp,
	defaultValue = 0,
	onValueChange,
	duration = 1200,
	rings = "single",
	radius = "xl",
	label = "Show next image",
	className,
}: RippleTransitionProps) {
	const root = useRef<HTMLDivElement>(null);
	const pending = useRef<RipplePoint | null>(null);
	const [internal, setInternal] = useState(defaultValue);
	const count = images.length;
	const value = wrapIndex(valueProp ?? internal, count);
	const [shown, setShown] = useState(value);
	const [reduced, setReduced] = useState(false);
	const moving = value !== shown && !reduced;
	const s = rippleTransition({ rings, radius });

	useEffect(() => {
		const query = matchMedia("(prefers-reduced-motion: reduce)");
		const sync = () => setReduced(query.matches);
		sync();
		query.addEventListener("change", sync);
		return () => query.removeEventListener("change", sync);
	}, []);

	useEffect(() => {
		if (reduced) setShown(value);
	}, [reduced, value]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: value, shown.
	useLayoutEffect(() => {
		if (!moving || !root.current) return;
		placeRipple(root.current, pending.current);
		pending.current = null;
	}, [moving, value, shown]);

	const go = (step: number, point: RipplePoint | null) => {
		if (count < 2 || moving) return;
		const next = wrapIndex(value + step, count);
		pending.current = point;
		setInternal(next);
		onValueChange?.(next);
	};

	const onClick = (e: MouseEvent<HTMLButtonElement>) => {
		if (e.detail === 0) return go(1, null);
		const box = e.currentTarget.getBoundingClientRect();
		go(1, { x: e.clientX - box.left, y: e.clientY - box.top });
	};

	const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
		if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
		e.preventDefault();
		go(e.key === "ArrowRight" ? 1 : -1, null);
	};

	const onEnd = (e: AnimationEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) setShown(value);
	};

	return (
		<div
			ref={root}
			data-slot="ripple-transition"
			className={cn(s.root(), className)}
			style={{ "--rt-duration": `${duration}ms` } as CSSProperties}
		>
			{images.map((image, i) => {
				const state = layerState(i, value, shown, moving);
				return (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
						key={`${i}-${image.src}`}
						aria-hidden={i === value ? undefined : true}
						className={s.layer({ state })}
						onAnimationEnd={state === "enter" ? onEnd : undefined}
					>
						<img
							src={image.src}
							alt={image.alt}
							draggable={false}
							className={s.image()}
						/>
					</div>
				);
			})}
			{moving ? (
				<div key={`${shown}-${value}`} aria-hidden className={s.rings()}>
					{Array.from({ length: RIPPLE_TRANSITION_RING_COUNT[rings] }, (_, i) => (
						<span
							// biome-ignore lint/suspicious/noArrayIndexKey: generated from a count, so position is the identity.
							key={i}
							className={s.ring()}
							style={{ animationDelay: `${Math.round(i * duration * 0.08)}ms` }}
						/>
					))}
				</div>
			) : null}
			<button
				type="button"
				aria-label={label}
				className={s.trigger()}
				onClick={onClick}
				onKeyDown={onKeyDown}
			/>
			<span className="sr-only" aria-live="polite">
				{images[value]?.alt}
			</span>
		</div>
	);
}
