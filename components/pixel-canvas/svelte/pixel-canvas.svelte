<script lang="ts">
import type { Snippet } from "svelte";
import { untrack } from "svelte";
import { cn } from "../../lib/svelte/cn";
import { mountPixels, type PixelOptions } from "./pixels";
import {
	type PixelCanvasPosition,
	type PixelCanvasTone,
	type PixelCanvasVariant,
	pixelCanvas,
} from "./variants";

let {
	variant = "default",
	tone = "spectrum",
	position,
	gap = 8,
	decay = 0.04,
	radius = 90,
	children,
	class: className,
}: {
	/** Square cells, rounded cells, or square cells with a soft halo. */
	variant?: PixelCanvasVariant;
	tone?: PixelCanvasTone;
	/** `absolute` fills the nearest positioned parent; `fixed` fills the viewport. */
	position?: PixelCanvasPosition;
	/** Cell pitch in CSS px, including the 1px gutter. */
	gap?: number;
	/** Fade rate per frame once the pointer moves on, 0 to 1. */
	decay?: number;
	/** Pointer influence radius, in px. */
	radius?: number;
	/** Rendered above the grid; the pointer still lights cells through it. */
	children?: Snippet;
	class?: string;
} = $props();

const s = $derived(pixelCanvas({ variant, tone, position }));
const options: PixelOptions = $derived({ variant, tone, gap, decay, radius });

let root = $state<HTMLDivElement>();
let canvas = $state<HTMLCanvasElement>();
let engine: ReturnType<typeof mountPixels> | undefined;

$effect(() => {
	if (!root || !canvas) return;
	engine = mountPixels(
		root,
		canvas,
		untrack(() => $state.snapshot(options)),
	);
	return () => engine?.destroy();
});

$effect(() => {
	const next = $state.snapshot(options);
	engine?.update(next);
});
</script>

<div bind:this={root} data-slot="pixel-canvas" class={cn(s.root(), className)}>
	<canvas bind:this={canvas} aria-hidden="true" class={s.canvas()}></canvas>
	{#if children}
		<div class={s.content()}>{@render children()}</div>
	{/if}
</div>
