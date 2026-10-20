"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "../../lib/cn";
import { type ContourOptions, mountContours } from "../contours";
import {
	type TopographicLinesPosition,
	type TopographicLinesTone,
	type TopographicLinesVariant,
	topographicLines,
} from "../variants";

export type { TopographicLinesPosition, TopographicLinesTone, TopographicLinesVariant };

export interface TopographicLinesProps {
	/** Contour lines alone, or lines over soft banded elevation fills. */
	variant?: TopographicLinesVariant;
	/** Which theme tokens the lines take. */
	tone?: TopographicLinesTone;
	/** `absolute` fills the nearest positioned parent; `fixed` fills the viewport. */
	position?: TopographicLinesPosition;
	/** Contour lines across the full height range. */
	levels?: number;
	/** Every Nth line is an index contour, drawn heavier; 0 turns them off. */
	indexEvery?: number;
	/** Size of one hill, in CSS px. */
	scale?: number;
	/** Drift rate; 0 holds the map still. */
	speed?: number;
	/** Picks the terrain; the same seed always draws the same map. */
	seed?: number;
	/** Regular line width in CSS px; index contours draw at 1.8x. */
	lineWidth?: number;
	/** Rendered above the map. */
	children?: ReactNode;
	className?: string;
}

/** A slowly drifting contour map traced from a seeded height field. */
export function TopographicLines({
	variant = "lines",
	tone = "mono",
	position,
	levels = 14,
	indexEvery = 5,
	scale = 280,
	speed = 1,
	seed = 7,
	lineWidth = 1,
	children,
	className,
}: TopographicLinesProps) {
	const root = useRef<HTMLDivElement>(null);
	const canvas = useRef<HTMLCanvasElement>(null);
	const engine = useRef<ReturnType<typeof mountContours>>(null);
	const s = topographicLines({ variant, tone, position });
	const options: ContourOptions = {
		variant,
		tone,
		levels,
		indexEvery,
		scale,
		speed,
		seed,
		lineWidth,
	};
	const latest = useRef(options);
	latest.current = options;

	useEffect(() => {
		if (!root.current || !canvas.current) return;
		engine.current = mountContours(root.current, canvas.current, latest.current);
		return () => engine.current?.destroy();
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: the props are the triggers; values are read through the ref.
	useEffect(() => {
		engine.current?.update(latest.current);
	}, [variant, tone, levels, indexEvery, scale, speed, seed, lineWidth]);

	return (
		<div ref={root} data-slot="topographic-lines" className={cn(s.root(), className)}>
			<canvas ref={canvas} aria-hidden className={s.canvas()} />
			{children ? <div className={s.content()}>{children}</div> : null}
		</div>
	);
}
