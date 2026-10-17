"use client";

import {
	type CSSProperties,
	type PointerEvent as ReactPointerEvent,
	useState,
} from "react";
import { cn } from "../../lib/cn";
import { type MaskTextSize, maskText } from "../variants";

export type { MaskTextSize };

export interface MaskTextProps {
	/** Shown through the cursor-following mask. */
	revealText: string;
	/** Shown underneath, everywhere the mask isn't. */
	baseText: string;
	/** Mask diameter on hover, in pixels. */
	revealSize?: number;
	/** How long the mask grows/shrinks on hover, in ms. */
	durationMs?: number;
	size?: MaskTextSize;
	className?: string;
}

export function MaskText({
	revealText,
	baseText,
	revealSize = 240,
	durationMs = 500,
	size = "default",
	className,
}: MaskTextProps) {
	const { root, base, reveal } = maskText({ size });
	const [pos, setPos] = useState({ x: "50%", y: "50%" });
	const [hovered, setHovered] = useState(false);

	function onMove(event: ReactPointerEvent<HTMLDivElement>) {
		const rect = event.currentTarget.getBoundingClientRect();
		setPos({ x: `${event.clientX - rect.left}px`, y: `${event.clientY - rect.top}px` });
	}

	return (
		<div
			data-slot="mask-text"
			className={cn(root(), className)}
			onPointerMove={onMove}
			onPointerEnter={() => setHovered(true)}
			onPointerLeave={() => setHovered(false)}
		>
			<span className={base()}>{baseText}</span>
			<span
				aria-hidden
				className={reveal()}
				style={
					{
						"--mt-x": pos.x,
						"--mt-y": pos.y,
						"--mt-size": hovered ? `${revealSize}px ${revealSize}px` : "0px 0px",
						"--mt-duration": `${durationMs}ms`,
					} as CSSProperties
				}
			>
				{revealText}
			</span>
		</div>
	);
}
