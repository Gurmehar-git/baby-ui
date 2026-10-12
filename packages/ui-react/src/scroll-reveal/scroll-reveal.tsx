"use client";

import { type CSSProperties, useEffect, useRef } from "react";
import { cn } from "../lib/cn";
import { type ScrollRevealSize, scrollReveal } from "./variants";

export type { ScrollRevealSize };

export interface ScrollRevealProps {
	/** The text to reveal word by word as the container scrolls. */
	text: string;
	/** Opacity of words not yet reached by the scroll position. */
	minOpacity?: number;
	/** Also blurs unreached words, sharpening as they're reached. */
	blur?: boolean;
	size?: ScrollRevealSize;
	className?: string;
}

export function ScrollReveal({
	text,
	minOpacity = 0.5,
	blur = true,
	size = "default",
	className,
}: ScrollRevealProps) {
	const words = text.trim().split(/\s+/);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		let raf = 0;
		function onScroll() {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(() => {
				if (!el) return;
				const maxScroll = el.scrollHeight - el.clientHeight;
				const progress = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
				el.style.setProperty("--sr-progress", String(progress));
			});
		}
		el.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			el.removeEventListener("scroll", onScroll);
			cancelAnimationFrame(raf);
		};
	}, []);

	return (
		<div
			ref={containerRef}
			data-slot="scroll-reveal"
			className={cn(scrollReveal({ size }), className)}
			style={{ "--sr-min": minOpacity } as CSSProperties}
		>
			<div className="sticky top-0 flex h-full w-full items-center justify-center">
				<div className="flex h-fit w-full flex-wrap justify-center gap-x-[0.35em] p-8">
					{words.map((word, index) => (
						<span
							// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
							key={`${index}-${word}`}
							data-blur={blur}
							className="scroll-reveal-word"
							style={
								{
									"--sr-t": `clamp(0, calc((var(--sr-progress, 0) - ${index / words.length}) * ${words.length}), 1)`,
								} as CSSProperties
							}
						>
							{word}
						</span>
					))}
				</div>
			</div>
			{words.map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
				<div key={index} className="h-32" aria-hidden />
			))}
		</div>
	);
}
