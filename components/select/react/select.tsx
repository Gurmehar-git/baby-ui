"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import type { ComponentProps, ReactNode } from "react";
import { createContext, useContext } from "react";
import { cn } from "../../lib/cn";
import { menu } from "../../lib/menu";
import { ANCHORED } from "../../lib/react/anchor";
import {
	type SelectContentSize,
	type SelectTriggerSize,
	type SelectTriggerVariant,
	selectTrigger,
} from "../variants";

export type { SelectTriggerSize, SelectTriggerVariant };

const SelectSizeContext = createContext<SelectTriggerSize>("default");

export function Select({
	value,
	onValueChange,
	items = [],
	children,
	size = "default",
	...props
}: Omit<
	ComponentProps<typeof SelectPrimitive.Root>,
	"value" | "onValueChange" | "multiple" | "defaultValue" | "items"
> & {
	value?: string;
	onValueChange?: (value: string) => void;
	items?: ReadonlyArray<{ value: string; label: ReactNode }>;
	size?: SelectTriggerSize;
}) {
	return (
		<SelectSizeContext.Provider value={size}>
			<SelectPrimitive.Root<string>
				value={value || null}
				onValueChange={(next) => onValueChange?.(next ?? "")}
				items={items}
				{...props}
			>
				{children}
			</SelectPrimitive.Root>
		</SelectSizeContext.Provider>
	);
}

export function SelectValue({
	className,
	...props
}: ComponentProps<typeof SelectPrimitive.Value>) {
	return (
		<SelectPrimitive.Value
			data-slot="select-value"
			className={cn("data-[placeholder]:text-muted-foreground", className)}
			{...props}
		/>
	);
}

export function SelectTrigger({
	className,
	children,
	variant = "default",
	size: sizeProp,
	...props
}: ComponentProps<typeof SelectPrimitive.Trigger> & {
	variant?: SelectTriggerVariant;
	size?: SelectTriggerSize;
}) {
	const rootSize = useContext(SelectSizeContext);
	const size = sizeProp ?? rootSize;
	return (
		<SelectPrimitive.Trigger
			data-slot="select-trigger"
			data-variant={variant}
			data-size={size}
			className={cn(selectTrigger({ variant, size }), className)}
			{...props}
		>
			{children}
			<SelectPrimitive.Icon className="[&>svg]:transition-[transform,scale,translate,rotate] [&>svg]:duration-[var(--duration-exit)] [&>svg]:ease-[var(--ease-ui-out)] data-[popup-open]:[&>svg]:rotate-180 data-[popup-open]:[&>svg]:duration-[var(--duration-dropdown)] motion-reduce:[&>svg]:transition-none">
				<svg
					viewBox="0 0 16 16"
					fill="none"
					aria-hidden
					className="size-3.5 shrink-0 text-muted-foreground"
				>
					<path
						d="m4 6 4 4 4-4"
						stroke="currentColor"
						strokeWidth="1.4"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	);
}

export function SelectContent({
	className,
	children,
	align = "center",
	alignOffset = 0,
	side = "bottom",
	sideOffset = 6,
	alignItemWithTrigger = false,
	size: sizeProp,
	...props
}: ComponentProps<typeof SelectPrimitive.Popup> &
	Pick<
		ComponentProps<typeof SelectPrimitive.Positioner>,
		"align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
	> & {
		/** Match the trigger's `size`. */
		size?: SelectContentSize;
	}) {
	const rootSize = useContext(SelectSizeContext);
	const size = sizeProp ?? rootSize;
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Positioner
				align={align}
				alignOffset={alignOffset}
				side={side}
				sideOffset={sideOffset}
				alignItemWithTrigger={alignItemWithTrigger}
				className="isolate z-50"
			>
				<SelectPrimitive.Popup
					data-slot="select-content"
					data-size={size}
					className={cn(
						ANCHORED,
						menu({ size }).surface(),
						// At least the trigger's width, growing to the longest option so labels never clip.
						"static z-50 max-h-[min(16rem,var(--available-height))] w-max min-w-[var(--anchor-width)] max-w-[min(24rem,var(--available-width))] overflow-x-hidden overflow-y-auto scroll-area",
						className,
					)}
					{...props}
				>
					<SelectPrimitive.List>{children}</SelectPrimitive.List>
				</SelectPrimitive.Popup>
			</SelectPrimitive.Positioner>
		</SelectPrimitive.Portal>
	);
}

export function SelectItem({
	className,
	children,
	...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
	const styles = menu();
	return (
		<SelectPrimitive.Item
			data-slot="select-item"
			className={cn(styles.item(), className)}
			{...props}
		>
			<SelectPrimitive.ItemText className="flex min-w-0 items-center gap-2">
				{children}
			</SelectPrimitive.ItemText>
			{/* Kept mounted so the tick draws in with the row's data-selected. */}
			<SelectPrimitive.ItemIndicator keepMounted>
				<svg viewBox="0 0 14 14" fill="none" aria-hidden className={styles.check()}>
					<path
						d="M3 7.4 5.6 10 11 4.2"
						pathLength={1}
						stroke="currentColor"
						strokeWidth="1.6"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</SelectPrimitive.ItemIndicator>
		</SelectPrimitive.Item>
	);
}

export function SelectGroup({
	className,
	...props
}: ComponentProps<typeof SelectPrimitive.Group>) {
	return (
		<SelectPrimitive.Group
			data-slot="select-group"
			className={cn("py-0.5", className)}
			{...props}
		/>
	);
}

export function SelectLabel({
	className,
	...props
}: ComponentProps<typeof SelectPrimitive.GroupLabel>) {
	return (
		<SelectPrimitive.GroupLabel
			data-slot="select-label"
			className={cn("px-2.5 py-1.5 font-medium text-muted-foreground text-xs", className)}
			{...props}
		/>
	);
}

export function SelectSeparator({
	className,
	...props
}: ComponentProps<typeof SelectPrimitive.Separator>) {
	return (
		<SelectPrimitive.Separator
			data-slot="select-separator"
			className={cn("-mx-1 my-1 h-px bg-border", className)}
			{...props}
		/>
	);
}
