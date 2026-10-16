<script lang="ts">
import type { Snippet } from "svelte";
import { canvasEngine } from "../../lib/svelte/canvas-engine.svelte";
import { cn } from "../../lib/svelte/cn";
import { mountWebglLiquid, type WebglLiquidOptions } from "./liquid";
import {
	WEBGL_LIQUID_COLORS,
	WEBGL_LIQUID_SPEED,
	type WebglLiquidPosition,
	type WebglLiquidSpeed,
	type WebglLiquidTone,
	webglLiquid,
} from "./variants";

let {
	tone = "ocean",
	speed = "normal",
	position = "absolute",
	flow = 1,
	grain = 0.05,
	reveal = true,
	class: classProp,
	children,
}: {
	tone?: WebglLiquidTone;
	speed?: WebglLiquidSpeed;
	position?: WebglLiquidPosition;
	/** Large-scale flow and glow strength, 0 to 2. */
	flow?: number;
	/** Dither amount, 0 to 0.2. */
	grain?: number;
	/** Sweep the field in from the left the first time it is on screen. */
	reveal?: boolean;
	class?: string;
	children?: Snippet;
} = $props();

let root: HTMLDivElement | undefined = $state();
let canvas: HTMLCanvasElement | undefined = $state();
const gl = canvasEngine(
	mountWebglLiquid,
	() => ({ root, canvas }),
	() => options,
);
const s = $derived(webglLiquid({ tone, speed, position, webgl: gl.webgl }));
const options: WebglLiquidOptions = $derived({
	colors: WEBGL_LIQUID_COLORS[tone],
	speed: WEBGL_LIQUID_SPEED[speed],
	flow,
	grain,
	reveal,
});
</script>

<div bind:this={root} data-slot="webgl-liquid" class={cn(s.root(), classProp)}>
	<div aria-hidden="true" class={s.fallback()}></div>
	<canvas bind:this={canvas} aria-hidden="true" class={s.canvas()}></canvas>
	{#if children}
		<div class={s.content()}>{@render children()}</div>
	{/if}
</div>
