"use client";

import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { useCanvasEngine } from "../../lib/react/use-canvas-engine";
import { mountShader } from "../../lib/shader";
import { createInkBloom, type InkBloomOptions } from "../ink";
import {
	INK_BLOOM_COLORS,
	INK_BLOOM_SPEED,
	type InkBloomPosition,
	type InkBloomSpeed,
	type InkBloomTone,
	inkBloom,
} from "../variants";

export type { InkBloomPosition, InkBloomSpeed, InkBloomTone };

export interface InkBloomProps {
	tone?: InkBloomTone;
	speed?: InkBloomSpeed;
	position?: InkBloomPosition;
	/** Colour strength, 0 (flat base) to 1. */
	intensity?: number;
	/** Film grain, 0 to 1. */
	grain?: number;
	className?: string;
	children?: ReactNode;
}

function mountInkBloom(
	root: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: InkBloomOptions,
	onReady: (webgl: boolean) => void,
) {
	const engine = createInkBloom(initial);
	const shader = mountShader(root, canvas, engine.scene, onReady);
	return {
		update: (next: InkBloomOptions) => shader.refresh(engine.set(next)),
		destroy: shader.destroy,
	};
}

/** Coloured ink diffusing and blooming through water, drawn from theme tokens. */
export function InkBloom({
	tone = "chart",
	speed = "normal",
	position = "absolute",
	intensity = 1,
	grain = 0,
	className,
	children,
}: InkBloomProps) {
	const options: InkBloomOptions = {
		colors: INK_BLOOM_COLORS[tone],
		speed: INK_BLOOM_SPEED[speed],
		intensity,
		grain,
	};
	const { root, canvas, webgl } = useCanvasEngine(mountInkBloom, options, [
		tone,
		speed,
		intensity,
		grain,
	]);
	const s = inkBloom({ tone, speed, position, webgl });

	return (
		<div ref={root} data-slot="ink-bloom" className={cn(s.root(), className)}>
			<div aria-hidden className={s.fallback()} />
			<canvas ref={canvas} aria-hidden className={s.canvas()} />
			{children ? <div className={s.content()}>{children}</div> : null}
		</div>
	);
}
