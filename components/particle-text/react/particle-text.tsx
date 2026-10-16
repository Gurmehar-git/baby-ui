"use client";

import { useEffect, useRef } from "react";
import { cn } from "../../lib/react/cn";
import {
	mountParticles,
	type ParticleOptions,
	type ParticleTextShape,
	type ParticleTextSize,
	particleText,
} from "./particles";

export type { ParticleTextShape, ParticleTextSize };

export interface ParticleTextProps {
	text: string;
	/** Largest font size in px; shrinks to fit narrow containers. */
	fontSize?: number;
	/** Radius of each particle, in px. */
	particleSize?: number;
	/** Sampling step in px: lower means more particles. */
	density?: number;
	/** How hard the pointer pushes particles inside `radius`. */
	strength?: number;
	/** Pointer influence radius, in px. */
	radius?: number;
	/** Spring pull back home per frame, 0 to 1. */
	returnSpeed?: number;
	shape?: ParticleTextShape;
	size?: ParticleTextSize;
	className?: string;
}

/** Text drawn as canvas particles that scatter from the pointer and spring back into place. */
export function ParticleText({
	text,
	fontSize = 120,
	particleSize = 1.5,
	density = 6,
	strength = 15,
	radius = 120,
	returnSpeed = 0.08,
	shape = "circle",
	size,
	className,
}: ParticleTextProps) {
	const root = useRef<HTMLDivElement>(null);
	const canvas = useRef<HTMLCanvasElement>(null);
	const field = useRef<ReturnType<typeof mountParticles>>(null);
	const s = particleText({ shape, size });
	const options: ParticleOptions = {
		text,
		fontSize,
		particleSize,
		density,
		strength,
		radius,
		returnSpeed,
		shape,
	};
	const latest = useRef(options);
	latest.current = options;

	useEffect(() => {
		if (!root.current || !canvas.current) return;
		field.current = mountParticles(root.current, canvas.current, latest.current);
		return () => field.current?.destroy();
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: text, fontSize, particleSize and more.
	useEffect(() => {
		field.current?.update(latest.current);
	}, [text, fontSize, particleSize, density, strength, radius, returnSpeed, shape]);

	return (
		<div ref={root} data-slot="particle-text" className={cn(s.root(), className)}>
			<span className={s.srOnly()}>{text}</span>
			<canvas ref={canvas} aria-hidden className={s.canvas()} />
		</div>
	);
}
