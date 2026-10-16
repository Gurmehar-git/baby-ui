"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/react/cn";
import { type SignatureVariant, signature, signatureTiming } from "./variants";

export type { SignatureVariant };

export interface SignatureProps {
	text: string;
	/** `ink` fills each glyph after its stroke; `outline` keeps the stroke only. */
	variant?: SignatureVariant;
	/** Seconds across the whole text. */
	duration?: number;
	/** Seconds before the first glyph starts. */
	delay?: number;
	/** Outline stroke width, in px. */
	strokeWidth?: number;
	/** Wait until the element scrolls into view. */
	inView?: boolean;
	/** With `inView`, play only the first time; otherwise replay on every entry. */
	once?: boolean;
	/** Set a script font here; the SVG inherits the element's font. */
	className?: string;
}

/** Text that writes itself: each glyph's outline strokes in, then fills. */
export function Signature({
	text,
	variant = "ink",
	duration = 2,
	delay = 0,
	strokeWidth = 1,
	inView = false,
	once = true,
	className,
}: SignatureProps) {
	const root = useRef<HTMLSpanElement>(null);
	const [visible, setVisible] = useState(!inView);
	const [run, setRun] = useState(0);
	const s = signature({ variant });
	const chars = Array.from(text);

	useEffect(() => {
		const el = root.current;
		if (!inView || !el || typeof IntersectionObserver === "undefined") {
			setVisible(true);
			return;
		}
		setVisible(false);
		const io = new IntersectionObserver(([entry]) => {
			if (entry?.isIntersecting) {
				setVisible(true);
				if (once) io.disconnect();
			} else if (!once) {
				setVisible(false);
				setRun((r) => r + 1);
			}
		});
		io.observe(el);
		return () => io.disconnect();
	}, [inView, once]);

	return (
		<span
			ref={root}
			data-slot="signature"
			data-state={visible ? "play" : "idle"}
			className={cn(s.root(), className)}
			style={signatureTiming(chars.length, duration, delay) as CSSProperties}
		>
			<span className={s.ghost()}>{text}</span>
			<svg key={`${text}-${run}`} aria-hidden className={s.svg()}>
				<text
					x="0.1em"
					y="50%"
					dominantBaseline="central"
					strokeWidth={strokeWidth}
					className={s.text()}
				>
					{chars.map((char, i) => (
						<tspan
							// biome-ignore lint/suspicious/noArrayIndexKey: characters of one string never reorder, so position is the identity.
							key={`${char}-${i}`}
							className={s.glyph()}
							style={{ "--signature-i": i } as CSSProperties}
						>
							{char}
						</tspan>
					))}
				</text>
			</svg>
		</span>
	);
}
