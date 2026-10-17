"use client";

import type { ComponentProps, TextareaHTMLAttributes } from "react";
import { useLayoutEffect, useRef } from "react";
import { cn } from "../../lib/cn";
import { RollingDigits } from "../../rolling-digits/react/rolling-digits";
import { type TextareaSize, type TextareaVariant, textarea } from "../variants";

export type { TextareaSize, TextareaVariant };

export interface TextareaProps
	extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
	size?: TextareaSize;
	variant?: TextareaVariant;
	autoGrow?: boolean;
	maxRows?: number;
	invalid?: boolean;
}

/** A bare textarea, so it can replace a shadcn one; label it with Field, FieldLabel and FieldDescription. */
export function Textarea({
	className,
	rows = 3,
	size = "default",
	variant = "outline",
	autoGrow = false,
	maxRows = 10,
	invalid = false,
	value,
	...rest
}: TextareaProps) {
	const ref = useRef<HTMLTextAreaElement>(null);

	// Layout effect, no easing: height must match the text before paint and never lag a keystroke.
	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: value.
	useLayoutEffect(() => {
		const el = ref.current;
		if (!autoGrow || !el) return;
		const line = Number.parseFloat(getComputedStyle(el).lineHeight) || 20;
		el.style.height = "auto";
		el.style.height = `${Math.min(el.scrollHeight, line * maxRows)}px`;
	}, [autoGrow, maxRows, value]);

	return (
		<textarea
			data-slot="textarea"
			{...rest}
			ref={ref}
			rows={rows}
			value={value}
			aria-invalid={invalid || rest["aria-invalid"] || undefined}
			className={cn(textarea({ size, variant, autoGrow }), className)}
		/>
	);
}

export interface TextareaCountProps extends Omit<ComponentProps<"p">, "children"> {
	/** Characters typed so far. */
	value: number;
	/** The textarea's `maxLength`, printed after the count. */
	max?: number;
}

/** A rolling character count for under a Textarea. */
export function TextareaCount({ value, max, className, ...props }: TextareaCountProps) {
	return (
		<p
			data-slot="textarea-count"
			className={cn(
				"ml-auto shrink-0 font-mono text-muted-foreground text-xs tabular-nums",
				className,
			)}
			{...props}
		>
			<RollingDigits value={value} startOnView={false} />
			{max ? `/${max}` : ""}
		</p>
	);
}
