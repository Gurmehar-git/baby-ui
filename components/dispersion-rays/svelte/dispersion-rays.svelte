<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { mountShader } from "../../lib/shader";
import { canvasEngine } from "../../lib/svelte/canvas-engine.svelte";
import { createDispersionRays, type DispersionRaysOptions } from "../rays";
import {
	DISPERSION_RAYS_COLORS,
	DISPERSION_RAYS_SPEED,
	type DispersionRaysPosition,
	type DispersionRaysSpeed,
	type DispersionRaysTone,
	dispersionRays,
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
	tone?: DispersionRaysTone;
	speed?: DispersionRaysSpeed;
	position?: DispersionRaysPosition;
	/** Colour strength, 0 (flat base) to 1. */
	intensity?: number;
	/** Film grain, 0 to 1. */
	grain?: number;
	class?: string;
	children?: Snippet;
} = $props();

function mountDispersionRays(
	root: HTMLElement,
	canvas: HTMLCanvasElement,
	initial: DispersionRaysOptions,
	onReady: (webgl: boolean) => void,
) {
	const engine = createDispersionRays(initial);
	const shader = mountShader(root, canvas, engine.scene, onReady);
	return {
		update: (next: DispersionRaysOptions) => shader.refresh(engine.set(next)),
		destroy: shader.destroy,
	};
}

let root: HTMLDivElement | undefined = $state();
let canvas: HTMLCanvasElement | undefined = $state();
const gl = canvasEngine(
	mountDispersionRays,
	() => ({ root, canvas }),
	() => options,
);
const s = $derived(dispersionRays({ tone, speed, position, webgl: gl.webgl }));
const options: DispersionRaysOptions = $derived({
	colors: DISPERSION_RAYS_COLORS[tone],
	speed: DISPERSION_RAYS_SPEED[speed],
	intensity,
	grain,
});
</script>

<div bind:this={root} data-slot="dispersion-rays" class={cn(s.root(), classProp)}>
	<div aria-hidden="true" class={s.fallback()}></div>
	<canvas bind:this={canvas} aria-hidden="true" class={s.canvas()}></canvas>
	{#if children}
		<div class={s.content()}>{@render children()}</div>
	{/if}
</div>
