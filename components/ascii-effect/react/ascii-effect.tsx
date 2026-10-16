"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "../../lib/react/cn";
import { type AsciiOptions, mountAscii } from "./ascii";
import {
	type AsciiEffectDither,
	type AsciiEffectFit,
	type AsciiEffectPosition,
	type AsciiEffectTone,
	type AsciiEffectVariant,
	asciiEffect,
} from "./variants";

export type {
	AsciiEffectDither,
	AsciiEffectFit,
	AsciiEffectPosition,
	AsciiEffectTone,
	AsciiEffectVariant,
};

export interface AsciiEffectProps {
	/** Image URL; must be same-origin or served with CORS so its pixels can be read. */
	src: string;
	/** Describes the image; omit when the effect is purely decorative. */
	alt?: string;
	/** `image` is still, `flow` drifts and ripples under the pointer, `glitch` tears rows. */
	variant?: AsciiEffectVariant;
	/** Token colour ramp by brightness, or `source` for the image's own colours. */
	tone?: AsciiEffectTone;
	/** Glyph ramp from sparse to dense. */
	chars?: string;
	/** Glyph size in px. */
	fontSize?: number;
	contrast?: number;
	brightness?: number;
	dither?: AsciiEffectDither;
	/** Flip the brightness mapping. */
	invert?: boolean;
	fit?: AsciiEffectFit;
	/** Flow drift or glitch frequency multiplier; 0 holds a still frame. */
	speed?: number;
	/** `absolute` fills the nearest positioned parent; `fixed` fills the viewport. */
	position?: AsciiEffectPosition;
	/** Rendered above the glyphs. */
	children?: ReactNode;
	className?: string;
}

/** A full-bleed canvas that redraws an image as ASCII glyphs in the element's own font. */
export function AsciiEffect({
	src,
	alt,
	variant = "image",
	tone = "mono",
	chars = " .:-=+*#%@",
	fontSize = 10,
	contrast = 1.1,
	brightness = 1.2,
	dither = "floyd-steinberg",
	invert = false,
	fit = "cover",
	speed = 1,
	position,
	children,
	className,
}: AsciiEffectProps) {
	const root = useRef<HTMLDivElement>(null);
	const canvas = useRef<HTMLCanvasElement>(null);
	const engine = useRef<ReturnType<typeof mountAscii>>(null);
	const s = asciiEffect({ variant, tone, dither, fit, position });
	const options: AsciiOptions = {
		src,
		variant,
		tone,
		chars,
		fontSize,
		contrast,
		brightness,
		dither,
		invert,
		fit,
		speed,
	};
	const latest = useRef(options);
	latest.current = options;

	useEffect(() => {
		if (!root.current || !canvas.current) return;
		engine.current = mountAscii(root.current, canvas.current, latest.current);
		return () => engine.current?.destroy();
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: src, variant, tone and more.
	useEffect(() => {
		engine.current?.update(latest.current);
	}, [
		src,
		variant,
		tone,
		chars,
		fontSize,
		contrast,
		brightness,
		dither,
		invert,
		fit,
		speed,
	]);

	return (
		<div ref={root} data-slot="ascii-effect" className={cn(s.root(), className)}>
			<canvas
				ref={canvas}
				role={alt ? "img" : undefined}
				aria-label={alt || undefined}
				aria-hidden={alt ? undefined : true}
				className={s.canvas()}
			/>
			{children ? <div className={s.content()}>{children}</div> : null}
		</div>
	);
}
