import type { HTMLAttributes, ReactNode } from "react";
import { createElement } from "react";
import { cn } from "../../lib/cn";
import { TYPOGRAPHY_TAG, type TypographyVariant, typography } from "../variants";

export type { TypographyVariant };

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
	children: ReactNode;
	variant?: TypographyVariant;
	/** The element to render; defaults to the variant's semantic tag (`h1`, `p`, `code`...). */
	as?: string;
}

export function Typography({
	children,
	variant = "body",
	as,
	className,
	...rest
}: TypographyProps) {
	return createElement(
		as ?? TYPOGRAPHY_TAG[variant],
		{
			"data-slot": "typography",
			"data-variant": variant,
			...rest,
			className: cn(typography({ variant }), className),
		},
		children,
	);
}
