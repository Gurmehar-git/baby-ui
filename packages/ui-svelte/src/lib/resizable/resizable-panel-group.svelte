<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../lib/cn";
import { createResizable } from "./split";
import { type ResizableVariant, resizable } from "./variants";

let {
	onLayoutChange,
	variant = "default",
	class: classProp,
	children,
	...rest
}: Omit<HTMLAttributes<HTMLDivElement>, "class" | "children"> & {
	/** Each pane's share in percent after a resize settles. */
	onLayoutChange?: (sizes: number[]) => void;
	variant?: ResizableVariant;
	class?: string;
	children?: Snippet;
} = $props();

let group = $state<HTMLDivElement>();
$effect(() => {
	if (!group) return;
	const engine = createResizable(group, (sizes) => onLayoutChange?.(sizes));
	return engine.destroy;
});
</script>

<div
	bind:this={group}
	role="group"
	data-slot="resizable-panel-group"
	class={cn(resizable({ variant }).group(), classProp)}
	{...rest}
>
	{@render children?.()}
</div>
