"use client";

import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { type ComponentProps, createContext, useContext } from "react";
import { cn } from "../../lib/cn";
import { ANCHORED } from "../../lib/react/anchor";
import {
	type NavigationMenuSize,
	type NavigationMenuVariant,
	navigationMenu,
	navigationMenuTriggerStyle,
} from "../variants";

export type { NavigationMenuSize, NavigationMenuVariant };
export { navigationMenuTriggerStyle };

const styles = navigationMenu();
const NavigationMenuStyleContext = createContext<NavigationMenuVariant>("default");

export function NavigationMenu({
	align = "start",
	variant = "default",
	className,
	children,
	...props
}: NavigationMenuPrimitive.Root.Props &
	Pick<NavigationMenuPrimitive.Positioner.Props, "align"> & {
		variant?: NavigationMenuVariant;
	}) {
	const variantStyles = navigationMenu({ variant });
	return (
		<NavigationMenuStyleContext.Provider value={variant}>
			<NavigationMenuPrimitive.Root
				data-slot="navigation-menu"
				data-variant={variant}
				className={cn(variantStyles.root(), className)}
				{...props}
			>
				{children}
				<NavigationMenuViewport align={align} variant={variant} />
			</NavigationMenuPrimitive.Root>
		</NavigationMenuStyleContext.Provider>
	);
}

export function NavigationMenuList({
	className,
	...props
}: ComponentProps<typeof NavigationMenuPrimitive.List>) {
	return (
		<NavigationMenuPrimitive.List
			data-slot="navigation-menu-list"
			className={cn(styles.list(), className)}
			{...props}
		/>
	);
}

export function NavigationMenuItem({
	className,
	...props
}: ComponentProps<typeof NavigationMenuPrimitive.Item>) {
	return (
		<NavigationMenuPrimitive.Item
			data-slot="navigation-menu-item"
			className={cn(styles.item(), className)}
			{...props}
		/>
	);
}

export function NavigationMenuTrigger({
	className,
	children,
	size,
	...props
}: NavigationMenuPrimitive.Trigger.Props & { size?: NavigationMenuSize }) {
	return (
		<NavigationMenuPrimitive.Trigger
			data-slot="navigation-menu-trigger"
			className={cn(navigationMenuTriggerStyle({ size }), className)}
			{...props}
		>
			{children}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
				className={styles.chevron()}
			>
				<path d="m6 9 6 6 6-6" />
			</svg>
		</NavigationMenuPrimitive.Trigger>
	);
}

export function NavigationMenuContent({
	className,
	children,
	...props
}: NavigationMenuPrimitive.Content.Props) {
	const variant = useContext(NavigationMenuStyleContext);
	return (
		<NavigationMenuPrimitive.Content
			data-slot="navigation-menu-content"
			// In flow, as shadcn's Base UI port: the popup sizes itself to the active content.
			className={cn(
				"h-full w-auto transition-[opacity,translate] duration-[var(--duration-overlay)] ease-[var(--ease-ui-out)] motion-reduce:transition-none",
				"data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
				"data-[starting-style]:data-[activation-direction=left]:-translate-x-1/2 data-[starting-style]:data-[activation-direction=right]:translate-x-1/2",
				"data-[ending-style]:data-[activation-direction=left]:translate-x-1/2 data-[ending-style]:data-[activation-direction=right]:-translate-x-1/2",
				navigationMenu({ variant }).content(),
				className,
			)}
			{...props}
		>
			{/* One panel child, matching the Svelte port where the viewport measures the first child. */}
			<div data-slot="navigation-menu-panel" className="flex flex-col">
				{children}
			</div>
		</NavigationMenuPrimitive.Content>
	);
}

export function NavigationMenuBody({ className, ...props }: ComponentProps<"div">) {
	const variant = useContext(NavigationMenuStyleContext);
	return (
		<div
			data-slot="navigation-menu-body"
			className={cn(navigationMenu({ variant }).body(), className)}
			{...props}
		/>
	);
}

export function NavigationMenuFooter({ className, ...props }: ComponentProps<"div">) {
	const variant = useContext(NavigationMenuStyleContext);
	return (
		<div
			data-slot="navigation-menu-footer"
			className={cn(navigationMenu({ variant }).footer(), className)}
			{...props}
		/>
	);
}

/** The shared panel: the Positioner slides it between triggers and the Popup resizes to the open content. */
export function NavigationMenuViewport({
	className,
	variant = "default",
	side = "bottom",
	sideOffset = 8,
	align = "start",
	alignOffset = 0,
	...props
}: NavigationMenuPrimitive.Positioner.Props & { variant?: NavigationMenuVariant }) {
	const variantStyles = navigationMenu({ variant });
	return (
		<NavigationMenuPrimitive.Portal>
			<NavigationMenuPrimitive.Positioner
				side={side}
				sideOffset={sideOffset}
				align={align}
				alignOffset={alignOffset}
				className={cn(
					"isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width)",
					"transition-[top,left,right,bottom] duration-[var(--duration-overlay)] ease-[var(--ease-ui-out)] data-instant:transition-none motion-reduce:transition-none",
					// A hover bridge over the gap, so moving down to the panel never closes it.
					"before:absolute before:inset-x-0 before:-top-2.5 before:h-2.5",
					className,
				)}
				{...props}
			>
				<NavigationMenuPrimitive.Popup
					data-slot="navigation-menu-viewport"
					// Popover's motion contract; width and height also ease as the panel resizes.
					className={cn(
						ANCHORED,
						"static",
						variantStyles.viewport(),
						"relative h-(--popup-height) w-(--popup-width) outline-none",
						"transition-[opacity,scale,translate,width,height]",
					)}
				>
					<NavigationMenuPrimitive.Viewport className="relative size-full overflow-hidden" />
				</NavigationMenuPrimitive.Popup>
			</NavigationMenuPrimitive.Positioner>
		</NavigationMenuPrimitive.Portal>
	);
}

export function NavigationMenuLink({
	className,
	...props
}: NavigationMenuPrimitive.Link.Props) {
	return (
		<NavigationMenuPrimitive.Link
			data-slot="navigation-menu-link"
			className={cn(styles.link(), className)}
			{...props}
		/>
	);
}

export function NavigationMenuIndicator({
	className,
	...props
}: ComponentProps<typeof NavigationMenuPrimitive.Icon>) {
	return (
		<NavigationMenuPrimitive.Icon
			data-slot="navigation-menu-indicator"
			className={cn(styles.indicator(), className)}
			{...props}
		>
			<div className={styles.indicatorArrow()} />
		</NavigationMenuPrimitive.Icon>
	);
}
