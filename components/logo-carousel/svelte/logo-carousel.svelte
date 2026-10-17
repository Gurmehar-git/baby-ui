<script lang="ts">
import type { Snippet } from "svelte";
import Button from "../../button/svelte/button.svelte";
import DraggableMarquee from "../../draggable-marquee/svelte/draggable-marquee.svelte";
import { cn } from "../../lib/cn";
import {
	type LogoCarouselTone,
	type LogoCarouselVariant,
	logoCarousel,
} from "../variants";
import LogoColumn from "./logo-column.svelte";

const CYCLE_INTERVAL_MS = 1600;
const STAGGER_MS = 125;

let {
	items,
	logo,
	columnCount = 4,
	direction = "ltr",
	variant = "columns",
	tone = "color",
	paused = $bindable(),
	onPausedChange,
	pauseControl,
	label = "Logos",
	class: className,
}: {
	/** Distributed round-robin across `columnCount` columns. */
	items: unknown[];
	/** Renders one logo from an `items` entry. */
	logo: Snippet<[unknown]>;
	columnCount?: number;
	/** Which edge the per-column stagger counts from. */
	direction?: "ltr" | "rtl";
	/** `columns` cycles logos in place; `marquee` drifts them past in one strip. */
	variant?: LogoCarouselVariant;
	tone?: LogoCarouselTone;
	/** Holds the motion still. Bindable. */
	paused?: boolean;
	onPausedChange?: (paused: boolean) => void;
	/** A Pause / Play button under the logos; on by default for the marquee. */
	pauseControl?: boolean;
	/** Accessible name of the marquee strip. */
	label?: string;
	class?: string;
} = $props();

const s = $derived(logoCarousel({ variant, tone }));
let ownPaused = $state(false);
const held = $derived(paused ?? ownPaused);
const showPause = $derived(pauseControl ?? variant === "marquee");
function togglePaused() {
	if (paused === undefined) ownPaused = !held;
	else paused = !held;
	onPausedChange?.(!held);
}

function distribute(list: unknown[], count: number): unknown[][] {
	const n = Math.min(count, list.length);
	const columns: unknown[][] = Array.from({ length: n }, () => []);
	list.forEach((item, index) => {
		columns[index % n]?.push(item);
	});
	return columns;
}

const columns = $derived(distribute(items, columnCount));

let containerEl = $state<HTMLDivElement>();
let inView = $state(false);
$effect(() => {
	const el = containerEl;
	if (!el) return;
	const observer = new IntersectionObserver(
		([entry]) => {
			inView = entry?.isIntersecting ?? false;
		},
		{ rootMargin: "100px" },
	);
	observer.observe(el);
	return () => observer.disconnect();
});

let reduced = $state(false);
$effect(() => {
	const query = window.matchMedia("(prefers-reduced-motion: reduce)");
	reduced = query.matches;
	const onChange = () => {
		reduced = query.matches;
	};
	query.addEventListener("change", onChange);
	return () => query.removeEventListener("change", onChange);
});

let pageVisible = $state(true);
$effect(() => {
	const onChange = () => {
		pageVisible = document.visibilityState === "visible";
	};
	onChange();
	document.addEventListener("visibilitychange", onChange);
	return () => document.removeEventListener("visibilitychange", onChange);
});

const shouldPlay = $derived(inView && pageVisible && !reduced && !held);

// svelte-ignore state_referenced_locally -- one-time seed, resized lazily by the tick below
let indices = $state<number[]>(columns.map(() => 0));

$effect(() => {
	if (!shouldPlay) return;
	const id = setInterval(() => {
		indices = columns.map((col, i) => ((indices[i] ?? 0) + 1) % Math.max(1, col.length));
	}, CYCLE_INTERVAL_MS);
	return () => clearInterval(id);
});
</script>

{#snippet strip()}
	{#if variant === "marquee"}
		<DraggableMarquee speed={held ? 0 : 0.5} gap="lg" pauseOnHover {label} class={cn(s.strip(), className)}>
			{#each items as item, index (index)}{@render logo(item)}{/each}
		</DraggableMarquee>
	{:else}
	<div
		bind:this={containerEl}
		data-slot="logo-carousel"
		class={cn(s.columns(), className)}
		style="grid-template-columns: repeat({columns.length}, minmax(0, 1fr));"
	>
		{#each columns as col, i (i)}
			{@const activeIndex = col.length > 0 ? (indices[i] ?? 0) % col.length : 0}
			{@const delayMs = reduced ? 0 : (direction === "rtl" ? columns.length - 1 - i : i) * STAGGER_MS}
			<LogoColumn items={col} {logo} {activeIndex} {delayMs} {reduced} />
		{/each}
	</div>
	{/if}
{/snippet}

{#if showPause}
	<div data-slot="logo-carousel-root" class={s.root()}>
		{@render strip()}
		<div class={s.footer()}>
			<Button variant="ghost" size="sm" aria-pressed={held} class={s.pause()} onclick={togglePaused}>
				<svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
					<path d={held ? "M5 3.5v9l7-4.5z" : "M4.5 3h2.5v10H4.5zM9 3h2.5v10H9z"} />
				</svg>
				{held ? "Play" : "Pause"}
			</Button>
		</div>
	</div>
{:else}
	{@render strip()}
{/if}
