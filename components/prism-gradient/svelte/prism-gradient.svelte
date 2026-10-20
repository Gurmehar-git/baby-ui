<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { createPrismGradient, type PrismGradientOptions } from "../../lib/prism";
import { mountShader } from "../../lib/shader";
import { canvasEngine } from "../../lib/svelte/canvas-engine.svelte";
import {
	PRISM_GRADIENT_COLORS,
	PRISM_GRADIENT_SPEED,
	type PrismGradientPosition,
	type PrismGradientSpeed,
	type PrismGradientTone,
	prismGradient,
} from "../variants";

let {
	tone = "chart",
	speed = "normal",
	position = "absolute",
	grain = 0,
	class: classProp,
	children,
}: {
	tone?: PrismGradientTone;
	speed?: PrismGradientSpeed;
	position?: PrismGradientPosition;
	/** Film grain, 0 to 1. */
	grain?: number;
	class?: string;
	children?: Snippet;
} = $props();

function mountPrismGradient(
	root: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: PrismGradientOptions,
	onReady: (webgl: boolean) => void,
) {
	const engine = createPrismGradient(initial);
	const shader = mountShader(root, canvas, engine.scene, onReady);
	return {
		update: (next: PrismGradientOptions) => shader.refresh(engine.set(next)),
		destroy: shader.destroy,
	};
}

let root: HTMLDivElement | undefined = $state();
let canvas: HTMLCanvasElement | undefined = $state();
const gl = canvasEngine(
	mountPrismGradient,
	() => ({ root, canvas }),
	() => options,
);
const s = $derived(prismGradient({ tone, speed, position, webgl: gl.webgl }));
const options: PrismGradientOptions = $derived({
	colors: PRISM_GRADIENT_COLORS[tone],
	speed: PRISM_GRADIENT_SPEED[speed],
	grain,
});
</script>

<div bind:this={root} data-slot="prism-gradient" class={cn(s.root(), classProp)}>
	<div aria-hidden="true" class={s.fallback()}></div>
	<canvas bind:this={canvas} aria-hidden="true" class={s.canvas()}></canvas>
	{#if children}
		<div class={s.content()}>{@render children()}</div>
	{/if}
</div>
