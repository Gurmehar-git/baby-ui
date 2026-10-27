"use client";

import { type ComponentProps, useLayoutEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { textMetrics, truncateMiddle } from "../truncate";
import { type MiddleTruncationVariant, middleTruncation } from "../variants";

export type { MiddleTruncationVariant };

type TailStrategy = { end?: number; minEnd?: never } | { end?: never; minEnd?: number };

export type MiddleTruncationProps = Omit<ComponentProps<"span">, "children"> &
	TailStrategy & {
		text: string;
		ellipsis?: string;
		variant?: MiddleTruncationVariant;
	};

export function MiddleTruncation({
	text,
	ellipsis = "…",
	end,
	minEnd,
	variant = "default",
	className,
	...props
}: MiddleTruncationProps) {
	const ref = useRef<HTMLSpanElement>(null);
	const [displayed, setDisplayed] = useState(text);

	useLayoutEffect(() => {
		const element = ref.current;
		if (!element) return;
		let frame = 0;
		let active = true;
		const update = () => {
			if (!active) return;
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const { font, letterSpacing } = textMetrics(element);
				setDisplayed(
					truncateMiddle(
						text,
						element.clientWidth,
						font,
						letterSpacing,
						ellipsis,
						end,
						minEnd,
					),
				);
			});
		};
		update();
		const observer = new ResizeObserver(update);
		observer.observe(element);
		document.fonts?.ready.then(update);
		return () => {
			active = false;
			observer.disconnect();
			cancelAnimationFrame(frame);
		};
	}, [text, ellipsis, end, minEnd]);

	return (
		<span
			ref={ref}
			data-slot="middle-truncation"
			className={cn(middleTruncation({ variant }), className)}
			title={text}
			{...props}
		>
			<span aria-hidden>{displayed}</span>
			<span className="sr-only">{text}</span>
		</span>
	);
}
