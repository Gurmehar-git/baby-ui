"use client";

import { type ComponentProps, createContext, useContext } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../../collapsible/react/collapsible";
import { cn } from "../../lib/cn";
import { type PropertyPanelVariant, propertyPanel } from "../variants";

const GroupContext = createContext(false);

export interface PropertyPanelProps extends ComponentProps<"div"> {
	variant?: PropertyPanelVariant;
}

/** A dense inspector: PropertyPanelGroups of compact `Field size="sm"` rows. */
export function PropertyPanel({ className, variant, ...props }: PropertyPanelProps) {
	return (
		<div
			data-slot="property-panel"
			data-variant={variant}
			className={cn(propertyPanel({ variant }).root(), className)}
			{...props}
		/>
	);
}

export interface PropertyPanelGroupProps extends ComponentProps<"div"> {
	/** Turns the label into a toggle with a chevron; the content animates its height. */
	collapsible?: boolean;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function PropertyPanelGroup({
	className,
	collapsible = false,
	open,
	defaultOpen = true,
	onOpenChange,
	children,
	...props
}: PropertyPanelGroupProps) {
	const classes = cn(propertyPanel().group(), className);
	return (
		<GroupContext.Provider value={collapsible}>
			{collapsible ? (
				<Collapsible
					open={open}
					defaultOpen={defaultOpen}
					onOpenChange={onOpenChange}
					data-slot="property-panel-group"
					className={classes}
					{...props}
				>
					{children}
				</Collapsible>
			) : (
				<div data-slot="property-panel-group" className={classes} {...props}>
					{children}
				</div>
			)}
		</GroupContext.Provider>
	);
}

export function PropertyPanelGroupLabel({
	className,
	children,
	...props
}: ComponentProps<"div">) {
	const collapsible = useContext(GroupContext);
	const s = propertyPanel();
	if (collapsible)
		return (
			<CollapsibleTrigger
				data-slot="property-panel-group-label"
				className={cn(s.label(), s.trigger(), className)}
			>
				{children}
			</CollapsibleTrigger>
		);
	return (
		<div
			data-slot="property-panel-group-label"
			className={cn(s.label(), className)}
			{...props}
		>
			{children}
		</div>
	);
}

/** Right-aligned on the label's line: a button, a count, a switch. */
export function PropertyPanelGroupAction({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="property-panel-group-action"
			className={cn(propertyPanel().action(), className)}
			{...props}
		/>
	);
}

export function PropertyPanelGroupContent({
	className,
	children,
	...props
}: ComponentProps<"div">) {
	const collapsible = useContext(GroupContext);
	const classes = cn(propertyPanel().content(), className);
	if (collapsible)
		return (
			<CollapsibleContent data-slot="property-panel-group-content" className={classes}>
				{children}
			</CollapsibleContent>
		);
	return (
		<div data-slot="property-panel-group-content" className={classes} {...props}>
			{children}
		</div>
	);
}
