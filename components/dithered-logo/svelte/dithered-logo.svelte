<script lang="ts">
import { untrack } from "svelte";
import { cn } from "../../lib/svelte/cn";
import { type DitherOptions, mountDither } from "./dither";
import {
	type DitheredLogoSize,
	type DitheredLogoTone,
	type DitheredLogoVariant,
	ditheredLogo,
} from "./variants";

let {
	src,
	alt,
	variant = "solid",
	tone = "foreground",
	size,
	gridSize = 96,
	scale = 0.7,
	dotScale = 0.8,
	threshold = 0.5,
	blur = 1.5,
	cornerRadius = 0.2,
	radius = 100,
	class: className,
}: {
	/** Logo image URL, SVG or data URI; remote images need CORS headers. */
	src: string;
	/** Accessible name for the logo. */
	alt: string;
	/** `solid` dots the logo; `inverted` dots a plate and knocks the logo out. */
	variant?: DitheredLogoVariant;
	/** Theme token the dots are drawn in. */
	tone?: DitheredLogoTone;
	size?: DitheredLogoSize;
	/** Dots across the longer side of the logo. */
	gridSize?: number;
	/** Share of the shorter box side the logo fills, 0 to 1. */
	scale?: number;
	/** Dot size relative to its grid cell. */
	dotScale?: number;
	/** Ink level, 0 to 1, a cell needs to become a dot. */
	threshold?: number;
	/** Edge softening before dithering, in grid cells. */
	blur?: number;
	/** Corner radius of the inverted plate, as a share of its shorter side. */
	cornerRadius?: number;
	/** Pointer influence radius, in px. */
	radius?: number;
	class?: string;
} = $props();

const s = $derived(ditheredLogo({ variant, tone, size }));
const options: DitherOptions = $derived({
	src,
	variant,
	gridSize,
	scale,
	dotScale,
	threshold,
	blur,
	cornerRadius,
	radius,
});

let root = $state<HTMLDivElement>();
let canvas = $state<HTMLCanvasElement>();
let engine: ReturnType<typeof mountDither> | undefined;

$effect(() => {
	if (!root || !canvas) return;
	engine = mountDither(
		root,
		canvas,
		untrack(() => $state.snapshot(options)),
	);
	return () => engine?.destroy();
});

$effect(() => {
	void tone;
	const next = $state.snapshot(options);
	engine?.update(next);
});
</script>

<div
	bind:this={root}
	role="img"
	aria-label={alt}
	data-slot="dithered-logo"
	class={cn(s.root(), className)}
>
	<canvas bind:this={canvas} aria-hidden="true" class={s.canvas()}></canvas>
</div>
