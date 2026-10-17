<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { canvasEngine } from "../../lib/svelte/canvas-engine.svelte";
import { type LightCausticsOptions, mountLightCaustics } from "../caustics";
import {
	LIGHT_CAUSTICS_COLORS,
	LIGHT_CAUSTICS_SPEED,
	type LightCausticsPosition,
	type LightCausticsSpeed,
	type LightCausticsTone,
	lightCaustics,
} from "../variants";

let {
	tone = "ocean",
	speed = "normal",
	position = "absolute",
	intensity = 1,
	grain = 0,
	class: classProp,
	children,
}: {
	tone?: LightCausticsTone;
	speed?: LightCausticsSpeed;
	position?: LightCausticsPosition;
	/** Effect strength, 0 to 2. */
	intensity?: number;
	/** Film grain, 0 to 1. */
	grain?: number;
	class?: string;
	children?: Snippet;
} = $props();

let root: HTMLDivElement | undefined = $state();
let canvas: HTMLCanvasElement | undefined = $state();
const gl = canvasEngine(
	mountLightCaustics,
	() => ({ root, canvas }),
	() => options,
);
const s = $derived(lightCaustics({ tone, speed, position, webgl: gl.webgl }));
const options: LightCausticsOptions = $derived({
	colors: LIGHT_CAUSTICS_COLORS[tone],
	speed: LIGHT_CAUSTICS_SPEED[speed],
	intensity,
	grain,
});
</script>

<div bind:this={root} data-slot="light-caustics" class={cn(s.root(), classProp)}>
	<div aria-hidden="true" class={s.fallback()}></div>
	<canvas bind:this={canvas} aria-hidden="true" class={s.canvas()}></canvas>
	{#if children}
		<div class={s.content()}>{@render children()}</div>
	{/if}
</div>
