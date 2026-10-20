"use client";

import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { useCanvasEngine } from "../../lib/react/use-canvas-engine";
import { mountShader } from "../../lib/shader";
import { createPrismOrb, type PrismOrbOptions } from "../orb";
import {
	PRISM_ORB_COLORS,
	PRISM_ORB_SPEED,
	type PrismOrbPosition,
	type PrismOrbSpeed,
	type PrismOrbTone,
	prismOrb,
} from "../variants";

export type { PrismOrbPosition, PrismOrbSpeed, PrismOrbTone };

export interface PrismOrbProps {
	tone?: PrismOrbTone;
	speed?: PrismOrbSpeed;
	position?: PrismOrbPosition;
	/** Colour strength, 0 (flat base) to 1. */
	intensity?: number;
	/** Film grain, 0 to 1. */
	grain?: number;
	className?: string;
	children?: ReactNode;
}

function mountPrismOrb(
	root: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: PrismOrbOptions,
	onReady: (webgl: boolean) => void,
) {
	const engine = createPrismOrb(initial);
	const shader = mountShader(root, canvas, engine.scene, onReady);
	return {
		update: (next: PrismOrbOptions) => shader.refresh(engine.set(next)),
		destroy: shader.destroy,
	};
}

/** A refracting glass sphere drifting over prism bands, with chromatic dispersion at its rim. */
export function PrismOrb({
	tone = "chart",
	speed = "normal",
	position = "absolute",
	intensity = 1,
	grain = 0,
	className,
	children,
}: PrismOrbProps) {
	const options: PrismOrbOptions = {
		colors: PRISM_ORB_COLORS[tone],
		speed: PRISM_ORB_SPEED[speed],
		intensity,
		grain,
	};
	const { root, canvas, webgl } = useCanvasEngine(mountPrismOrb, options, [
		tone,
		speed,
		intensity,
		grain,
	]);
	const s = prismOrb({ tone, speed, position, webgl });

	return (
		<div ref={root} data-slot="prism-orb" className={cn(s.root(), className)}>
			<div aria-hidden className={s.fallback()} />
			<canvas ref={canvas} aria-hidden className={s.canvas()} />
			{children ? <div className={s.content()}>{children}</div> : null}
		</div>
	);
}
