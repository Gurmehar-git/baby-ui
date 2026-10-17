"use client";

import type { ComponentProps } from "react";
import { Drawer as Vaul } from "vaul";
import { cn } from "../../lib/cn";
import { type DrawerVariant, drawerFrame } from "../variants";

export type { DrawerVariant };

export type DrawerDirection = "top" | "bottom" | "left" | "right";

export type DrawerProps = ComponentProps<typeof Vaul.Root>;

export function Drawer({ shouldScaleBackground = false, ...props }: DrawerProps) {
	return (
		<Vaul.Root
			data-slot="drawer"
			shouldScaleBackground={shouldScaleBackground}
			{...props}
		/>
	);
}

export function DrawerTrigger(props: ComponentProps<typeof Vaul.Trigger>) {
	return <Vaul.Trigger data-slot="drawer-trigger" {...props} />;
}

export function DrawerPortal(props: ComponentProps<typeof Vaul.Portal>) {
	return <Vaul.Portal data-slot="drawer-portal" {...props} />;
}

export function DrawerOverlay({
	className,
	...props
}: ComponentProps<typeof Vaul.Overlay>) {
	return (
		<Vaul.Overlay
			data-slot="drawer-overlay"
			className={cn(drawerFrame().overlay(), className)}
			{...props}
		/>
	);
}

export function DrawerContent({
	className,
	children,
	handle = true,
	variant = "default",
	...props
}: ComponentProps<typeof Vaul.Content> & {
	/** Hide the drag handle; only sensible with `dismissible={false}`. */
	handle?: boolean;
	variant?: DrawerVariant;
}) {
	const frame = drawerFrame({ variant });

	return (
		<DrawerPortal>
			<DrawerOverlay />
			{/* The frame is the rim (`framed`) or the surface itself (`default`); vaul sets
			    data-vaul-drawer-direction, which picks the side-specific classes. */}
			<Vaul.Content
				data-slot="drawer-content"
				data-variant={variant}
				aria-modal="true"
				className={cn(frame.panel(), className)}
				{...props}
			>
				{handle ? (
					variant === "framed" ? (
						<Vaul.Handle className={frame.handle()} />
					) : (
						<div aria-hidden className={frame.handleBar()} />
					)
				) : null}
				{/* data-vaul-no-drag: dragging should only start from the rail, not anywhere
				    in the body, since vaul otherwise treats the whole panel as a drag target. */}
				<div data-slot="drawer-surface" data-vaul-no-drag className={frame.surface()}>
					{children}
				</div>
			</Vaul.Content>
		</DrawerPortal>
	);
}

export function DrawerHeader({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="drawer-header"
			className={cn("flex flex-col gap-1.5 pr-8", className)}
			{...props}
		/>
	);
}

export function DrawerFooter({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="drawer-footer"
			className={cn(
				"mt-auto flex flex-col gap-2 pt-5 sm:flex-row sm:justify-end",
				className,
			)}
			{...props}
		/>
	);
}

export function DrawerTitle({ className, ...props }: ComponentProps<typeof Vaul.Title>) {
	return (
		<Vaul.Title
			data-slot="drawer-title"
			className={cn(
				"flex items-center gap-2 font-semibold text-foreground text-lg [&>svg]:size-5 [&>svg]:text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

export function DrawerDescription({
	className,
	...props
}: ComponentProps<typeof Vaul.Description>) {
	return (
		<Vaul.Description
			data-slot="drawer-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

export function DrawerClose({
	className,
	children,
	...props
}: ComponentProps<typeof Vaul.Close>) {
	return (
		<Vaul.Close
			data-slot="drawer-close"
			aria-label={children ? undefined : "Close"}
			className={cn(!children && drawerFrame().close(), className)}
			{...props}
		>
			{children ?? (
				<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
					<path
						d="m4 4 8 8M12 4l-8 8"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
				</svg>
			)}
		</Vaul.Close>
	);
}
