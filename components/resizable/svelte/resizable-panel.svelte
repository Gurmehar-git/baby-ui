<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/svelte/cn";
import { resizable } from "./variants";

let {
	id,
	label,
	defaultSize,
	minSize,
	maxSize,
	collapsible = false,
	defaultCollapsed = false,
	class: classProp,
	children,
	...rest
}: Omit<HTMLAttributes<HTMLDivElement>, "id" | "class" | "children"> & {
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
	class?: string;
	children?: Snippet;
} = $props();

const s = resizable();
</script>

<div
	{id}
	data-slot="resizable-panel"
	data-label={label}
	data-default={defaultSize}
	data-min={minSize}
	data-max={maxSize}
	data-collapsible={collapsible}
	data-default-collapsed={defaultCollapsed}
	style:flex-grow={collapsible && defaultCollapsed ? 0 : defaultSize}
	class={cn(s.panel(), classProp)}
	{...rest}
>
	<div class={s.content()}>{@render children?.()}</div>
</div>
