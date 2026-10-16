<script lang="ts">
import { untrack } from "svelte";
import { cn } from "../../lib/svelte/cn";
import Spinner from "../../spinner/svelte/spinner.svelte";
import { createGallery } from "./gallery";
import ItemList from "./item-list.svelte";
import { INFINITE_IMAGE_FIELD_LABELS, type InfiniteImageFieldLabels } from "./labels";
import {
	DEFAULT_LENS,
	type InfiniteImageFieldSize,
	type InfiniteImageItem,
	infiniteImageField,
} from "./variants";

let {
	items,
	size,
	lens = DEFAULT_LENS.gallery,
	cellSize = 0.75,
	dragZoom = 1.25,
	showHint = true,
	labels,
	class: classProp,
}: {
	items: InfiniteImageItem[];
	size?: InfiniteImageFieldSize;
	lens?: number;
	cellSize?: number;
	dragZoom?: number;
	showHint?: boolean;
	labels?: Partial<InfiniteImageFieldLabels>;
	class?: string;
} = $props();

let root: HTMLElement | undefined = $state();
let canvas: HTMLCanvasElement | undefined = $state();
let phase = $state<"loading" | "webgl" | "fallback">("loading");
let gallery: ReturnType<typeof createGallery> | undefined;
const l = $derived({ ...INFINITE_IMAGE_FIELD_LABELS.gallery, ...labels });
const s = $derived(infiniteImageField({ variant: "gallery", size }));
const options = $derived({ cellSize, dragZoom, lens });

$effect(() => {
	const list = items;
	const el = root;
	const surface = canvas;
	if (!el || !surface) return;
	phase = "loading";
	// Options flow through update(); only new items rebuild the atlases.
	gallery = untrack(() =>
		createGallery(el, surface, list, options, (webgl) => {
			phase = webgl ? "webgl" : "fallback";
		}),
	);
	return () => gallery?.destroy();
});

$effect(() => {
	gallery?.update(options);
});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -- focus is how arrow keys pan the grid -->
<section
	bind:this={root}
	data-slot="infinite-image-field"
	data-variant="gallery"
	aria-label={l.label}
	aria-roledescription="gallery"
	aria-busy={phase === "loading"}
	tabindex="0"
	class={cn(s.root(), classProp)}
>
	<ItemList {items} />
	<canvas bind:this={canvas} class={cn(s.canvas(), phase !== "webgl" && "opacity-0")}></canvas>
	{#if phase === "loading"}
		<div class={s.status()}><Spinner label={l.loading} /></div>
	{:else if phase === "fallback"}
		<div class={s.fallback()}>
			{#each items as item, index (index)}
				<figure>
					<img src={item.src} alt={item.alt} class={s.fallbackImage()} />
					<figcaption class={s.fallbackCaption()}>
						<span>{item.title ?? item.alt}</span>
						{#if item.caption}<span>{item.caption}</span>{/if}
					</figcaption>
				</figure>
			{/each}
		</div>
	{:else if showHint}
		<p aria-hidden="true" class={s.hint()}>{l.hint}</p>
	{/if}
</section>
