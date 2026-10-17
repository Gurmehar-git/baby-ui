"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { createLetterMorph } from "../letters";
import { type LetterMorphSize, type LetterMorphVariant, letterMorph } from "../variants";

export type { LetterMorphSize, LetterMorphVariant };

export interface LetterMorphProps {
	/** The label; change it to morph. */
	text: string;
	as?: "span" | "div" | "p" | "strong" | "h1" | "h2" | "h3";
	variant?: LetterMorphVariant;
	size?: LetterMorphSize;
	className?: string;
	id?: string;
}

/**
 * Morphs one short label into the next in place: shared letters glide, new ones sharpen in,
 * removed ones blur away, and the width follows so the layout glides instead of jumping.
 */
export function LetterMorph({
	text,
	as: Tag = "span",
	variant = "default",
	size = "inherit",
	className,
	id,
}: LetterMorphProps) {
	// Server and first paint only; after that the engine owns the letters.
	const [initialText] = useState(text);
	const frameRef = useRef<HTMLSpanElement>(null);
	const trackRef = useRef<HTMLSpanElement>(null);
	const engine = useRef<ReturnType<typeof createLetterMorph> | null>(null);
	const s = letterMorph({ variant, size });
	const glyph = s.glyph();
	const glyphRef = useRef(glyph);
	glyphRef.current = glyph;

	useLayoutEffect(() => {
		if (!frameRef.current || !trackRef.current) return;
		engine.current = createLetterMorph(frameRef.current, trackRef.current, initialText, {
			glyph: glyphRef.current,
		});
		return () => engine.current?.destroy();
	}, [initialText]);
	useEffect(() => {
		engine.current?.update({ glyph });
		engine.current?.set(text);
	});

	return (
		<Tag id={id} data-slot="letter-morph" className={cn(s.root(), className)}>
			<span className="sr-only">{text}</span>
			<span ref={frameRef} aria-hidden className={s.frame()}>
				<span ref={trackRef} className={s.track()}>
					{initialText}
				</span>
			</span>
		</Tag>
	);
}
