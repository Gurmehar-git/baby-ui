"use client";

import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { Menu } from "@base-ui/react/menu";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { type MenuItemVariant, menu } from "../../lib/menu";
import { ANCHORED } from "../../lib/react/anchor";

export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuSub = Menu.SubmenuRoot;

export function ContextMenuTrigger({
	className,
	...props
}: ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
	return (
		<ContextMenuPrimitive.Trigger
			data-slot="context-menu-trigger"
			className={cn("contents", className)}
			{...props}
		/>
	);
}

export function ContextMenuContent({
	className,
	align = "start",
	alignOffset = 4,
	side = "right",
	sideOffset = 0,
	...props
}: ComponentProps<typeof ContextMenuPrimitive.Popup> &
	Pick<
		ComponentProps<typeof ContextMenuPrimitive.Positioner>,
		"align" | "alignOffset" | "side" | "sideOffset"
	>) {
	return (
		<ContextMenuPrimitive.Portal>
			<ContextMenuPrimitive.Positioner
				align={align}
				alignOffset={alignOffset}
				side={side}
				sideOffset={sideOffset}
				className="isolate z-50 outline-none"
			>
				<ContextMenuPrimitive.Popup
					data-slot="context-menu-content"
					className={cn(ANCHORED, "static", menu().surface(), className)}
					{...props}
				/>
			</ContextMenuPrimitive.Positioner>
		</ContextMenuPrimitive.Portal>
	);
}

export function ContextMenuItem({
	className,
	variant: variantProp,
	destructive = false,
	inset = false,
	...props
}: ComponentProps<typeof ContextMenuPrimitive.Item> & {
	variant?: MenuItemVariant;
	/** Alias for `variant="destructive"`. */
	destructive?: boolean;
	inset?: boolean;
}) {
	const variant: MenuItemVariant =
		variantProp ?? (destructive ? "destructive" : "default");

	return (
		<ContextMenuPrimitive.Item
			data-slot="context-menu-item"
			data-inset={inset || undefined}
			className={cn(menu({ variant }).item(), className)}
			{...props}
		/>
	);
}

export function ContextMenuShortcut({ className, ...props }: ComponentProps<"kbd">) {
	return (
		<kbd
			data-slot="context-menu-shortcut"
			className={cn(menu().shortcut(), className)}
			{...props}
		/>
	);
}

export function ContextMenuLabel({
	className,
	inset = false,
	...props
}: ComponentProps<"div"> & { inset?: boolean }) {
	return (
		<div
			data-slot="context-menu-label"
			data-inset={inset || undefined}
			className={cn(
				"px-2.5 py-1.5 font-medium text-muted-foreground text-xs data-[inset]:pl-8",
				className,
			)}
			{...props}
		/>
	);
}

export function ContextMenuSeparator({
	className,
	...props
}: ComponentProps<typeof ContextMenuPrimitive.Separator>) {
	return (
		<ContextMenuPrimitive.Separator
			data-slot="context-menu-separator"
			className={cn("-mx-1 my-1 border-border", className)}
			{...props}
		/>
	);
}

export function ContextMenuSubTrigger({
	className,
	inset = false,
	children,
	closeDelay = 200,
	...props
}: ComponentProps<typeof Menu.SubmenuTrigger> & { inset?: boolean }) {
	return (
		<Menu.SubmenuTrigger
			data-slot="context-menu-sub-trigger"
			data-inset={inset || undefined}
			closeDelay={closeDelay}
			className={cn(menu().item(), className)}
			{...props}
		>
			<span className="min-w-0 flex-1 truncate text-left">{children}</span>
			<svg
				viewBox="0 0 16 16"
				fill="none"
				aria-hidden
				className="ml-2 size-3.5 shrink-0 text-muted-foreground"
			>
				<path
					d="m6 3.5 4.5 4.5L6 12.5"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</Menu.SubmenuTrigger>
	);
}

export function ContextMenuSubContent({
	className,
	align = "start",
	alignOffset = -3,
	side = "right",
	sideOffset = 0,
	...props
}: ComponentProps<typeof Menu.Popup> &
	Pick<
		ComponentProps<typeof Menu.Positioner>,
		"align" | "alignOffset" | "side" | "sideOffset"
	>) {
	return (
		<Menu.Portal>
			<Menu.Positioner
				align={align}
				alignOffset={alignOffset}
				side={side}
				sideOffset={sideOffset}
				className="isolate z-50 outline-none"
			>
				<Menu.Popup
					data-slot="context-menu-sub-content"
					className={cn(ANCHORED, "static", menu().surface(), "min-w-40", className)}
					{...props}
				/>
			</Menu.Positioner>
		</Menu.Portal>
	);
}

export function ContextMenuGroup(props: ComponentProps<typeof Menu.Group>) {
	return <Menu.Group data-slot="context-menu-group" {...props} />;
}

export function ContextMenuCheckboxItem({
	className,
	children,
	...props
}: ComponentProps<typeof Menu.CheckboxItem>) {
	const styles = menu();
	return (
		<Menu.CheckboxItem
			data-slot="context-menu-checkbox-item"
			data-inset=""
			className={cn(styles.item(), className)}
			{...props}
		>
			{/* Kept mounted so the tick can draw in and back out with the row's data-checked. */}
			<Menu.CheckboxItemIndicator keepMounted className={styles.indicator()}>
				<svg viewBox="0 0 16 16" fill="none" aria-hidden className={styles.check()}>
					<path
						d="m3.5 8.5 3 3 6-7"
						pathLength={1}
						stroke="currentColor"
						strokeWidth="1.6"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</Menu.CheckboxItemIndicator>
			{children}
		</Menu.CheckboxItem>
	);
}

export function ContextMenuRadioGroup(props: ComponentProps<typeof Menu.RadioGroup>) {
	return <Menu.RadioGroup data-slot="context-menu-radio-group" {...props} />;
}

export function ContextMenuRadioItem({
	className,
	children,
	...props
}: ComponentProps<typeof Menu.RadioItem>) {
	const styles = menu();
	return (
		<Menu.RadioItem
			data-slot="context-menu-radio-item"
			data-inset=""
			className={cn(styles.item(), className)}
			{...props}
		>
			<Menu.RadioItemIndicator keepMounted className={styles.indicator()}>
				<span className={styles.dot()} />
			</Menu.RadioItemIndicator>
			{children}
		</Menu.RadioItem>
	);
}
