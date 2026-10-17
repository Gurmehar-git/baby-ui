<script lang="ts">
import { untrack } from "svelte";
import { cn } from "../../lib/cn";
import { type FieldOptions, mountField } from "../field";
import { INFINITE_IMAGE_FIELD_LABELS, type InfiniteImageFieldLabels } from "../labels";
import {
	type InfiniteImageFieldLayout,
	type InfiniteImageFieldShape,
	type InfiniteImageFieldSize,
	type InfiniteImageItem,
	infiniteImageField,
} from "../variants";
import ItemList from "./item-list.svelte";

let {
	items,
	shape = "rounded",
	layout = "grid",
	size,
	imageWidth = 160,
	imageHeight = 220,
	gap = 24,
	maxSpeed = 5,
	smoothing = 0.07,
	labels,
	class: className,
}: {
	items: InfiniteImageItem[];
	shape?: InfiniteImageFieldShape;
	layout?: InfiniteImageFieldLayout;
	size?: InfiniteImageFieldSize;
	imageWidth?: number;
	imageHeight?: number;
	gap?: number;
	maxSpeed?: number;
	smoothing?: number;
	labels?: Partial<InfiniteImageFieldLabels>;
	class?: string;
} = $props();

const l = $derived({ ...INFINITE_IMAGE_FIELD_LABELS.drift, ...labels });
const s = $derived(infiniteImageField({ variant: "drift", shape, layout, size }));
const options: FieldOptions = $derived({
	images: items.map((item) => item.src),
	shape,
	layout,
	imageWidth,
	imageHeight,
	gap,
	maxSpeed,
	smoothing,
});

let root = $state<HTMLElement>();
let canvas = $state<HTMLCanvasElement>();
let engine: ReturnType<typeof mountField> | undefined;

$effect(() => {
	if (!root || !canvas) return;
	engine = mountField(
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

<!-- svelte-ignore a11y_no_noninteractive_tabindex -- focus is how arrow keys drift the field -->
<section
	bind:this={root}
	data-slot="infinite-image-field"
	data-variant="drift"
	aria-label={l.label}
	tabindex="0"
	class={cn(s.root(), className)}
>
	<ItemList {items} />
	<canvas bind:this={canvas} aria-hidden="true" class={s.canvas()}></canvas>
</section>
