"use client";

import { useRef, useState } from "react";
import { cn } from "../lib/cn";
import { type SplitTextSize, splitText } from "./variants";

export type { SplitTextSize };

export interface SplitTextProps {
	/** Each letter splits into two halves that fan out around the hovered one. */
	text: string;
	/** How long the fan-out transition takes, in ms. */
	durationMs?: number;
	size?: SplitTextSize;
	className?: string;
}

const HALF_CLASS =
	"inline h-1/2 select-none overflow-y-hidden whitespace-pre leading-none transition-transform ease-[var(--ease-ui-out)]";

function offset(index: number, active: number | undefined) {
	if (active === undefined) return 0;
	const distance = Math.abs(index - active);
	if (distance === 0) return 5;
	if (distance === 1) return 3;
	if (distance === 2) return 1;
	return 0;
}

export function SplitText({
	text,
	durationMs = 300,
	size = "lg",
	className,
}: SplitTextProps) {
	const [activeIndex, setActiveIndex] = useState<number>();
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

	return (
		<div data-slot="split-text" className={cn(splitText({ size }), className)}>
			<div className="flex h-[1em]">
				{text.split("").map((letter, index) => {
					const shift = offset(index, activeIndex);
					return (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: characters of one string never reorder, so position is the identity.
							key={`${letter}-${index}`}
							onMouseEnter={() => {
								clearTimeout(timer.current);
								setActiveIndex(index);
							}}
							onMouseLeave={() => {
								timer.current = setTimeout(() => setActiveIndex(undefined));
							}}
							className="relative inline-flex h-full flex-col leading-none"
							aria-hidden
						>
							<span
								className={HALF_CLASS}
								style={{
									transform: `translateY(-${shift * 4}px)`,
									transitionDuration: `${durationMs}ms`,
								}}
							>
								{letter}
							</span>
							<span
								className={HALF_CLASS}
								style={{
									transform: `translateY(${shift * 4}px)`,
									transitionDuration: `${durationMs}ms`,
								}}
							>
								<span className="absolute -translate-y-1/2 leading-none">{letter}</span>
							</span>
						</div>
					);
				})}
			</div>
			<span className="sr-only">{text}</span>
		</div>
	);
}
