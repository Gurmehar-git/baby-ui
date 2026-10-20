<script lang="ts">
import type { Snippet } from "svelte";
import { untrack } from "svelte";
import { cn } from "../../lib/cn";
import { type ContourOptions, mountContours } from "../contours";
import {
	type TopographicLinesPosition,
	type TopographicLinesTone,
	type TopographicLinesVariant,
	topographicLines,
} from "../variants";

let {
	variant = "lines",
	tone = "mono",
	position,
	levels = 14,
	indexEvery = 5,
	scale = 280,
	speed = 1,
	seed = 7,
	lineWidth = 1,
	children,
	class: className,
}: {
	/** Contour lines alone, or lines over soft banded elevation fills. */
	variant?: TopographicLinesVariant;
	/** Which theme tokens the lines take. */
	tone?: TopographicLinesTone;
	/** `absolute` fills the nearest positioned parent; `fixed` fills the viewport. */
	position?: TopographicLinesPosition;
	/** Contour lines across the full height range. */
	levels?: number;
	/** Every Nth line is an index contour, drawn heavier; 0 turns them off. */
	indexEvery?: number;
	/** Size of one hill, in CSS px. */
	scale?: number;
	/** Drift rate; 0 holds the map still. */
	speed?: number;
	/** Picks the terrain; the same seed always draws the same map. */
	seed?: number;
	/** Regular line width in CSS px; index contours draw at 1.8x. */
	lineWidth?: number;
	/** Rendered above the map. */
	children?: Snippet;
	class?: string;
} = $props();

const s = $derived(topographicLines({ variant, tone, position }));
const options: ContourOptions = $derived({
	variant,
	tone,
	levels,
	indexEvery,
	scale,
	speed,
	seed,
	lineWidth,
});

let root = $state<HTMLDivElement>();
let canvas = $state<HTMLCanvasElement>();
let engine: ReturnType<typeof mountContours> | undefined;

$effect(() => {
	if (!root || !canvas) return;
	engine = mountContours(
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

<div bind:this={root} data-slot="topographic-lines" class={cn(s.root(), className)}>
	<canvas bind:this={canvas} aria-hidden="true" class={s.canvas()}></canvas>
	{#if children}
		<div class={s.content()}>{@render children()}</div>
	{/if}
</div>
