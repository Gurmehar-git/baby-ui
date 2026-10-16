"use client";

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import type { ComponentProps, ReactNode } from "react";
import { createContext, useContext, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { type ButtonVariant, button } from "../../button/react/variants";
import { type DialogVariant, dialogFrame } from "../../dialog/react/variants";
import { cn } from "../../lib/react/cn";

type Ctx = {
	variant: DialogVariant;
	/** The safe choice is focused, never the destructive one: AlertDialogCancel attaches
	 * this ref, AlertDialogContent passes it to Base UI's `initialFocus`. */
	cancelRef: React.RefObject<HTMLButtonElement | null>;
	/** The rim slot below the surface; AlertDialogFooter portals into it. */
	footerEl: HTMLDivElement | null;
	setFooterEl: (el: HTMLDivElement | null) => void;
};

const AlertDialogCtx = createContext<Ctx | null>(null);

function useAlertDialog() {
	const ctx = useContext(AlertDialogCtx);
	if (!ctx) throw new Error("AlertDialog parts must be used inside <AlertDialog>");
	return ctx;
}

export function AlertDialog({
	children,
	open,
	defaultOpen = false,
	variant = "default",
	onOpenChange,
}: {
	children?: ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	variant?: DialogVariant;
	onOpenChange?: (open: boolean) => void;
}) {
	const [footerEl, setFooterEl] = useState<HTMLDivElement | null>(null);
	const cancelRef = useRef<HTMLButtonElement>(null);
	const ctx = useMemo(
		() => ({ variant, cancelRef, footerEl, setFooterEl }),
		[variant, footerEl],
	);

	return (
		<AlertDialogCtx.Provider value={ctx}>
			<AlertDialogPrimitive.Root
				open={open}
				defaultOpen={defaultOpen}
				onOpenChange={(next) => onOpenChange?.(next)}
			>
				{children}
			</AlertDialogPrimitive.Root>
		</AlertDialogCtx.Provider>
	);
}

export function AlertDialogTrigger({
	className,
	...props
}: ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
	return (
		<AlertDialogPrimitive.Trigger
			data-slot="alert-dialog-trigger"
			className={cn("inline-flex", className)}
			{...props}
		/>
	);
}

export function AlertDialogContent({
	className,
	children,
}: ComponentProps<typeof AlertDialogPrimitive.Popup>) {
	const dialog = useAlertDialog();
	const styles = dialogFrame({ variant: dialog.variant });

	return (
		<AlertDialogPrimitive.Portal>
			<AlertDialogPrimitive.Backdrop
				data-slot="alert-dialog-backdrop"
				className={styles.backdrop()}
			/>
			<AlertDialogPrimitive.Popup
				data-slot="alert-dialog-content"
				data-variant={dialog.variant}
				initialFocus={dialog.cancelRef}
				className={cn(
					styles.popup(),
					styles.panel(),
					"w-[min(26rem,calc(100vw-2rem))]",
					className,
				)}
			>
				{dialog.variant === "framed" ? (
					<>
						<div className={styles.body()}>{children}</div>
						<div ref={dialog.setFooterEl} className="empty:hidden" />
					</>
				) : (
					<>
						{children}
						<div ref={dialog.setFooterEl} className="empty:hidden" />
					</>
				)}
			</AlertDialogPrimitive.Popup>
		</AlertDialogPrimitive.Portal>
	);
}

export function AlertDialogHeader({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-dialog-header"
			className={cn("flex flex-col gap-2", className)}
			{...props}
		/>
	);
}

export function AlertDialogFooter({ className, ...props }: ComponentProps<"div">) {
	const dialog = useAlertDialog();
	const node = (
		<div
			data-slot="alert-dialog-footer"
			className={cn(dialogFrame({ variant: dialog.variant }).footer(), className)}
			{...props}
		/>
	);
	// Rendered into the frame rim below the surface once that slot exists.
	return dialog.footerEl ? createPortal(node, dialog.footerEl) : null;
}

export function AlertDialogTitle({
	className,
	...props
}: ComponentProps<typeof AlertDialogPrimitive.Title>) {
	return (
		<AlertDialogPrimitive.Title
			data-slot="alert-dialog-title"
			className={cn("font-medium text-foreground text-base", className)}
			{...props}
		/>
	);
}

export function AlertDialogDescription({
	className,
	...props
}: ComponentProps<typeof AlertDialogPrimitive.Description>) {
	return (
		<AlertDialogPrimitive.Description
			data-slot="alert-dialog-description"
			className={cn("text-muted-foreground text-sm leading-relaxed", className)}
			{...props}
		/>
	);
}

export function AlertDialogCancel({
	className,
	...props
}: ComponentProps<typeof AlertDialogPrimitive.Close>) {
	const dialog = useAlertDialog();

	return (
		<AlertDialogPrimitive.Close
			ref={dialog.cancelRef}
			data-slot="alert-dialog-cancel"
			className={cn(button({ variant: "outline" }), className)}
			{...props}
		/>
	);
}

export function AlertDialogAction({
	className,
	destructive = false,
	...props
}: ComponentProps<typeof AlertDialogPrimitive.Close> & { destructive?: boolean }) {
	const variant: ButtonVariant = destructive ? "destructive" : "default";

	return (
		<AlertDialogPrimitive.Close
			data-slot="alert-dialog-action"
			className={cn(button({ variant }), className)}
			{...props}
		/>
	);
}
