<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { mountShader } from "../../lib/shader";
import { canvasEngine } from "../../lib/svelte/canvas-engine.svelte";
import { createPrismOrb, type PrismOrbOptions } from "../orb";
import {
	PRISM_ORB_COLORS,
	PRISM_ORB_SPEED,
	type PrismOrbPosition,
	type PrismOrbSpeed,
	type PrismOrbTone,
	prismOrb,
} from "../variants";

let {
	tone = "chart",
	speed = "normal",
	position = "absolute",
	intensity = 1,
	grain = 0,
	class: classProp,
	children,
}: {
	tone?: PrismOrbTone;
	speed?: PrismOrbSpeed;
	position?: PrismOrbPosition;
	/** Colour strength, 0 (flat base) to 1. */
	intensity?: number;
	/** Film grain, 0 to 1. */
	grain?: number;
	class?: string;
	children?: Snippet;
} = $props();

function mountPrismOrb(
	root: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: PrismOrbOptions,
	onReady: (webgl: boolean) => void,
) {
	const engine = createPrismOrb(initial);
	const shader = mountShader(root, canvas, engine.scene, onReady);
	return {
		update: (next: PrismOrbOptions) => shader.refresh(engine.set(next)),
		destroy: shader.destroy,
	};
}

let root: HTMLDivElement | undefined = $state();
let canvas: HTMLCanvasElement | undefined = $state();
const gl = canvasEngine(
	mountPrismOrb,
	() => ({ root, canvas }),
	() => options,
);
const s = $derived(prismOrb({ tone, speed, position, webgl: gl.webgl }));
const options: PrismOrbOptions = $derived({
	colors: PRISM_ORB_COLORS[tone],
	speed: PRISM_ORB_SPEED[speed],
	intensity,
	grain,
});
</script>

<div bind:this={root} data-slot="prism-orb" class={cn(s.root(), classProp)}>
	<div aria-hidden="true" class={s.fallback()}></div>
	<canvas bind:this={canvas} aria-hidden="true" class={s.canvas()}></canvas>
	{#if children}
		<div class={s.content()}>{@render children()}</div>
	{/if}
</div>
