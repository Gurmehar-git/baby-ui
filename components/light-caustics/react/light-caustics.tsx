"use client";

import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { useCanvasEngine } from "../../lib/react/use-canvas-engine";
import { type LightCausticsOptions, mountLightCaustics } from "../caustics";
import {
	LIGHT_CAUSTICS_COLORS,
	LIGHT_CAUSTICS_SPEED,
	type LightCausticsPosition,
	type LightCausticsSpeed,
	type LightCausticsTone,
	lightCaustics,
} from "../variants";

export type { LightCausticsPosition, LightCausticsSpeed, LightCausticsTone };

export interface LightCausticsProps {
	tone?: LightCausticsTone;
	speed?: LightCausticsSpeed;
	position?: LightCausticsPosition;
	/** Effect strength, 0 to 2. */
	intensity?: number;
	/** Film grain, 0 to 1. */
	grain?: number;
	className?: string;
	children?: ReactNode;
}

/** Rippling underwater caustic filaments over a tinted base, drawn in WebGL from theme tokens. */
export function LightCaustics({
	tone = "ocean",
	speed = "normal",
	position = "absolute",
	intensity = 1,
	grain = 0,
	className,
	children,
}: LightCausticsProps) {
	const options: LightCausticsOptions = {
		colors: LIGHT_CAUSTICS_COLORS[tone],
		speed: LIGHT_CAUSTICS_SPEED[speed],
		intensity,
		grain,
	};
	const { root, canvas, webgl } = useCanvasEngine(mountLightCaustics, options, [
		tone,
		speed,
		intensity,
		grain,
	]);
	const s = lightCaustics({ tone, speed, position, webgl });

	return (
		<div ref={root} data-slot="light-caustics" className={cn(s.root(), className)}>
			<div aria-hidden className={s.fallback()} />
			<canvas ref={canvas} aria-hidden className={s.canvas()} />
			{children ? <div className={s.content()}>{children}</div> : null}
		</div>
	);
}
