"use client";

import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { createPrismGradient, type PrismGradientOptions } from "../../lib/prism";
import { useCanvasEngine } from "../../lib/react/use-canvas-engine";
import { mountShader } from "../../lib/shader";
import {
	PRISM_GRADIENT_COLORS,
	PRISM_GRADIENT_SPEED,
	type PrismGradientPosition,
	type PrismGradientSpeed,
	type PrismGradientTone,
	prismGradient,
} from "../variants";

export type { PrismGradientPosition, PrismGradientSpeed, PrismGradientTone };

export interface PrismGradientProps {
	tone?: PrismGradientTone;
	speed?: PrismGradientSpeed;
	position?: PrismGradientPosition;
	/** Film grain, 0 to 1. */
	grain?: number;
	className?: string;
	children?: ReactNode;
}

function mountPrismGradient(
	root: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: PrismGradientOptions,
	onReady: (webgl: boolean) => void,
) {
	const engine = createPrismGradient(initial);
	const shader = mountShader(root, canvas, engine.scene, onReady);
	return {
		update: (next: PrismGradientOptions) => shader.refresh(engine.set(next)),
		destroy: shader.destroy,
	};
}

/** Swirled prism bands in a WebGL field, coloured from theme tokens. */
export function PrismGradient({
	tone = "chart",
	speed = "normal",
	position = "absolute",
	grain = 0,
	className,
	children,
}: PrismGradientProps) {
	const options: PrismGradientOptions = {
		colors: PRISM_GRADIENT_COLORS[tone],
		speed: PRISM_GRADIENT_SPEED[speed],
		grain,
	};
	const { root, canvas, webgl } = useCanvasEngine(mountPrismGradient, options, [
		tone,
		speed,
		grain,
	]);
	const s = prismGradient({ tone, speed, position, webgl });

	return (
		<div ref={root} data-slot="prism-gradient" className={cn(s.root(), className)}>
			<div aria-hidden className={s.fallback()} />
			<canvas ref={canvas} aria-hidden className={s.canvas()} />
			{children ? <div className={s.content()}>{children}</div> : null}
		</div>
	);
}
