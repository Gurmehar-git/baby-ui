"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "../../lib/cn";
import { mountPixels, type PixelOptions } from "../pixels";
import {
	type PixelCanvasPosition,
	type PixelCanvasTone,
	type PixelCanvasVariant,
	pixelCanvas,
} from "../variants";

export type { PixelCanvasPosition, PixelCanvasTone, PixelCanvasVariant };

export interface PixelCanvasProps {
	/** Square cells, rounded cells, or square cells with a soft halo. */
	variant?: PixelCanvasVariant;
	tone?: PixelCanvasTone;
	/** `absolute` fills the nearest positioned parent; `fixed` fills the viewport. */
	position?: PixelCanvasPosition;
	/** Cell pitch in CSS px, including the 1px gutter. */
	gap?: number;
	/** Fade rate per frame once the pointer moves on, 0 to 1. */
	decay?: number;
	/** Pointer influence radius, in px. */
	radius?: number;
	/** Rendered above the grid; the pointer still lights cells through it. */
	children?: ReactNode;
	className?: string;
}

/** A full-bleed pixel grid that lights up in token colours around the pointer and fades behind it. */
export function PixelCanvas({
	variant = "default",
	tone = "spectrum",
	position,
	gap = 8,
	decay = 0.04,
	radius = 90,
	children,
	className,
}: PixelCanvasProps) {
	const root = useRef<HTMLDivElement>(null);
	const canvas = useRef<HTMLCanvasElement>(null);
	const engine = useRef<ReturnType<typeof mountPixels>>(null);
	const s = pixelCanvas({ variant, tone, position });
	const options: PixelOptions = { variant, tone, gap, decay, radius };
	const latest = useRef(options);
	latest.current = options;

	useEffect(() => {
		if (!root.current || !canvas.current) return;
		engine.current = mountPixels(root.current, canvas.current, latest.current);
		return () => engine.current?.destroy();
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: variant, tone, gap and more.
	useEffect(() => {
		engine.current?.update(latest.current);
	}, [variant, tone, gap, decay, radius]);

	return (
		<div ref={root} data-slot="pixel-canvas" className={cn(s.root(), className)}>
			<canvas ref={canvas} aria-hidden className={s.canvas()} />
			{children ? <div className={s.content()}>{children}</div> : null}
		</div>
	);
}
