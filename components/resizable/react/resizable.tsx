"use client";

import { type ComponentProps, type CSSProperties, useEffect, useRef } from "react";
import { cn } from "../../lib/react/cn";
import { createResizable } from "./split";
import { type ResizableVariant, resizable } from "./variants";

export type { ResizableVariant };

/** A horizontal split view; drag, flick or arrow-key the dividers. The group needs a definite height. */
export function ResizablePanelGroup({
	onLayoutChange,
	variant = "default",
	className,
	children,
	...props
}: ComponentProps<"div"> & {
	/** Each pane's share in percent after a resize settles. */
	onLayoutChange?: (sizes: number[]) => void;
	variant?: ResizableVariant;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const callback = useRef(onLayoutChange);
	callback.current = onLayoutChange;
	useEffect(() => {
		const group = ref.current;
		if (!group) return;
		const engine = createResizable(group, (sizes) => callback.current?.(sizes));
		return engine.destroy;
	}, []);
	return (
		// biome-ignore lint/a11y/useSemanticElements: a split view is a group of panes, not a form fieldset
		<div
			ref={ref}
			role="group"
			data-slot="resizable-panel-group"
			className={cn(resizable({ variant }).group(), className)}
			{...props}
		>
			{children}
		</div>
	);
}

export function ResizablePanel({
	id,
	label,
	defaultSize,
	minSize,
	maxSize,
	collapsible = false,
	defaultCollapsed = false,
	className,
	children,
	...props
}: Omit<ComponentProps<"div">, "id"> & {
	/** Stable id, referenced by the divider's aria-controls. */
	id: string;
	/** Names the pane for its divider, such as "Folders". */
	label: string;
	/** Starting share; shares are relative, so they need not add up to 100. */
	defaultSize: number;
	/** Width in px where the pane starts to resist; its content clips and fades below it. */
	minSize?: number;
	maxSize?: number;
	/** Dragging well past the minimum, or flicking toward the edge, snaps it closed. */
	collapsible?: boolean;
	defaultCollapsed?: boolean;
}) {
	const s = resizable();
	return (
		<div
			id={id}
			data-slot="resizable-panel"
			data-label={label}
			data-default={defaultSize}
			data-min={minSize}
			data-max={maxSize}
			data-collapsible={collapsible}
			data-default-collapsed={defaultCollapsed}
			style={
				{ flexGrow: collapsible && defaultCollapsed ? 0 : defaultSize } as CSSProperties
			}
			className={cn(s.panel(), className)}
			{...props}
		>
			<div className={s.content()}>{children}</div>
		</div>
	);
}

export function ResizableHandle({ className, ...props }: ComponentProps<"div">) {
	const s = resizable();
	const chevron = (d: string) => (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.75"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			<path d={d} />
		</svg>
	);
	return (
		// biome-ignore lint/a11y/useSemanticElements: an interactive splitter is a focusable separator, not an hr
		<div
			role="separator"
			tabIndex={0}
			aria-orientation="vertical"
			aria-valuenow={50}
			data-slot="resizable-handle"
			data-collapsed="open"
			className={cn(s.handle(), className)}
			{...props}
		>
			<span aria-hidden className={s.grip()} />
			<span aria-hidden className={cn(s.restore(), s.before())}>
				{chevron("m9 18 6-6-6-6")}
			</span>
			<span aria-hidden className={cn(s.restore(), s.after())}>
				{chevron("m15 18-6-6 6-6")}
			</span>
		</div>
	);
}
