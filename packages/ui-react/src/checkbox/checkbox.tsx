"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { useId } from "react";
import { cn } from "../lib/cn";
import { type CheckboxSize, type CheckboxVariant, checkbox } from "./variants";

export type { CheckboxSize, CheckboxVariant };

export interface CheckboxProps {
	checked?: boolean;
	indeterminate?: boolean;
	disabled?: boolean;
	/** `default` square, `circle` for task lists, or `card`: the labelled tile is the hit area. */
	variant?: CheckboxVariant;
	size?: CheckboxSize;
	label?: string;
	description?: string;
	/** Accessible name when there is no visible `label`. */
	"aria-label"?: string;
	className?: string;
	name?: string;
	onCheckedChange?: (checked: boolean) => void;
}

export function Checkbox({
	checked,
	indeterminate = false,
	disabled = false,
	variant = "default",
	size = "default",
	label,
	description,
	"aria-label": ariaLabel,
	className,
	name,
	onCheckedChange,
}: CheckboxProps) {
	const id = useId();
	const frame = checkbox({ variant, size });

	const control = (
		<CheckboxPrimitive.Root
			id={id}
			checked={checked}
			indeterminate={indeterminate}
			disabled={disabled}
			name={name}
			onCheckedChange={onCheckedChange}
			aria-label={label ? undefined : ariaLabel}
			data-slot="checkbox"
			data-variant={variant}
			className={cn(frame.box(), !label && !description && className)}
		>
			<CheckboxPrimitive.Indicator
				keepMounted
				className={cn("text-primary-foreground", frame.mark())}
			>
				{/* One path for both marks, so the tick morphs into the dash instead of swapping. */}
				<svg
					viewBox="0 0 12 12"
					fill="none"
					aria-hidden
					className="checkbox-check size-full"
					data-on={checked || indeterminate}
					data-mixed={indeterminate}
				>
					<path
						d="M2.5 6.2 L4.8 8.5 L9.5 3.6"
						stroke="currentColor"
						strokeWidth="1.8"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);

	// Bare, so this can replace a shadcn checkbox; the wrapper only appears with a label.
	if (!label && !description) return control;

	return (
		<div className={cn(frame.root(), disabled && "opacity-50", className)}>
			{control}
			<label htmlFor={id} className={frame.label()}>
				{label ? <span className={frame.text()}>{label}</span> : null}
				{description ? (
					<span className="block text-muted-foreground text-xs leading-relaxed">
						{description}
					</span>
				) : null}
			</label>
		</div>
	);
}
