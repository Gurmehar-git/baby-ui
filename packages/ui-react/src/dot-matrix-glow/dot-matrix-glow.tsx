"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "../lib/cn";
import { type DotOptions, mountDots } from "./dots";
import {
	DOT_MATRIX_SIZE,
	type DotMatrixGlowPosition,
	type DotMatrixGlowShape,
	type DotMatrixGlowSize,
	type DotMatrixGlowTone,
	dotMatrixGlow,
} from "./variants";

export type {
	DotMatrixGlowPosition,
	DotMatrixGlowShape,
	DotMatrixGlowSize,
	DotMatrixGlowTone,
};

export interface DotMatrixGlowProps {
	/** Round dots, squares, or plus marks. */
	shape?: DotMatrixGlowShape;
	/** Density preset: sets `gap` and `dotSize` unless you pass them. */
	size?: DotMatrixGlowSize;
	/** Which theme tokens the lit dots take. */
	tone?: DotMatrixGlowTone;
	/** `absolute` fills the nearest positioned parent; `fixed` fills the viewport. */
	position?: DotMatrixGlowPosition;
	/** Grid pitch in CSS px. */
	gap?: number;
	/** Resting dot radius in CSS px. */
	dotSize?: number;
	/** Pointer influence radius in CSS px. */
	glowRadius?: number;
	/** Pointer down sends a ring outward. */
	ripple?: boolean;
	/** Slow shimmer across the grid; keeps the loop running while visible. */
	ambient?: boolean;
	/** Rendered above the grid; the pointer still lights dots through it. */
	children?: ReactNode;
	className?: string;
}

/** A dot grid that brightens and swells near the pointer, and ripples outward on press. */
export function DotMatrixGlow({
	shape = "dot",
	size = "default",
	tone = "primary",
	position,
	gap,
	dotSize,
	glowRadius = 160,
	ripple = true,
	ambient = false,
	children,
	className,
}: DotMatrixGlowProps) {
	const root = useRef<HTMLDivElement>(null);
	const canvas = useRef<HTMLCanvasElement>(null);
	const engine = useRef<ReturnType<typeof mountDots>>(null);
	const s = dotMatrixGlow({ shape, size, tone, position });
	const options: DotOptions = {
		shape,
		tone,
		gap: gap ?? DOT_MATRIX_SIZE[size].gap,
		dotSize: dotSize ?? DOT_MATRIX_SIZE[size].dot,
		glowRadius,
		ripple,
		ambient,
	};
	const latest = useRef(options);
	latest.current = options;

	useEffect(() => {
		if (!root.current || !canvas.current) return;
		engine.current = mountDots(root.current, canvas.current, latest.current);
		return () => engine.current?.destroy();
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: shape, size, tone and more.
	useEffect(() => {
		engine.current?.update(latest.current);
	}, [shape, size, tone, gap, dotSize, glowRadius, ripple, ambient]);

	return (
		<div ref={root} data-slot="dot-matrix-glow" className={cn(s.root(), className)}>
			<canvas ref={canvas} aria-hidden className={s.canvas()} />
			{children ? <div className={s.content()}>{children}</div> : null}
		</div>
	);
}
