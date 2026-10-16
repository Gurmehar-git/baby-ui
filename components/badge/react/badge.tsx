import type { ComponentProps } from "react";
import { cn } from "../../lib/react/cn";
import { type BadgeSize, type BadgeVariant, badge } from "./variants";

export interface BadgeProps extends ComponentProps<"span"> {
	variant?: BadgeVariant;
	size?: BadgeSize;
	dot?: boolean;
}

export function Badge({
	children,
	className,
	variant = "default",
	size = "default",
	dot = false,
	...props
}: BadgeProps) {
	return (
		<span
			data-slot="badge"
			data-variant={variant}
			className={cn(badge({ variant, size }), className)}
			{...props}
		>
			{dot ? <span className="size-1.5 shrink-0 rounded-full bg-current" /> : null}
			{children}
		</span>
	);
}
