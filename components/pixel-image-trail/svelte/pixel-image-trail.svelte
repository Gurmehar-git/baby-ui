<script lang="ts">
import type { Snippet } from "svelte";
import { untrack } from "svelte";
import { cn } from "../../lib/svelte/cn";
import {
	mountPixelTrail,
	type PixelImageTrailSize,
	type PixelImageTrailVariant,
	type PixelTrailOptions,
	pixelImageTrail,
} from "./pixel-trail";

let {
	src,
	alt,
	pixelSize = 36,
	radius = 40,
	fadeDuration = 900,
	maxPixels = 84,
	initialPixels = 24,
	variant = "fade",
	size,
	class: className,
	children,
}: {
	/** Image revealed square by square under the pointer. */
	src: string;
	/** Accessible description of the image. */
	alt: string;
	/** Edge of one square, in px (at least 12). */
	pixelSize?: number;
	/** Reveal reach in px: squares whose centre lies this close to the pointer show; 0 is one square. */
	radius?: number;
	/** Time in ms before a trail square has fully faded. */
	fadeDuration?: number;
	/** Most trail squares kept at once; the oldest drop first. */
	maxPixels?: number;
	/** Dimmed fragments shown before any interaction. */
	initialPixels?: number;
	variant?: PixelImageTrailVariant;
	size?: PixelImageTrailSize;
	class?: string;
	children?: Snippet;
} = $props();

const s = $derived(pixelImageTrail({ variant, size }));
const options: PixelTrailOptions = $derived({
	pixelSize,
	radius,
	fadeDuration,
	maxPixels,
	initialPixels,
	variant,
});

let root = $state<HTMLDivElement>();
let canvas = $state<HTMLCanvasElement>();
let image = $state<HTMLImageElement>();
let trail: ReturnType<typeof mountPixelTrail> | undefined;

$effect(() => {
	if (!root || !canvas || !image) return;
	trail = mountPixelTrail(
		root,
		canvas,
		image,
		untrack(() => $state.snapshot(options)),
	);
	return () => trail?.destroy();
});

$effect(() => {
	const next = $state.snapshot(options);
	trail?.update(next);
});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	bind:this={root}
	data-slot="pixel-image-trail"
	role="group"
	aria-label={alt}
	tabindex="0"
	class={cn(s.root(), className)}
>
	<img bind:this={image} {src} alt="" draggable="false" class={s.image()} />
	<canvas bind:this={canvas} aria-hidden="true" class={s.canvas()}></canvas>
	{#if children}
		<div class={s.content()}>{@render children()}</div>
	{/if}
</div>
