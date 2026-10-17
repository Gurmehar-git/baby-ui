"use client";

import { type CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { createSlotText } from "../slot";
import { type SlotTextSize, type SlotTextVariant, slotText } from "../variants";

export type { SlotTextSize, SlotTextVariant };

export interface SlotTextProps {
	/** The value to show; numbers pass through `format`. */
	value: string | number;
	/** Formats a number; en-US grouping by default, so 12480 reads 12,480. */
	format?: (value: number) => string;
	/** Seconds the first reel spins; later reels add `stagger`. */
	duration?: number;
	/** Seconds between reels stopping, left to right. */
	stagger?: number;
	/** Extra full turns a digit makes before it lands; 0 rolls straight there. */
	spins?: number;
	/** Which end reels match from when the length changes; numbers default to the end. */
	align?: "start" | "end";
	/** Announce new values politely to screen readers. */
	announce?: boolean;
	variant?: SlotTextVariant;
	size?: SlotTextSize;
	className?: string;
	style?: CSSProperties;
}

/**
 * Text and numbers that spin into their new value like slot machine reels: digits count the way
 * the number moved, letters shuffle, and reels land one after another.
 */
export function SlotText({
	value,
	format,
	duration = 0.9,
	stagger = 0.07,
	spins = 1,
	align,
	announce = false,
	variant = "default",
	size = "inherit",
	className,
	style,
}: SlotTextProps) {
	const text =
		typeof value === "number"
			? format
				? format(value)
				: value.toLocaleString("en-US")
			: value;
	// Server and first paint only; after that the engine owns the reels.
	const [initialText] = useState(text);
	const reelsRef = useRef<HTMLSpanElement>(null);
	const engine = useRef<ReturnType<typeof createSlotText> | null>(null);
	const last = useRef(value);
	const s = slotText({ variant, size });
	const options = {
		duration,
		stagger,
		spins,
		fromEnd: (align ?? (typeof value === "number" ? "end" : "start")) === "end",
		classes: {
			reel: s.reel(),
			sizer: s.sizer(),
			window: s.window(),
			track: s.track(),
			cell: s.cell(),
		},
	};
	const optionsRef = useRef(options);
	optionsRef.current = options;

	useLayoutEffect(() => {
		if (!reelsRef.current) return;
		engine.current = createSlotText(reelsRef.current, initialText, optionsRef.current);
		return () => engine.current?.destroy();
	}, [initialText]);
	useEffect(() => {
		engine.current?.update(options);
		const before = last.current;
		last.current = value;
		engine.current?.set(
			text,
			typeof value === "number" && typeof before === "number" ? value >= before : true,
		);
	});

	return (
		<span data-slot="slot-text" className={cn(s.root(), className)} style={style}>
			<span className="sr-only" aria-live={announce ? "polite" : undefined}>
				{text}
			</span>
			<span ref={reelsRef} aria-hidden className={s.reels()}>
				{initialText}
			</span>
		</span>
	);
}
