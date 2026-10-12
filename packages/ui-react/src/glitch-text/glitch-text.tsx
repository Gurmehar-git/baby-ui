import type { CSSProperties } from "react";
import { cn } from "../lib/cn";
import { type GlitchTextBlendMode, type GlitchTextSize, glitchText } from "./variants";

export type { GlitchTextBlendMode, GlitchTextSize };

export interface GlitchTextProps {
	text: string;
	size?: GlitchTextSize;
	/** Unitless multiplier on the ghost offset. */
	intensity?: number;
	/** Glitch burst cycle in seconds. */
	durationSeconds?: number;
	baseColor?: string;
	colorA?: string;
	colorB?: string;
	blendMode?: GlitchTextBlendMode;
	className?: string;
}

export function GlitchText({
	text,
	size = "default",
	intensity,
	durationSeconds,
	baseColor,
	colorA,
	colorB,
	blendMode,
	className,
}: GlitchTextProps) {
	const style = {
		...(intensity !== undefined && { "--glitch-intensity": intensity }),
		...(durationSeconds !== undefined && { "--glitch-duration": `${durationSeconds}s` }),
		...(baseColor !== undefined && { "--glitch-color-base": baseColor }),
		...(colorA !== undefined && { "--glitch-color-a": colorA }),
		...(colorB !== undefined && { "--glitch-color-b": colorB }),
		...(blendMode !== undefined && { "--glitch-blend-mode": blendMode }),
	} as CSSProperties;

	return (
		<span
			data-slot="glitch-text"
			className={cn(glitchText({ size }), className)}
			style={style}
		>
			<span aria-hidden className="glitch-text__ghost-a select-none">
				{text}
			</span>
			<span aria-hidden className="glitch-text__ghost-b select-none">
				{text}
			</span>
			<span className="glitch-text__base">{text}</span>
		</span>
	);
}
