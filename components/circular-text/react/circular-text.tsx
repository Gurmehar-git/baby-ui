import { type CSSProperties, createElement, type ElementType } from "react";
import { cn } from "../../lib/react/cn";
import { type CircularTextDirection, circularText } from "./variants";

export type { CircularTextDirection };

export interface CircularTextProps {
	text: string;
	/** Full loop duration, in seconds. */
	spinSeconds?: number;
	/** Distance from centre to each character's baseline, in pixels. */
	radius?: number;
	direction?: CircularTextDirection;
	as?: ElementType;
	className?: string;
}

export function CircularText({
	text,
	spinSeconds = 30,
	radius = 80,
	direction = "clockwise",
	as = "div",
	className,
}: CircularTextProps) {
	const characters = [...text];
	return createElement(
		as,
		{
			"data-slot": "circular-text",
			"data-direction": direction,
			className: cn(circularText({ direction }), className),
			style: {
				"--ct-duration": `${spinSeconds}s`,
				width: `${radius * 2 + 40}px`,
				height: `${radius * 2 + 40}px`,
			} as CSSProperties,
		},
		characters.map((char, index) => {
			const angle = (360 / characters.length) * index;
			return (
				<span
					// biome-ignore lint/suspicious/noArrayIndexKey: characters of one string never reorder, so position is the identity.
					key={`${index}-${char}`}
					className="absolute inset-0 flex items-center justify-center font-medium"
					style={{ transform: `rotate(${angle}deg) translateY(-${radius}px)` }}
				>
					{char}
				</span>
			);
		}),
	);
}
