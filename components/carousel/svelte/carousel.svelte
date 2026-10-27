<script lang="ts">
import type { Snippet } from "svelte";
import { untrack } from "svelte";
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/cn";
import { createCarouselTrack } from "../track";
import {
	type CarouselControls,
	type CarouselProjection,
	type CarouselSize,
	type CarouselVariant,
	carousel,
} from "../variants";
import { setCarousel } from "./context";

let {
	label,
	children,
	index = $bindable(),
	defaultIndex = 0,
	onIndexChange,
	projection = "linear",
	visibleItems = 5,
	minScale = 0.58,
	arc,
	variant = "default",
	size = "default",
	controls = "full",
	loop = false,
	slideSize,
	slideLabel = (i: number, count: number) => `${i + 1} of ${count}`,
	interval,
	autoplay = false,
	class: classProp,
}: {
	/** Names the carousel for assistive technology, e.g. "From the Harbour suites". */
	label: string;
	/** One CarouselItem per slide. */
	children: Snippet;
	/** Active slide; bindable, or pair with `onIndexChange`. */
	index?: number;
	defaultIndex?: number;
	onIndexChange?: (index: number) => void;
	/** Projects slides as a linear row or onto the inside/outside of a cylinder. */
	projection?: CarouselProjection;
	/** Approximate number of slides visible across a cylindrical projection. */
	visibleItems?: number;
	/** Scale at the cylinder's farthest point. */
	minScale?: number;
	/** Vertical curve depth in pixels; responsive when omitted. */
	arc?: number;
	/** Visual treatment for the track, slides, and controls. */
	variant?: CarouselVariant;
	/** Slide width preset; `slideSize` overrides it. */
	size?: CarouselSize;
	/** Which controls render; `full` adds play when `interval` is set. */
	controls?: CarouselControls;
	/** Arrows and keys wrap from the last slide to the first. */
	loop?: boolean;
	/** Width of one slide as a CSS length; `cqw` is a share of the carousel width. */
	slideSize?: string;
	/** Names each slide and its indicator. Defaults to "2 of 5". */
	slideLabel?: (index: number, count: number) => string;
	/** Milliseconds per slide. Adds a play control; rotation pauses on hover, focus and drag, and never runs under reduced motion. */
	interval?: number;
	/** Starts rotating on mount. Off by default, so motion begins with the viewer. */
	autoplay?: boolean;
	class?: string;
} = $props();

const uid = $props.id();
let count = $state(0);
// svelte-ignore state_referenced_locally -- seeds the uncontrolled index once
let own = $state(defaultIndex);
const last = $derived(Math.max(0, count - 1));
const current = $derived(Math.min(last, Math.max(0, index ?? own)));
// svelte-ignore state_referenced_locally -- the server places this slide before measuring
const startIndex = untrack(() => index ?? defaultIndex);
const s = $derived(carousel({ projection, variant, size }));

setCarousel({
	register: () => count++,
	get index() {
		return current;
	},
	get slideClass() {
		return s.slide();
	},
	slideLabel: (i) => slideLabel(i, count),
	slideId: (i) => `${uid}-slide-${i}`,
});

// svelte-ignore state_referenced_locally -- rotation starts from the prop, then the viewer owns it
let playing = $state(autoplay);
let hovered = $state(false);
let focusPaused = $state(false);
let dragging = $state(false);
let inView = $state(true);
let pageVisible = $state(true);
let reduced = $state(false);
let announcement = $state("");
let root = $state<HTMLElement>();
let viewport = $state<HTMLDivElement>();
let track = $state<HTMLDivElement>();
let engine: ReturnType<typeof createCarouselTrack> | null = null;

const canRotate = $derived(Boolean(interval) && count > 1 && !reduced);
const wraps = $derived(loop || projection !== "linear");
const running = $derived(
	canRotate && playing && !hovered && !focusPaused && !dragging && inView && pageVisible,
);
const options = $derived({
	running,
	interval: interval ?? 0,
	onSelect: (next: number, announce: boolean) => {
		if (index === undefined) own = next;
		else index = next;
		onIndexChange?.(next);
		if (announce) announcement = slideLabel(next, count);
	},
	onDragChange: (value: boolean) => {
		dragging = value;
	},
	flat: variant === "flat" || variant === "showcase",
	loop: wraps,
	projection,
	visibleItems,
	minScale,
	arc,
});

$effect(() => {
	const query = matchMedia("(prefers-reduced-motion: reduce)");
	const sync = () => (reduced = query.matches);
	sync();
	query.addEventListener("change", sync);
	return () => query.removeEventListener("change", sync);
});

