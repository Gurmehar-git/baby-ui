"use client";

import type { ReactNode } from "react";
import { cn } from "../../lib/react/cn";
import { useCanvasEngine } from "../../lib/react/use-canvas-engine";
import {
	CHROMATIC_WAVE_COLORS,
	CHROMATIC_WAVE_SPEED,
	type ChromaticWavePosition,
	type ChromaticWaveSpeed,
	type ChromaticWaveTone,
	chromaticWave,
} from "./variants";
import { type ChromaticWaveOptions, mountChromaticWave } from "./wave";

export type { ChromaticWavePosition, ChromaticWaveSpeed, ChromaticWaveTone };

export interface ChromaticWaveProps {
	tone?: ChromaticWaveTone;
	speed?: ChromaticWaveSpeed;
	position?: ChromaticWavePosition;
	/** Effect strength, 0 to 2. */
	intensity?: number;
	/** Film grain, 0 to 1. */
	grain?: number;
	className?: string;
	children?: ReactNode;
}

/** Dozens of fine flowing contour lines with a chromatic gradient along them, drawn in WebGL. */
export function ChromaticWave({
	tone = "spectrum",
	speed = "normal",
	position = "absolute",
	intensity = 1,
	grain = 0,
	className,
	children,
}: ChromaticWaveProps) {
	const options: ChromaticWaveOptions = {
		colors: CHROMATIC_WAVE_COLORS[tone],
		speed: CHROMATIC_WAVE_SPEED[speed],
		intensity,
		grain,
	};
	const { root, canvas, webgl } = useCanvasEngine(mountChromaticWave, options, [
		tone,
		speed,
		intensity,
		grain,
	]);
	const s = chromaticWave({ tone, speed, position, webgl });

	return (
		<div ref={root} data-slot="chromatic-wave" className={cn(s.root(), className)}>
			<div aria-hidden className={s.fallback()} />
			<canvas ref={canvas} aria-hidden className={s.canvas()} />
			{children ? <div className={s.content()}>{children}</div> : null}
		</div>
	);
}
