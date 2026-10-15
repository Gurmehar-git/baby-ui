import type { InputHTMLAttributes, Ref } from "react";
import { cn } from "../lib/cn";
import { type InputSize, type InputVariant, input } from "./variants";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
	size?: InputSize;
	/** `outline` (default) shows focus as the border; `ring` adds a soft halo. */
	variant?: InputVariant;
	invalid?: boolean;
	ref?: Ref<HTMLInputElement>;
}

export function Input({
	className,
	size = "default",
	variant = "outline",
	invalid = false,
	...rest
}: InputProps) {
	return (
		<input
			{...rest}
			aria-invalid={invalid || rest["aria-invalid"] || undefined}
			className={cn(input({ size, variant }), className)}
		/>
	);
}
