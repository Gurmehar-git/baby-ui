<script lang="ts">
import { type Snippet, untrack } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import {
	mountSwappable,
	type SwappableHandlers,
	type Swapy,
	type SwapyConfig,
} from "../core";
import { type SwappableVariant, swappable } from "../variants";
import { setSwappable } from "./context";

let {
	variant = "card",
	animation = "dynamic",
	enabled = true,
	swapMode = "hover",
	dragOnHold = false,
	autoScrollOnDrag = true,
	dragAxis = "both",
	manualSwap = false,
	onSwap,
	onSwapStart,
	onSwapEnd,
	onBeforeSwap,
	onReady,
	hint = "Drag to move, or press Alt and an arrow key.",
	class: classProp,
	children,
	...rest
}: Partial<SwapyConfig> &
	Omit<SwappableHandlers, "announce"> & {
		variant?: SwappableVariant;
		/** The Swapy instance once mounted, for `slotItemMap()` or `update()`. */
		onReady?: (swapy: Swapy) => void;
		/** Read to screen readers on every item, after the item's own content. */
		hint?: string;
		class?: string;
		children?: Snippet;
	} & Omit<HTMLAttributes<HTMLDivElement>, "children" | "class"> = $props();

const hintId = $props.id();
setSwappable(() => ({ variant, hintId }));

let container = $state<HTMLDivElement>();
let spoken = $state("");
let mounted: ReturnType<typeof mountSwappable> | null = null;

$effect(() => {
	if (!container) return;
	const config = {
		animation,
		swapMode,
		dragOnHold,
		autoScrollOnDrag,
		dragAxis,
		manualSwap,
	};
	const instance = mountSwappable(
		container,
		{ ...config, enabled: untrack(() => enabled) },
		() => ({
			onSwap,
			onSwapStart,
			onSwapEnd,
			onBeforeSwap,
			announce: (text) => (spoken = text),
		}),
	);
	mounted = instance;
	untrack(() => onReady?.(instance.swapy));
	return () => {
		instance.destroy();
		mounted = null;
	};
});

$effect(() => mounted?.setEnabled(enabled));
</script>

<!--
	Swapy as a primitive: every option and event of `createSwapy`, plus a keyboard path
	(Alt+arrow). Any markup inside can be a slot, an item or a handle.
-->
<div
	bind:this={container}
	{...rest}
	data-slot="swappable"
	data-disabled={enabled ? undefined : ""}
	class={cn(swappable({ variant }).root(), classProp)}
>
	{@render children?.()}
	<span id={hintId} hidden>{hint}</span>
	<span role="status" class="sr-only">{spoken}</span>
</div>
