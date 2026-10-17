import type { ReactNode } from "react";
import { createElement } from "react";
import { cn } from "../../lib/cn";
import { TYPOGRAPHY_TAG, type TypographyVariant, typography } from "../variants";

export type { TypographyVariant };

export interface TypographyProps {
	children: ReactNode;
	variant?: TypographyVariant;
	as?: string;
	className?: string;
}

export function Typography({
	children,
	variant = "body",
	as,
	className,
}: TypographyProps) {
	return createElement(
		as ?? TYPOGRAPHY_TAG[variant],
		{ className: cn(typography({ variant }), className) },
		children,
	);
}
