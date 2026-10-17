"use client";

import type { TextareaHTMLAttributes } from "react";
import { useId, useLayoutEffect, useRef } from "react";
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
	label?: string;
	description?: string;
	showCount?: boolean;
}

export function Textarea({
	className,
	rows = 3,
	size = "default",
	variant = "outline",
	autoGrow = false,
	maxRows = 10,
	invalid = false,
	label,
	description,
	showCount = false,
	maxLength,
	value,
	id: idProp,
	...rest
}: TextareaProps) {
	const autoId = useId();
	const id = idProp ?? autoId;
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

	const field = (
		<textarea
			{...rest}
			id={id}
			ref={ref}
			rows={rows}
			value={value}
			maxLength={maxLength}
			aria-invalid={invalid || rest["aria-invalid"] || undefined}
			aria-describedby={description ? `${id}-description` : rest["aria-describedby"]}
			className={cn(textarea({ size, variant, autoGrow }), className)}
		/>
	);

	// Bare, so this can replace a shadcn textarea; the wrapper only appears with a label.
	if (!label && !description && !showCount) return field;

	return (
		<div className="flex w-full flex-col gap-1.5">
			{label ? (
				<label htmlFor={id} className="font-medium text-foreground text-sm">
					{label}
				</label>
			) : null}

			{field}

			{description || showCount ? (
				<div className="flex items-start justify-between gap-3">
					{description ? (
						<p
							id={`${id}-description`}
							className="text-muted-foreground text-xs leading-relaxed"
						>
							{description}
						</p>
					) : null}
					{showCount ? (
						<p className="ml-auto shrink-0 font-mono text-muted-foreground text-xs tabular-nums">
							<RollingDigits value={String(value ?? "").length} startOnView={false} />
							{maxLength ? `/${maxLength}` : ""}
						</p>
					) : null}
				</div>
			) : null}
		</div>
	);
}
