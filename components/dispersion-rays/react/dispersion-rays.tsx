"use client";

import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { useCanvasEngine } from "../../lib/react/use-canvas-engine";
import { mountShader } from "../../lib/shader";
import { createDispersionRays, type DispersionRaysOptions } from "../rays";
import {
	DISPERSION_RAYS_COLORS,
	DISPERSION_RAYS_SPEED,
	type DispersionRaysPosition,
	type DispersionRaysSpeed,
	type DispersionRaysTone,
	dispersionRays,
} from "../variants";

export type { DispersionRaysPosition, DispersionRaysSpeed, DispersionRaysTone };

export interface DispersionRaysProps {
	tone?: DispersionRaysTone;
	speed?: DispersionRaysSpeed;
	position?: DispersionRaysPosition;
	/** Colour strength, 0 (flat base) to 1. */
	intensity?: number;
	/** Film grain, 0 to 1. */
	grain?: number;
	className?: string;
	children?: ReactNode;
}

function mountDispersionRays(
	root: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: DispersionRaysOptions,
	onReady: (webgl: boolean) => void,
) {
	const engine = createDispersionRays(initial);
	const shader = mountShader(root, canvas, engine.scene, onReady);
	return {
		update: (next: DispersionRaysOptions) => shader.refresh(engine.set(next)),
		destroy: shader.destroy,
	};
}

/** Spectral rays fanning from a light source through soft volumetric haze. */
export function DispersionRays({
	tone = "chart",
	speed = "normal",
	position = "absolute",
	intensity = 1,
	grain = 0,
	className,
	children,
}: DispersionRaysProps) {
	const options: DispersionRaysOptions = {
		colors: DISPERSION_RAYS_COLORS[tone],
		speed: DISPERSION_RAYS_SPEED[speed],
		intensity,
		grain,
	};
	const { root, canvas, webgl } = useCanvasEngine(mountDispersionRays, options, [
		tone,
		speed,
		intensity,
		grain,
	]);
	const s = dispersionRays({ tone, speed, position, webgl });

	return (
		<div ref={root} data-slot="dispersion-rays" className={cn(s.root(), className)}>
			<div aria-hidden className={s.fallback()} />
			<canvas ref={canvas} aria-hidden className={s.canvas()} />
			{children ? <div className={s.content()}>{children}</div> : null}
		</div>
	);
}
