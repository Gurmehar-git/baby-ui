<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import type { ImageSlotProps } from "../../lib/image";
import {
	type ScrollTiltedGridAspect,
	type ScrollTiltedGridImage,
	type ScrollTiltedGridRadius,
	type ScrollTiltedGridSize,
	scrollTiltedGrid,
	scrubTiles,
} from "../variants";

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
	image,
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
	/** Renders each image, e.g. through your framework's image component; defaults to `<img>`. */
	image?: Snippet<[ImageSlotProps]>;
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
		{#each tiles as tile, i (i)}
			<figure
				data-scroll-tilted-tile=""
				class={scrollTiltedGrid({ side: i % 2 ? "right" : "left" }).figure()}
				style="perspective: {perspective}px; --scroll-tilted-side: {i % 2 ? 1 : -1}; --scroll-tilted-tilt: {maxTilt}; --scroll-tilted-blur: {maxBlur}"
			>
				<div class={s.tile()}>
					{#if image}{@render image({ src: tile.src, alt: tile.alt, className: s.image(), loading: i < 4 ? "eager" : "lazy" })}{:else}<img
						src={tile.src}
						alt={tile.alt}
						class={s.image()}
						loading={i < 4 ? "eager" : "lazy"}
						draggable="false"
					/>{/if}
					<span aria-hidden="true" class={s.sheen()}></span>
				</div>
			</figure>
		{/each}
	</div>
</section>
