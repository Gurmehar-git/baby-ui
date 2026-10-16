<script lang="ts">
import type { Snippet } from "svelte";
import { canvasEngine } from "../../lib/svelte/canvas-engine.svelte";
import { cn } from "../../lib/svelte/cn";
import {
	CHROMATIC_WAVE_COLORS,
	CHROMATIC_WAVE_SPEED,
	type ChromaticWavePosition,
	type ChromaticWaveSpeed,
	type ChromaticWaveTone,
	chromaticWave,
} from "./variants";
import { type ChromaticWaveOptions, mountChromaticWave } from "./wave";

let {
	tone = "spectrum",
	speed = "normal",
	position = "absolute",
	intensity = 1,
	grain = 0,
	class: classProp,
	children,
}: {
	tone?: ChromaticWaveTone;
	speed?: ChromaticWaveSpeed;
	position?: ChromaticWavePosition;
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
	mountChromaticWave,
	() => ({ root, canvas }),
	() => options,
);
const s = $derived(chromaticWave({ tone, speed, position, webgl: gl.webgl }));
const options: ChromaticWaveOptions = $derived({
	colors: CHROMATIC_WAVE_COLORS[tone],
	speed: CHROMATIC_WAVE_SPEED[speed],
	intensity,
	grain,
});
</script>

<div bind:this={root} data-slot="chromatic-wave" class={cn(s.root(), classProp)}>
	<div aria-hidden="true" class={s.fallback()}></div>
	<canvas bind:this={canvas} aria-hidden="true" class={s.canvas()}></canvas>
	{#if children}
		<div class={s.content()}>{@render children()}</div>
	{/if}
</div>
