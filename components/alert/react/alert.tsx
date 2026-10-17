"use client";

import type { ComponentProps } from "react";
import { useState } from "react";
import { cn } from "../../lib/cn";
import { ALERT_ROLE, type AlertVariant, alert, alertCollapse } from "../variants";

export function Alert({
	className,
	variant = "info",
	dismissible = false,
	open: openProp,
	onOpenChange,
	children,
	...props
}: ComponentProps<"div"> & {
	variant?: AlertVariant;
	dismissible?: boolean;
	/** Shown or folded away; an alert that can close collapses its row instead of vanishing. */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const [ownOpen, setOwnOpen] = useState(true);
	const open = openProp ?? ownOpen;
	const close = () => {
		if (openProp === undefined) setOwnOpen(false);
		onOpenChange?.(false);
	};

	const body = (
		<div
			data-slot="alert"
			role={ALERT_ROLE[variant]}
			className={cn("alert-in", alert({ variant }), dismissible && "pr-10", className)}
			{...props}
		>
			{children}
			{dismissible ? (
				<button
					type="button"
					aria-label="Dismiss"
					onClick={close}
					className="absolute top-2.5 right-2.5 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
				>
					<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
						<path
							d="m4 4 8 8M12 4l-8 8"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
					</svg>
				</button>
			) : null}
		</div>
	);
	// A plain alert keeps its bare markup; only one that can close gets the folding wrapper.
	if (!dismissible && openProp === undefined) return body;
	const c = alertCollapse();
	return (
		<div data-slot="alert-collapse" data-open={open} inert={!open} className={c.root()}>
			<div className={c.inner()}>{body}</div>
		</div>
	);
}

export function AlertTitle({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-title"
			className={cn(
				"col-start-2 min-h-4 font-medium text-foreground tracking-tight",
				className,
			)}
			{...props}
		/>
	);
}

export function AlertDescription({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-description"
			className={cn(
				"col-start-2 grid justify-items-start gap-1 text-muted-foreground text-sm [&_p]:leading-relaxed",
				className,
			)}
			{...props}
		/>
	);
}
