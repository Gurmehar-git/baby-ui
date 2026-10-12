<script lang="ts">
import { untrack } from "svelte";
import { cn } from "../lib/cn";
import type { WheelCarouselItem } from "./types";
import {
	type WheelCarouselAspect,
	type WheelCarouselPhotoSide,
	type WheelCarouselSize,
	wheelCarousel,
} from "./variants";
import { createWheel } from "./wheel";

let {
	items,
	activeIndex = $bindable(0),
	onActiveIndexChange,
	photoSide = "left",
	aspect = "3/4",
	size = "default",
	photoWidth = 24,
	radius = 320,
	spacing = 14,
	visibleItems = 7,
	apexInset = 34,
	showMarker = true,
	scrollSpeed = 0.008,
	dragSpeed = 0.02,
	snap = true,
	momentum = true,
	label = "Carousel",
	class: classProp,
}: {
	items: WheelCarouselItem[];
	/** Selected index; bindable. */
	activeIndex?: number;
	onActiveIndexChange?: (index: number, item: WheelCarouselItem) => void;
	photoSide?: WheelCarouselPhotoSide;
	aspect?: WheelCarouselAspect;
	size?: WheelCarouselSize;
	/** Photo column width, as a share of the row, 0 to 100. */
	photoWidth?: number;
	/** Distance from the apex to the wheel's centre, px. */
	radius?: number;
	/** Degrees between neighbouring labels. */
	spacing?: number;
	/** Labels drawn either side of the selected one. */
	visibleItems?: number;
	/** Horizontal position of the apex, as a share of the list's width. */
	apexInset?: number;
	showMarker?: boolean;
	/** Rotation per wheel pixel; 0 leaves page scroll alone over the carousel. */
	scrollSpeed?: number;
	dragSpeed?: number;
	snap?: boolean;
	momentum?: boolean;
	/** Accessible name of the list. */
	label?: string;
	class?: string;
} = $props();

const LEAVE_MS = 320;
const id = $props.id();
let stage: HTMLDivElement | undefined = $state();
let list: HTMLDivElement | undefined = $state();
let wheel: ReturnType<typeof createWheel> | undefined;
// svelte-ignore state_referenced_locally -- seeds the first photo; later changes crossfade
let current = $state(activeIndex);
// svelte-ignore state_referenced_locally -- seeds the first photo; later changes crossfade
let layers = $state([{ index: activeIndex, leaving: false }]);
const s = $derived(wheelCarousel({ photoSide, aspect, size }));
const onSelect = (index: number) => {
	current = index;
	activeIndex = index;
	const item = items[index];
	if (item) onActiveIndexChange?.(index, item);
};
const options = $derived({
	radius,
	spacing,
	visibleItems,
	apexInset,
	scrollSpeed,
	dragSpeed,
	snap,
	momentum,
	onSelect,
});
const selected = $derived(items[current]);

$effect(() => {
	const el = stage;
	const rows = list;
	if (!el || !rows) return;
	// Options flow through update(); recreating would drop the wheel's position.
	wheel = untrack(() => createWheel(el, rows, activeIndex, options));
	return () => wheel?.destroy();
});

$effect(() => {
	wheel?.update(options);
});

$effect(() => {
	void items.length;
	untrack(() => wheel?.refresh());
});

$effect(() => {
	const target = activeIndex;
	if (target !== untrack(() => current)) untrack(() => wheel?.goTo(target));
});

// Crossfade: the new photo fades in over the old, which fades out and is then dropped.
$effect(() => {
	const next = current;
	untrack(() => {
		if (layers.at(-1)?.index === next) return;
		layers = [
			...layers.map((layer) => ({ ...layer, leaving: true })),
			{ index: next, leaving: false },
		];
	});
	const timer = setTimeout(
		() => (layers = layers.filter((layer) => !layer.leaving)),
		LEAVE_MS,
	);
	return () => clearTimeout(timer);
});
</script>

<div data-slot="wheel-carousel" class={cn(s.root(), classProp)} style:--photo-width="{photoWidth}%">
	<!-- The stage takes drag, wheel and keys; the listbox is the labels alone, so it owns only options. -->
	<div bind:this={stage} class={s.stage()}>
		<div class={s.photoCol()}>
			<div class={s.photo()}>
				{#each layers as layer (`${layer.index}-${items[layer.index]?.image}`)}
					{@const item = items[layer.index]}
					{#if item}
						<img
							src={item.image}
							alt={layer.leaving ? "" : (item.imageAlt ?? item.label)}
							draggable="false"
							data-leaving={layer.leaving || undefined}
							class={s.image()}
						/>
					{/if}
				{/each}
			</div>
		</div>
		<div
			bind:this={list}
			role="listbox"
			aria-label={label}
			aria-activedescendant={selected ? `${id}-${current}` : undefined}
			tabindex="0"
			class={s.list()}
		>
			{#if showMarker}
				<span aria-hidden="true" class={s.marker()} style:left="calc({apexInset}% - 20px)"></span>
			{/if}
			{#each items as item, index (index)}
				<div
					id="{id}-{index}"
					role="option"
					aria-selected={index === current}
					data-wheel-item=""
					class={s.item()}
				>
					{item.label}
				</div>
			{/each}
		</div>
	</div>
	<span class="sr-only" aria-live="polite">
		{selected ? `${selected.label}, ${current + 1} of ${items.length}` : ""}
	</span>
</div>
