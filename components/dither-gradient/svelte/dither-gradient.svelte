<script lang="ts">
import type { Snippet } from "svelte";
import { untrack } from "svelte";
import { cn } from "../../lib/cn";
import { type DitherOptions, mountDither } from "../dither";
import {
	type DitherGradientMatrix,
	type DitherGradientPosition,
	type DitherGradientTone,
	ditherGradient,
} from "../variants";

let {
	tone = "spectrum",
	matrix = "bayer4",
	position,
	angle = 45,
	speed = 1,
	pixelSize = 3,
	children,
	class: className,
}: {
	tone?: DitherGradientTone;
	/** Bayer threshold matrix: larger means finer, less banded patterns. */
	matrix?: DitherGradientMatrix;
	/** `absolute` fills the nearest positioned parent; `fixed` fills the viewport. */
	position?: DitherGradientPosition;
	/** Gradient direction in degrees. */
	angle?: number;
	/** Drift speed multiplier; 0 holds a still frame. */
	speed?: number;
	/** Size of one dither cell, in CSS px. */
	pixelSize?: number;
	/** Rendered above the gradient. */
	children?: Snippet;
	class?: string;
} = $props();

const s = $derived(ditherGradient({ tone, matrix, position }));
const options: DitherOptions = $derived({ tone, matrix, angle, speed, pixelSize });

let root = $state<HTMLDivElement>();
let canvas = $state<HTMLCanvasElement>();
let engine: ReturnType<typeof mountDither> | undefined;

$effect(() => {
	if (!root || !canvas) return;
	engine = mountDither(
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

<div bind:this={root} data-slot="dither-gradient" class={cn(s.root(), className)}>
	<canvas bind:this={canvas} aria-hidden="true" class={s.canvas()}></canvas>
	{#if children}
		<div class={s.content()}>{@render children()}</div>
	{/if}
</div>
