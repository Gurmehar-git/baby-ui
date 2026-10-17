<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { onScrollFrame } from "../../lib/scroll-frame";
import {
	type CollectionSurferItem,
	surfNearness,
	surfShift,
	wrapSurfScroll,
} from "../types";
import {
	type CollectionSurferSize,
	type CollectionSurferVariant,
	collectionSurfer,
} from "../variants";
import { setCollectionSurfer } from "./context";

let {
	items,
	variant = "magnetic",
	size = "default",
	scrollPerItem = 300,
	label = "Collection",
	class: classProp,
	children,
}: {
	items: CollectionSurferItem[];
	/** How cards react to the pointer: grow, lift, or not at all. */
	variant?: CollectionSurferVariant;
	size?: CollectionSurferSize;
	/** Scroll distance in px that moves the line one card forward. */
	scrollPerItem?: number;
	/** Accessible name of the scroll region. */
	label?: string;
	class?: string;
	children?: Snippet;
} = $props();

let root = $state<HTMLElement>();
let stage = $state<HTMLDivElement>();
const count = $derived(items.length);
const loop = $derived(count * scrollPerItem);
const s = $derived(collectionSurfer({ variant, size }));
setCollectionSurfer({
	get items() {
		return items;
	},
	get styles() {
		return s;
	},
});

$effect(() => {
	const scroller = root;
	const el = stage;
	const n = count;
	const perItem = scrollPerItem;
	const span = loop;
	const kind = variant;
	if (!scroller || !el || !span) return;
	let pointer: { x: number; y: number } | null = null;
	let raf = 0;
	const reactive = () =>
		kind !== "simple" && !matchMedia("(prefers-reduced-motion: reduce)").matches;
	const measure = () => {
		raf = 0;
		for (const card of el.querySelectorAll<HTMLElement>("[data-surf-card]")) {
			const near =
				pointer && reactive()
					? surfNearness(card.getBoundingClientRect(), pointer.x, pointer.y)
					: 0;
			card.style.setProperty("--near", near.toFixed(3));
		}
	};
	const schedule = () => {
		if (!raf) raf = requestAnimationFrame(measure);
	};
	const onMove = (event: PointerEvent) => {
		pointer = { x: event.clientX, y: event.clientY };
		schedule();
	};
	const onLeave = () => {
		pointer = null;
		schedule();
	};
	const stop = onScrollFrame(scroller, () => {
		const wrapped = wrapSurfScroll(scroller.scrollTop, span);
		if (wrapped !== null) scroller.scrollTop = wrapped;
		el.style.setProperty(
			"--cs-shift",
			surfShift(scroller.scrollTop, perItem, n).toFixed(4),
		);
		if (pointer) schedule();
	});
	el.addEventListener("pointermove", onMove);
	el.addEventListener("pointerleave", onLeave);
	measure();
	return () => {
		stop();
		cancelAnimationFrame(raf);
		el.removeEventListener("pointermove", onMove);
		el.removeEventListener("pointerleave", onLeave);
	};
});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<section
	bind:this={root}
	data-slot="collection-surfer"
	aria-label={label}
	tabindex="0"
	class={cn(s.root(), classProp)}
>
	<div bind:this={stage} class={s.stage()}>
		{@render children?.()}
	</div>
	<div aria-hidden="true" style="height: {loop * 3}px;"></div>
</section>
