"use client";

import { Toolbar } from "@base-ui/react/toolbar";
import { Fragment, type ReactNode, useEffect, useRef } from "react";
import { cn } from "../../lib/react/cn";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../tooltip/react/tooltip";
import { createTray } from "./tray";
import {
	type FloatingButtonGroupSize,
	type FloatingButtonGroupVariant,
	floatingButtonGroup,
} from "./variants";

export type { FloatingButtonGroupSize, FloatingButtonGroupVariant };

export type FloatingButtonGroupAction = {
	type?: "action";
	/** Stable key, also passed to `onAction`. */
	id: string;
	/** Visible label, and the accessible name when only the icon shows. */
	label: string;
	icon?: ReactNode;
	/** Shows only the icon, with the label in a tooltip. Overrides the group's `iconOnly`. */
	iconOnly?: boolean;
	onSelect?: () => void;
	disabled?: boolean;
	/** A mode that switches on, such as Present: sets aria-pressed and keeps a tint while on. */
	pressed?: boolean;
	/** A hint shown in the tooltip, such as "⌘Z"; the key is not bound. */
	shortcut?: string;
	/** Other labels this item switches to, such as ["Copied"]; the button keeps the widest width. */
	reserveLabels?: readonly string[];
};
export type FloatingButtonGroupSeparator = { type: "separator"; id?: string };
export type FloatingButtonGroupItem =
	| FloatingButtonGroupAction
	| FloatingButtonGroupSeparator;

export interface FloatingButtonGroupProps {
	items: readonly FloatingButtonGroupItem[];
	/** Accessible name of the toolbar, e.g. "Board actions". */
	label: string;
	/** `floating` raises the tray for overlays such as a selection toolbar. */
	variant?: FloatingButtonGroupVariant;
	size?: FloatingButtonGroupSize;
	orientation?: "horizontal" | "vertical";
	/** Every item shows only its icon, with its label in a tooltip. */
	iconOnly?: boolean;
	/** Side of the tooltips; top for a row and right for a column by default. */
	tooltipSide?: "top" | "bottom" | "left" | "right";
	/** Called with the item id after the item's own `onSelect`. */
	onAction?: (id: string) => void;
	className?: string;
}

const isAction = (item: FloatingButtonGroupItem): item is FloatingButtonGroupAction =>
	item.type !== "separator";

/**
 * Soft buttons in a quiet tray with one shared highlight that glides to whichever button the
 * pointer or keyboard is on, and dips while pressed.
 */
export function FloatingButtonGroup({
	items,
	label,
	variant = "default",
	size = "default",
	orientation = "horizontal",
	iconOnly: groupIconOnly = false,
	tooltipSide,
	onAction,
	className,
}: FloatingButtonGroupProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	const highlightRef = useRef<HTMLSpanElement>(null);
	useEffect(() => {
		if (rootRef.current && highlightRef.current)
			return createTray(rootRef.current, highlightRef.current);
	}, []);

	const s = floatingButtonGroup({ variant, size });
	const side = tooltipSide ?? (orientation === "vertical" ? "right" : "top");

	return (
		<Toolbar.Root
			ref={rootRef}
			aria-label={label}
			orientation={orientation}
			data-slot="floating-button-group"
			className={cn(s.root(), className)}
		>
			<span ref={highlightRef} aria-hidden className={s.highlight()} />
			{items.map((item, position) => {
				if (!isAction(item))
					return (
						<Toolbar.Separator
							key={item.id ?? `separator-${position}`}
							orientation={orientation === "vertical" ? "horizontal" : "vertical"}
							className={s.separator()}
						/>
					);
				const iconOnly = !!item.icon && (item.iconOnly ?? groupIconOnly);
				const ghosts = iconOnly
					? []
					: [...new Set([item.label, ...(item.reserveLabels ?? [])])];
				const button = (
					<Toolbar.Button
						data-fbg-item=""
						data-icon={item.icon ? "" : undefined}
						data-icon-only={iconOnly || undefined}
						aria-label={item.label}
						aria-pressed={item.pressed}
						aria-disabled={item.disabled || undefined}
						className={s.item()}
						onClick={() => {
							if (item.disabled) return;
							item.onSelect?.();
							onAction?.(item.id);
						}}
					>
						<span className={s.slot()}>
							{ghosts.map((text) => (
								<span key={text} aria-hidden className={s.ghost()}>
									{item.icon && <span className={s.icon()} />}
									{text}
								</span>
							))}
							<span key={item.label} className={s.phase()}>
								{item.icon && (
									<span aria-hidden className={s.icon()}>
										{item.icon}
									</span>
								)}
								{!iconOnly && item.label}
							</span>
						</span>
					</Toolbar.Button>
				);
				if (!iconOnly && !item.shortcut)
					return <Fragment key={item.id}>{button}</Fragment>;
				return (
					<Tooltip key={item.id}>
						<TooltipTrigger render={button} />
						<TooltipContent side={side}>
							{item.label}
							{item.shortcut && <kbd className={s.kbd()}>{item.shortcut}</kbd>}
						</TooltipContent>
					</Tooltip>
				);
			})}
		</Toolbar.Root>
	);
}
