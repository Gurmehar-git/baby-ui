"use client";

import { useEffect, useRef } from "react";
import { cn } from "../../lib/cn";
import { type DitherOptions, mountDither } from "../dither";
import {
	type DitheredLogoSize,
	type DitheredLogoTone,
	type DitheredLogoVariant,
	ditheredLogo,
} from "../variants";

export type { DitheredLogoSize, DitheredLogoTone, DitheredLogoVariant };

export interface DitheredLogoProps {
	/** Logo image URL, SVG or data URI; remote images need CORS headers. */
	src: string;
	/** Accessible name for the logo. */
	alt: string;
	/** `solid` dots the logo; `inverted` dots a plate and knocks the logo out. */
	variant?: DitheredLogoVariant;
	/** Theme token the dots are drawn in. */
	tone?: DitheredLogoTone;
	size?: DitheredLogoSize;
	/** Dots across the longer side of the logo. */
	gridSize?: number;
	/** Share of the shorter box side the logo fills, 0 to 1. */
	scale?: number;
	/** Dot size relative to its grid cell. */
	dotScale?: number;
	/** Ink level, 0 to 1, a cell needs to become a dot. */
	threshold?: number;
	/** Edge softening before dithering, in grid cells. */
	blur?: number;
	/** Corner radius of the inverted plate, as a share of its shorter side. */
	cornerRadius?: number;
	/** Pointer influence radius, in px. */
	radius?: number;
	className?: string;
}

/** A logo dithered into a dot grid in token colours; dots shy from the pointer and ripple on click. */
export function DitheredLogo({
	src,
	alt,
	variant = "solid",
	tone = "foreground",
	size,
	gridSize = 96,
	scale = 0.7,
	dotScale = 0.8,
	threshold = 0.5,
	blur = 1.5,
	cornerRadius = 0.2,
	radius = 100,
	className,
}: DitheredLogoProps) {
	const root = useRef<HTMLDivElement>(null);
	const canvas = useRef<HTMLCanvasElement>(null);
	const engine = useRef<ReturnType<typeof mountDither>>(null);
	const s = ditheredLogo({ variant, tone, size });
	const options: DitherOptions = {
		src,
		variant,
		gridSize,
		scale,
		dotScale,
		threshold,
		blur,
		cornerRadius,
		radius,
	};
	const latest = useRef(options);
	latest.current = options;

	useEffect(() => {
		if (!root.current || !canvas.current) return;
		engine.current = mountDither(root.current, canvas.current, latest.current);
		return () => engine.current?.destroy();
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: src, variant, tone and more.
	useEffect(() => {
		engine.current?.update(latest.current);
	}, [
		src,
		variant,
		tone,
		gridSize,
		scale,
		dotScale,
		threshold,
		blur,
		cornerRadius,
		radius,
	]);

	return (
		<div
			ref={root}
			role="img"
			aria-label={alt}
			data-slot="dithered-logo"
			className={cn(s.root(), className)}
		>
			<canvas ref={canvas} aria-hidden className={s.canvas()} />
		</div>
	);
}
