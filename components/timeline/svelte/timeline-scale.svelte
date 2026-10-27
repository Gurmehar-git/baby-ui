<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { SvelteMap } from "svelte/reactivity";
import { cn } from "../../lib/cn";
import {
	type TimelineOrientation,
	type TimelineScaleVariant,
	timelineScale,
} from "../variants";
import { setTimelineScale, type TimelineScaleEntry } from "./context";

let {
	children,
	orientation = "horizontal",
	variant = "default",
	defaultValue,
	value = $bindable(defaultValue),
	onValueChange,
	itemSize = "18rem",
	class: classProp,
	...rest
}: HTMLAttributes<HTMLElement> & {
	children: Snippet;
	orientation?: TimelineOrientation;
	variant?: TimelineScaleVariant;
	/** Active item id. Bindable. */
	value?: string;
	/** Initially active item id. The first registered item is used when omitted. */
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	/** Preferred horizontal item width. */
	itemSize?: number | string;
} = $props();

const items = new SvelteMap<string, TimelineScaleEntry>();
// Set while select() smooth-scrolls, so items passed on the way never become active.
let pending: string | null = null;
const active = $derived(value);
const size = $derived(typeof itemSize === "number" ? `${itemSize}px` : itemSize);
const s = $derived(timelineScale({ orientation, variant }));

function setValue(next: string) {
	value = next;
	onValueChange?.(next);
}

function register(entry: TimelineScaleEntry) {
	items.set(entry.id, entry);
	if (value === undefined && items.size === 1) value = entry.id;
	return () => {
		items.delete(entry.id);
	};
}

function select(id: string, focus = false) {
	const entry = items.get(id);
	if (!entry) return;
	const { element: item } = entry;
	setValue(id);
	pending = id;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
	item.scrollIntoView({
		behavior: reduced ? "auto" : "smooth",
		block: "nearest",
		inline: "nearest",
	});
	if (focus) item.focus({ preventScroll: true });
}

function move(event: KeyboardEvent, id: string) {
	const forward = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
	const backward = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
	if (![forward, backward, "Home", "End"].includes(event.key)) return;
	const ids = [...items.keys()];
	const index = ids.indexOf(id);
	if (index < 0) return;
	const last = ids.length - 1;
	const next =
		event.key === "Home"
			? 0
			: event.key === "End"
				? last
				: Math.min(Math.max(index + (event.key === forward ? 1 : -1), 0), last);
	if (next === index) return;
	event.preventDefault();
	const nextId = ids[next];
	if (nextId) select(nextId, true);
}

function syncViewport(viewport: HTMLElement) {
	const viewportRect = viewport.getBoundingClientRect();
	const center =
		orientation === "horizontal"
			? viewportRect.left + viewportRect.width / 2
			: viewportRect.top + viewportRect.height / 2;
	let nearest = "";
	let distance = Number.POSITIVE_INFINITY;
	for (const [id, item] of items) {
		const rect = item.element.getBoundingClientRect();
		const itemCenter =
			orientation === "horizontal"
				? rect.left + rect.width / 2
				: rect.top + rect.height / 2;
		const nextDistance = Math.abs(itemCenter - center);
		if (nextDistance >= distance) continue;
		distance = nextDistance;
		nearest = id;
	}
	if (pending) {
		if (nearest === pending) pending = null;
		return;
	}
	if (nearest && nearest !== active) setValue(nearest);
}

setTimelineScale({
	get orientation() {
		return orientation;
	},
	get variant() {
		return variant;
	},
	get active() {
		return active;
	},
	get entries() {
		return [...items.values()];
	},
	register,
	select,
	move,
	syncViewport,
	release: () => {
		pending = null;
	},
});
</script>

<section
	data-slot="timeline-scale"
	data-orientation={orientation}
	class={cn(s.root(), classProp)}
	style:--timeline-item-size={size}
	{...rest}
>
	{@render children()}
</section>
