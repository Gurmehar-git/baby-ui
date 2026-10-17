<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { canvasEngine } from "../../lib/svelte/canvas-engine.svelte";
import { mountSpectralRibbon, type SpectralRibbonOptions } from "../ribbon";
import {
	SPECTRAL_RIBBON_COLORS,
	SPECTRAL_RIBBON_SPEED,
	type SpectralRibbonPosition,
	type SpectralRibbonSpeed,
	type SpectralRibbonTone,
	spectralRibbon,
} from "../variants";

let {
	tone = "spectrum",
	speed = "normal",
	position = "absolute",
	intensity = 1,
	thickness = 1,
	grain = 0.45,
	class: classProp,
	children,
}: {
	tone?: SpectralRibbonTone;
	speed?: SpectralRibbonSpeed;
	position?: SpectralRibbonPosition;
	/** Ribbon brightness, 0.25 to 2. */
	intensity?: number;
	/** Ribbon thickness, 0.5 to 2. */
	thickness?: number;
	/** Film grain, 0 to 1. */
	grain?: number;
	class?: string;
	children?: Snippet;
} = $props();

let root: HTMLDivElement | undefined = $state();
let canvas: HTMLCanvasElement | undefined = $state();
const gl = canvasEngine(
	mountSpectralRibbon,
	() => ({ root, canvas }),
	() => options,
);
const s = $derived(spectralRibbon({ tone, speed, position, webgl: gl.webgl }));
const options: SpectralRibbonOptions = $derived({
	colors: SPECTRAL_RIBBON_COLORS[tone],
	speed: SPECTRAL_RIBBON_SPEED[speed],
	intensity,
	thickness,
	grain,
});
</script>

<div bind:this={root} data-slot="spectral-ribbon" class={cn(s.root(), classProp)}>
	<div aria-hidden="true" class={s.fallback()}></div>
	<canvas bind:this={canvas} aria-hidden="true" class={s.canvas()}></canvas>
	{#if children}
		<div class={s.content()}>{@render children()}</div>
	{/if}
</div>