$effect(() => {
	const [rootEl, viewportEl, trackEl] = [root, viewport, track];
	if (!rootEl || !viewportEl || !trackEl) return;
	const created = untrack(() =>
		createCarouselTrack(rootEl, viewportEl, trackEl, current, options),
	);
	engine = created;
	return () => {
		created.destroy();
		engine = null;
	};
});

$effect(() => {
	engine?.update(options);
});

$effect(() => {
	const next = current;
	untrack(() => engine?.go(next));
});

$effect(() => {
	if (!interval || !root) return;
	const observer = new IntersectionObserver(([entry]) => {
		if (entry) inView = entry.isIntersecting;
	});
	observer.observe(root);
	const onVisibility = () => (pageVisible = document.visibilityState !== "hidden");
	document.addEventListener("visibilitychange", onVisibility);
	return () => {
		observer.disconnect();
		document.removeEventListener("visibilitychange", onVisibility);
	};
});

function toggleRotation() {
	if (!playing) {
		playing = true;
		return;
	}
	playing = false;
	engine?.resetDrain();
}

// Arrows wrap with `loop`; otherwise they stop at either end.
function step(delta: number) {
	const next = current + delta;
	if (wraps) engine?.go((next + count) % count);
	else if (next >= 0 && next <= last) engine?.go(next);
}
</script>

<section
	bind:this={root}
	data-slot="carousel"
	data-projection={projection}
	aria-roledescription="carousel"
	aria-label={label}
	class={cn(s.root(), classProp)}
	style:--carousel-start={startIndex}
	style:--carousel-slide={slideSize}
	onfocusin={(event) => {
		const target = event.target as HTMLElement;
		focusPaused = !target.closest("[data-carousel-play]") && target.matches(":focus-visible");
	}}
	onfocusout={(event) => {
		if (!event.currentTarget.contains(event.relatedTarget as Node | null)) focusPaused = false;
	}}
>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -- the slide group takes focus so arrow keys move the track -->
	<div
		bind:this={viewport}
		role="group"
		aria-label="Slides"
		tabindex="0"
		data-dragging={dragging || undefined}
		class={s.viewport()}
		onpointerenter={(event) => {
			if (event.pointerType === "mouse") hovered = true;
		}}
		onpointerleave={() => (hovered = false)}
	>
		<div bind:this={track} class={s.track()}>
			{@render children()}
		</div>
	</div>
	{#if count > 1}
		<div class={s.controls()}>
			{#if canRotate && controls === "full"}
				<Button
					data-carousel-play=""
					variant="outline"
					size="icon-sm"
					class={cn(s.control(), s.play())}
					aria-label={playing ? "Pause slide rotation" : "Start slide rotation"}
					onclick={toggleRotation}
				>
					<span class={s.iconStack()}>
					<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" data-on={playing} class={s.icon()}>
						<rect x="3.5" y="3" width="3" height="10" rx="0.8" />
						<rect x="9.5" y="3" width="3" height="10" rx="0.8" />
					</svg>
					<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" data-on={!playing} class={s.icon()}>
						<path d="M5 3.4v9.2a.6.6 0 0 0 .9.5l7.3-4.6a.6.6 0 0 0 0-1L5.9 2.9a.6.6 0 0 0-.9.5Z" />
					</svg>
					</span>
				</Button>
			{/if}
			<div
				class={cn(s.tabs(), (controls === "arrows" || controls === "none") && "sr-only")}
				role="tablist"
				aria-label="Choose a slide"
			>
				{#each { length: count } as _, i (i)}
					<Button
						variant="ghost"
						size="icon-sm"
						role="tab"
						data-carousel-dot=""
						aria-selected={i === current}
						aria-controls={`${uid}-slide-${i}`}
						aria-label={slideLabel(i, count)}
						tabindex={i === current ? 0 : -1}
						class={s.tab()}
						style={`--emphasis: ${i === startIndex ? 1 : 0}`}
						onclick={() => engine?.go(i)}
					>
						<span class={s.dot()} aria-hidden="true">
							<span class={s.dotFill()}></span>
							<span class={s.dotDrain()}></span>
						</span>
					</Button>
				{/each}
			</div>
			{#if controls === "full" || controls === "arrows"}
			<div class={s.arrows()}>
				<Button
					variant="outline"
					size="icon-sm"
					class={s.control()}
					aria-label="Previous slide"
					aria-disabled={!loop && current === 0}
					onclick={() => step(-1)}
				>
					<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<path d="M10 3.5 5.5 8l4.5 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</Button>
				<Button
					variant="outline"
					size="icon-sm"
					class={s.control()}
					aria-label="Next slide"
					aria-disabled={!loop && current === last}
					onclick={() => step(1)}
				>
					<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<path d="m6 3.5 4.5 4.5L6 12.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</Button>
			</div>
			{/if}
		</div>
	{/if}
	<span class="sr-only" aria-live="polite" aria-atomic="true">{announcement}</span>
</section>
