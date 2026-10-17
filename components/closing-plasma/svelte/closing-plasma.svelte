<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { canvasEngine } from "../../lib/svelte/canvas-engine.svelte";
import { type ClosingPlasmaOptions, mountClosingPlasma } from "../plasma";
import {
	CLOSING_PLASMA_COLORS,
	CLOSING_PLASMA_SPEED,
	type ClosingPlasmaPosition,
	type ClosingPlasmaSpeed,
	type ClosingPlasmaTone,
	closingPlasma,
} from "../variants";

let {
	tone = "chart",
	speed = "normal",
	position = "absolute",
	turbulence = 1,
	sparkle = 1,
	grain = 1,
	interactive = true,
	class: classProp,
	children,
}: {
	tone?: ClosingPlasmaTone;
	speed?: ClosingPlasmaSpeed;
	position?: ClosingPlasmaPosition;
	/** Noise frequency growth per octave, 0 to 2. */
	turbulence?: number;
	/** Sparkle strength, 0 to 2. */
	sparkle?: number;
	/** Film grain, 0 to 2. */
	grain?: number;
	/** The field leans toward the pointer. */
	interactive?: boolean;
	class?: string;
	children?: Snippet;
} = $props();

let root: HTMLDivElement | undefined = $state();
let canvas: HTMLCanvasElement | undefined = $state();
const gl = canvasEngine(
	mountClosingPlasma,
	() => ({ root, canvas }),
	() => options,
);
const s = $derived(closingPlasma({ tone, speed, position, webgl: gl.webgl }));
const options: ClosingPlasmaOptions = $derived({
	colors: CLOSING_PLASMA_COLORS[tone],
	speed: CLOSING_PLASMA_SPEED[speed],
	turbulence,
	sparkle,
	grain,
	interactive,
});
</script>

<div bind:this={root} data-slot="closing-plasma" class={cn(s.root(), classProp)}>
	<div aria-hidden="true" class={s.fallback()}></div>
	<canvas bind:this={canvas} aria-hidden="true" class={s.canvas()}></canvas>
	{#if children}
		<div class={s.content()}>{@render children()}</div>
	{/if}
</div>
