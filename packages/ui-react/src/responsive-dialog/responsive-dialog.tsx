"use client";

import type { ComponentProps, ReactNode } from "react";
import { createContext, useContext } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	type DialogSize,
	DialogTitle,
	DialogTrigger,
	type DialogVariant,
} from "../dialog/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	type DrawerDirection,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "../drawer/drawer";
import { useIsMobile } from "../lib/use-is-mobile";

export type { DialogSize, DialogVariant as ResponsiveDialogVariant, DrawerDirection };

type Ctx = { isMobile: boolean; variant: DialogVariant };

const ResponsiveDialogCtx = createContext<Ctx | null>(null);

function useResponsiveDialog() {
	const ctx = useContext(ResponsiveDialogCtx);
	if (!ctx)
		throw new Error("ResponsiveDialog parts must be used inside <ResponsiveDialog>");
	return ctx;
}

export interface ResponsiveDialogProps {
	children?: ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** Shared frame treatment, forwarded to whichever surface renders. */
	variant?: DialogVariant;
	/** Desktop (Dialog) only. */
	size?: DialogSize;
	dismissOnBackdrop?: boolean;
	/** Mobile (Drawer) only. */
	direction?: DrawerDirection;
	dismissible?: boolean;
}

export function ResponsiveDialog({
	children,
	open,
	defaultOpen = false,
	variant = "default",
	size = "default",
	dismissOnBackdrop = true,
	direction = "bottom",
	dismissible = true,
	onOpenChange,
}: ResponsiveDialogProps) {
	const isMobile = useIsMobile();

	return (
		<ResponsiveDialogCtx.Provider value={{ isMobile, variant }}>
			{isMobile ? (
				<Drawer
					open={open}
					defaultOpen={defaultOpen}
					direction={direction}
					dismissible={dismissible}
					onOpenChange={onOpenChange}
				>
					{children}
				</Drawer>
			) : (
				<Dialog
					open={open}
					defaultOpen={defaultOpen}
					size={size}
					variant={variant}
					dismissOnBackdrop={dismissOnBackdrop}
					onOpenChange={onOpenChange}
				>
					{children}
				</Dialog>
			)}
		</ResponsiveDialogCtx.Provider>
	);
}

export function ResponsiveDialogTrigger({
	className,
	children,
}: {
	className?: string;
	children?: ReactNode;
}) {
	const { isMobile } = useResponsiveDialog();
	return isMobile ? (
		<DrawerTrigger className={className}>{children}</DrawerTrigger>
	) : (
		<DialogTrigger className={className}>{children}</DialogTrigger>
	);
}

export function ResponsiveDialogContent({
	className,
	children,
}: {
	className?: string;
	children?: ReactNode;
}) {
	const { isMobile, variant } = useResponsiveDialog();
	return isMobile ? (
		<DrawerContent variant={variant} className={className}>
			{children}
		</DrawerContent>
	) : (
		<DialogContent className={className}>{children}</DialogContent>
	);
}

export function ResponsiveDialogHeader(props: ComponentProps<"div">) {
	const { isMobile } = useResponsiveDialog();
	return isMobile ? <DrawerHeader {...props} /> : <DialogHeader {...props} />;
}

export function ResponsiveDialogFooter(props: ComponentProps<"div">) {
	const { isMobile } = useResponsiveDialog();
	return isMobile ? <DrawerFooter {...props} /> : <DialogFooter {...props} />;
}

export function ResponsiveDialogTitle({
	className,
	children,
}: {
	className?: string;
	children?: ReactNode;
}) {
	const { isMobile } = useResponsiveDialog();
	return isMobile ? (
		<DrawerTitle className={className}>{children}</DrawerTitle>
	) : (
		<DialogTitle className={className}>{children}</DialogTitle>
	);
}

export function ResponsiveDialogDescription({
	className,
	children,
}: {
	className?: string;
	children?: ReactNode;
}) {
	const { isMobile } = useResponsiveDialog();
	return isMobile ? (
		<DrawerDescription className={className}>{children}</DrawerDescription>
	) : (
		<DialogDescription className={className}>{children}</DialogDescription>
	);
}

export function ResponsiveDialogClose({
	className,
	children,
}: {
	className?: string;
	children?: ReactNode;
}) {
	const { isMobile } = useResponsiveDialog();
	return isMobile ? (
		<DrawerClose className={className}>{children}</DrawerClose>
	) : (
		<DialogClose className={className}>{children}</DialogClose>
	);
}
