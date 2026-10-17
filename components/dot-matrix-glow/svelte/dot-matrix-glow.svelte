<script lang="ts">
import type { Snippet } from "svelte";
import { untrack } from "svelte";
import { cn } from "../../lib/cn";
import { type DotOptions, mountDots } from "../dots";
import {
	DOT_MATRIX_SIZE,
	type DotMatrixGlowPosition,
	type DotMatrixGlowShape,
	type DotMatrixGlowSize,
	type DotMatrixGlowTone,
	dotMatrixGlow,
} from "../variants";

let {
	shape = "dot",
	size = "default",
	tone = "primary",
	position,
	gap,
	dotSize,
	glowRadius = 160,
	ripple = true,
	ambient = false,
	children,
	class: className,
}: {
	/** Round dots, squares, or plus marks. */
	shape?: DotMatrixGlowShape;
	/** Density preset: sets `gap` and `dotSize` unless you pass them. */
	size?: DotMatrixGlowSize;
	/** Which theme tokens the lit dots take. */
	tone?: DotMatrixGlowTone;
	/** `absolute` fills the nearest positioned parent; `fixed` fills the viewport. */
	position?: DotMatrixGlowPosition;
	/** Grid pitch in CSS px. */
	gap?: number;
	/** Resting dot radius in CSS px. */
	dotSize?: number;
	/** Pointer influence radius in CSS px. */
	glowRadius?: number;
	/** Pointer down sends a ring outward. */
	ripple?: boolean;
	/** Slow shimmer across the grid; keeps the loop running while visible. */
	ambient?: boolean;
	/** Rendered above the grid; the pointer still lights dots through it. */
	children?: Snippet;
	class?: string;
} = $props();

const s = $derived(dotMatrixGlow({ shape, size, tone, position }));
const options: DotOptions = $derived({
	shape,
	tone,
	gap: gap ?? DOT_MATRIX_SIZE[size].gap,
	dotSize: dotSize ?? DOT_MATRIX_SIZE[size].dot,
	glowRadius,
	ripple,
	ambient,
});

let root = $state<HTMLDivElement>();
let canvas = $state<HTMLCanvasElement>();
let engine: ReturnType<typeof mountDots> | undefined;

$effect(() => {
	if (!root || !canvas) return;
	engine = mountDots(
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

<div bind:this={root} data-slot="dot-matrix-glow" class={cn(s.root(), className)}>
	<canvas bind:this={canvas} aria-hidden="true" class={s.canvas()}></canvas>
	{#if children}
		<div class={s.content()}>{@render children()}</div>
	{/if}
</div>
