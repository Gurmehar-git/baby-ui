<script lang="ts">
import { cn } from "../lib/cn";
import {
	type ScrollTiltedGridAspect,
	type ScrollTiltedGridImage,
	type ScrollTiltedGridRadius,
	type ScrollTiltedGridSize,
	scrollTiltedGrid,
	scrubTiles,
} from "./variants";

let {
	images,
	repeat = 1,
	maxTilt = 62,
	maxBlur = 7,
	perspective = 1000,
	size = "default",
	aspect,
	radius,
	label = "Image gallery",
	class: className,
}: {
	images: readonly ScrollTiltedGridImage[];
	/** How many times the image list repeats down the grid. */
	repeat?: number;
	/** Largest X tilt in degrees, reached as a tile enters or leaves. */
	maxTilt?: number;
	/** Largest blur in px at the edges of the scroll box. */
	maxBlur?: number;
	/** CSS perspective on each tile, in px. */
	perspective?: number;
	size?: ScrollTiltedGridSize;
	aspect?: ScrollTiltedGridAspect;
	radius?: ScrollTiltedGridRadius;
	/** Accessible name of the gallery. */
	label?: string;
	class?: string;
} = $props();

let root = $state<HTMLElement>();
const s = $derived(scrollTiltedGrid({ size, aspect, radius }));
const tiles = $derived(Array.from({ length: Math.max(1, repeat) }, () => images).flat());
const count = $derived(tiles.length);

$effect(() => {
	void size;
	if (!root || count === 0) return;
	return scrubTiles(root);
});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<section
	bind:this={root}
	data-slot="scroll-tilted-grid"
	aria-label={label}
	tabindex={size === "auto" ? undefined : 0}
	class={cn(s.root(), className)}
>
	<div class={s.grid()}>
		{#each tiles as image, i (i)}
			<figure
				data-scroll-tilted-tile=""
				class={scrollTiltedGrid({ side: i % 2 ? "right" : "left" }).figure()}
				style="perspective: {perspective}px; --scroll-tilted-side: {i % 2 ? 1 : -1}; --scroll-tilted-tilt: {maxTilt}; --scroll-tilted-blur: {maxBlur}"
			>
				<div class={s.tile()}>
					<img
						src={image.src}
						alt={image.alt}
						class={s.image()}
						loading={i < 4 ? "eager" : "lazy"}
						draggable="false"
					/>
					<span aria-hidden="true" class={s.sheen()}></span>
				</div>
			</figure>
		{/each}
	</div>
</section>
