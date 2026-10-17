"use client";

import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { useCanvasEngine } from "../../lib/react/use-canvas-engine";
import { type ClosingPlasmaOptions, mountClosingPlasma } from "../plasma";
import {
	CLOSING_PLASMA_COLORS,
	CLOSING_PLASMA_SPEED,
	type ClosingPlasmaPosition,
	type ClosingPlasmaSpeed,
	type ClosingPlasmaTone,
	closingPlasma,
} from "../variants";

export type { ClosingPlasmaPosition, ClosingPlasmaSpeed, ClosingPlasmaTone };

export interface ClosingPlasmaProps {
	tone?: ClosingPlasmaTone;
	speed?: ClosingPlasmaSpeed;
	position?: ClosingPlasmaPosition;
	/** Noise frequency growth per octave, 0 to 2. */
	turbulence?: number;
	/** Sparkle strength, 0 to 2. */
	sparkle?: number;
	/** Film grain, 0 to 2. */
	grain?: number;
	/** The field leans toward the pointer. */
	interactive?: boolean;
	className?: string;
	children?: ReactNode;
}

/** A ridged simplex plasma in WebGL that follows the theme between dark and light. */
export function ClosingPlasma({
	tone = "chart",
	speed = "normal",
	position = "absolute",
	turbulence = 1,
	sparkle = 1,
	grain = 1,
	interactive = true,
	className,
	children,
}: ClosingPlasmaProps) {
	const options: ClosingPlasmaOptions = {
		colors: CLOSING_PLASMA_COLORS[tone],
		speed: CLOSING_PLASMA_SPEED[speed],
		turbulence,
		sparkle,
		grain,
		interactive,
	};
	const { root, canvas, webgl } = useCanvasEngine(mountClosingPlasma, options, [
		tone,
		speed,
		turbulence,
		sparkle,
		grain,
		interactive,
	]);
	const s = closingPlasma({ tone, speed, position, webgl });

	return (
		<div ref={root} data-slot="closing-plasma" className={cn(s.root(), className)}>
			<div aria-hidden className={s.fallback()} />
			<canvas ref={canvas} aria-hidden className={s.canvas()} />
			{children ? <div className={s.content()}>{children}</div> : null}
		</div>
	);
}
