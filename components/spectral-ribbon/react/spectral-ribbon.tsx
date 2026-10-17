"use client";

import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { useCanvasEngine } from "../../lib/react/use-canvas-engine";
import { mountSpectralRibbon, type SpectralRibbonOptions } from "../ribbon";
import {
	SPECTRAL_RIBBON_COLORS,
	SPECTRAL_RIBBON_SPEED,
	type SpectralRibbonPosition,
	type SpectralRibbonSpeed,
	type SpectralRibbonTone,
	spectralRibbon,
} from "../variants";

export type { SpectralRibbonPosition, SpectralRibbonSpeed, SpectralRibbonTone };

export interface SpectralRibbonProps {
	tone?: SpectralRibbonTone;
	speed?: SpectralRibbonSpeed;
	position?: SpectralRibbonPosition;
	/** Ribbon brightness, 0.25 to 2. */
	intensity?: number;
	/** Ribbon thickness, 0.5 to 2. */
	thickness?: number;
	/** Film grain, 0 to 1. */
	grain?: number;
	className?: string;
	children?: ReactNode;
}

/** A soft light trail with a prismatic fringe, drawn in WebGL from theme tokens. */
export function SpectralRibbon({
	tone = "spectrum",
	speed = "normal",
	position = "absolute",
	intensity = 1,
	thickness = 1,
	grain = 0.45,
	className,
	children,
}: SpectralRibbonProps) {
	const options: SpectralRibbonOptions = {
		colors: SPECTRAL_RIBBON_COLORS[tone],
		speed: SPECTRAL_RIBBON_SPEED[speed],
		intensity,
		thickness,
		grain,
	};
	const { root, canvas, webgl } = useCanvasEngine(mountSpectralRibbon, options, [
		tone,
		speed,
		intensity,
		thickness,
		grain,
	]);
	const s = spectralRibbon({ tone, speed, position, webgl });

	return (
		<div ref={root} data-slot="spectral-ribbon" className={cn(s.root(), className)}>
			<div aria-hidden className={s.fallback()} />
			<canvas ref={canvas} aria-hidden className={s.canvas()} />
			{children ? <div className={s.content()}>{children}</div> : null}
		</div>
	);
}
