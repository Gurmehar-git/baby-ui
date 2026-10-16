<script lang="ts">
import { untrack } from "svelte";
import { cn } from "../../lib/svelte/cn";
import {
	mountParticles,
	type ParticleOptions,
	type ParticleTextShape,
	type ParticleTextSize,
	particleText,
} from "./particles";

let {
	text,
	fontSize = 120,
	particleSize = 1.5,
	density = 6,
	strength = 15,
	radius = 120,
	returnSpeed = 0.08,
	shape = "circle",
	size,
	class: className,
}: {
	text: string;
	/** Largest font size in px; shrinks to fit narrow containers. */
	fontSize?: number;
	/** Radius of each particle, in px. */
	particleSize?: number;
	/** Sampling step in px: lower means more particles. */
	density?: number;
	/** How hard the pointer pushes particles inside `radius`. */
	strength?: number;
	/** Pointer influence radius, in px. */
	radius?: number;
	/** Spring pull back home per frame, 0 to 1. */
	returnSpeed?: number;
	shape?: ParticleTextShape;
	size?: ParticleTextSize;
	class?: string;
} = $props();

const s = $derived(particleText({ shape, size }));
const options: ParticleOptions = $derived({
	text,
	fontSize,
	particleSize,
	density,
	strength,
	radius,
	returnSpeed,
	shape,
});

let root = $state<HTMLDivElement>();
let canvas = $state<HTMLCanvasElement>();
let field: ReturnType<typeof mountParticles> | undefined;

$effect(() => {
	if (!root || !canvas) return;
	// Mount once; later option changes go through update() below.
	field = mountParticles(
		root,
		canvas,
		untrack(() => $state.snapshot(options)),
	);
	return () => field?.destroy();
});

$effect(() => {
	const next = $state.snapshot(options);
	field?.update(next);
});
</script>

<div bind:this={root} data-slot="particle-text" class={cn(s.root(), className)}>
	<span class={s.srOnly()}>{text}</span>
	<canvas bind:this={canvas} aria-hidden="true" class={s.canvas()}></canvas>
</div>
