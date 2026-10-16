"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { useId } from "react";
import { cn } from "../../lib/react/cn";
import {
	type SwitchSize,
	type SwitchVariant,
	switchThumb,
	switchTrack,
} from "./variants";

export type { SwitchSize, SwitchVariant };

export interface SwitchProps {
	checked?: boolean;
	disabled?: boolean;
	/** `default` pill thumb, `round` thumb, or `marked`: round with on/off marks. */
	variant?: SwitchVariant;
	size?: SwitchSize;
	label?: string;
	/** Accessible name when there is no visible `label`. */
	"aria-label"?: string;
	className?: string;
	onCheckedChange?: (checked: boolean) => void;
}

export function Switch({
	checked,
	disabled = false,
	variant = "default",
	size = "default",
	label,
	"aria-label": ariaLabel,
	className,
	onCheckedChange,
}: SwitchProps) {
	const id = useId();

	const control = (
		<SwitchPrimitive.Root
			id={id}
			checked={checked}
			disabled={disabled}
			onCheckedChange={onCheckedChange}
			data-slot="switch"
			aria-label={label ? undefined : (ariaLabel ?? "Toggle")}
			data-variant={variant}
			className={cn(switchTrack({ variant, size }), !label && className)}
		>
			<SwitchPrimitive.Thumb className={switchThumb({ variant, size })} />
		</SwitchPrimitive.Root>
	);

	// Bare, so this can replace a shadcn switch; the wrapper only appears with a label.
	if (!label) return control;

	return (
		<span className={cn("inline-flex items-center gap-2.5", className)}>
			{control}
			<label
				htmlFor={id}
				className={cn("text-foreground text-sm", disabled && "opacity-50")}
			>
				{label}
			</label>
		</span>
	);
}
