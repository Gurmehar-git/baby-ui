import { type CSSProperties, createElement, type ElementType } from "react";
import { cn } from "../lib/cn";
import { type ShimmerTextSize, type ShimmerTextVariant, shimmerText } from "./variants";

export type { ShimmerTextSize, ShimmerTextVariant };

export interface ShimmerTextProps {
	text: string;
	/** One sweep across the text, in ms. */
	durationMs?: number;
	/** Band half-width in px per character, so long text gets a wider band. */
	spread?: number;
	/** Sweep while work is ongoing; false settles the text to solid. */
	active?: boolean;
	variant?: ShimmerTextVariant;
	size?: ShimmerTextSize;
	as?: ElementType;
	className?: string;
}

export function ShimmerText({
	text,
	durationMs = 2000,
	spread = 2,
	active = true,
	variant = "default",
	size = "inherit",
	as = "p",
	className,
}: ShimmerTextProps) {
	return createElement(
		as,
		{
			"data-slot": "shimmer-text",
			"data-active": active,
			"aria-busy": active || undefined,
			className: cn(shimmerText({ variant, size }), className),
			style: {
				"--shimmer-spread": `${text.length * spread}px`,
				"--shimmer-duration": `${durationMs}ms`,
			} as CSSProperties,
		},
		text,
	);
}
