"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "../../lib/react/cn";
import { type DitherOptions, mountDither } from "./dither";
import {
	type DitherGradientMatrix,
	type DitherGradientPosition,
	type DitherGradientTone,
	ditherGradient,
} from "./variants";

export type { DitherGradientMatrix, DitherGradientPosition, DitherGradientTone };

export interface DitherGradientProps {
	tone?: DitherGradientTone;
	/** Bayer threshold matrix: larger means finer, less banded patterns. */
	matrix?: DitherGradientMatrix;
	/** `absolute` fills the nearest positioned parent; `fixed` fills the viewport. */
	position?: DitherGradientPosition;
	/** Gradient direction in degrees. */
	angle?: number;
	/** Drift speed multiplier; 0 holds a still frame. */
	speed?: number;
	/** Size of one dither cell, in CSS px. */
	pixelSize?: number;
	/** Rendered above the gradient. */
	children?: ReactNode;
	className?: string;
}

/** A full-bleed token-coloured gradient drawn with ordered Bayer dithering on a canvas. */
export function DitherGradient({
	tone = "spectrum",
	matrix = "bayer4",
	position,
	angle = 45,
	speed = 1,
	pixelSize = 3,
	children,
	className,
}: DitherGradientProps) {
	const root = useRef<HTMLDivElement>(null);
	const canvas = useRef<HTMLCanvasElement>(null);
	const engine = useRef<ReturnType<typeof mountDither>>(null);
	const s = ditherGradient({ tone, matrix, position });
	const options: DitherOptions = { tone, matrix, angle, speed, pixelSize };
	const latest = useRef(options);
	latest.current = options;

	useEffect(() => {
		if (!root.current || !canvas.current) return;
		engine.current = mountDither(root.current, canvas.current, latest.current);
		return () => engine.current?.destroy();
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: tone, matrix, angle and more.
	useEffect(() => {
		engine.current?.update(latest.current);
	}, [tone, matrix, angle, speed, pixelSize]);

	return (
		<div ref={root} data-slot="dither-gradient" className={cn(s.root(), className)}>
			<canvas ref={canvas} aria-hidden className={s.canvas()} />
			{children ? <div className={s.content()}>{children}</div> : null}
		</div>
	);
}
