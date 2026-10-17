<script lang="ts">
import { untrack } from "svelte";
import { cn } from "../../lib/cn";
import { type FisheyeOptions, mountFisheye } from "../fisheye";
import { INFINITE_IMAGE_FIELD_LABELS, type InfiniteImageFieldLabels } from "../labels";
import {
	DEFAULT_LENS,
	type InfiniteImageFieldSize,
	type InfiniteImageItem,
	infiniteImageField,
} from "../variants";
import ItemList from "./item-list.svelte";

let {
	items,
	size,
	imageWidth = 150,
	imageHeight = 180,
	gap = 8,
	lens = DEFAULT_LENS.fisheye,
	inertia = 0.94,
	captions = true,
	labels,
	class: className,
}: {
	items: InfiniteImageItem[];
	size?: InfiniteImageFieldSize;
	imageWidth?: number;
	imageHeight?: number;
	gap?: number;
	lens?: number;
	inertia?: number;
	captions?: boolean;
	labels?: Partial<InfiniteImageFieldLabels>;
	class?: string;
} = $props();

const l = $derived({ ...INFINITE_IMAGE_FIELD_LABELS.fisheye, ...labels });
const s = $derived(infiniteImageField({ variant: "fisheye", size }));
const options: FisheyeOptions = $derived({
	items,
	captions,
	tileWidth: imageWidth,
	tileHeight: imageHeight,
	gap,
	lens,
	inertia,
});

let root = $state<HTMLElement>();
let canvas = $state<HTMLCanvasElement>();
let engine: ReturnType<typeof mountFisheye> | undefined;

$effect(() => {
	if (!root || !canvas) return;
	engine = mountFisheye(
		root,
		canvas,
		untrack(() => $state.snapshot(options)),
	);
	return () => engine?.destroy();
});

$effect(() => {
	const next = $state.snapshot(options);
	engine?.update(next);
});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -- focus is how arrow keys pan the grid -->
<section
	bind:this={root}
	data-slot="infinite-image-field"
	data-variant="fisheye"
	data-dragging="false"
	aria-label={l.label}
	aria-roledescription="gallery"
	tabindex="0"
	class={cn(s.root(), className)}
>
	<ItemList {items} />
	<canvas bind:this={canvas} aria-hidden="true" class={s.canvas()}></canvas>
	<div aria-hidden="true" class={s.vignette()}></div>
</section>
