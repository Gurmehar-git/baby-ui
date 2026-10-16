<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import ChartMarkerDisc from "./chart-marker-disc.svelte";
import ChartMarkerFanItem from "./chart-marker-fan-item.svelte";
import {
	discStyle,
	FAN_RADIUS,
	GROUP_STAGGER,
	MARKER_SPRING,
	type MarkerGroup,
	popStyle,
} from "./geometry";
import { assign, type ChartMarker, spring } from "./types";
import {
	type ChartMarkerAppearance,
	type ChartMarkerSize,
	chartMarkers,
	MARKER_PX,
} from "./variants";

let {
	group,
	index,
	left,
	top,
	visible,
	animate,
	size,
	appearance,
	groupLabel,
	onHoverChange,
}: {
	group: MarkerGroup<ChartMarker>;
	index: number;
	left: number;
	top: number;
	visible: boolean;
	animate: boolean;
	size: ChartMarkerSize;
	appearance: ChartMarkerAppearance;
	groupLabel: (count: number, date: Date) => string;
	onHoverChange: (key: string | null) => void;
} = $props();

const styles = $derived(chartMarkers({ size, appearance }));
const multiple = $derived(group.items.length > 1);
let hovered = $state(false);
let focused = $state(false);
let pinned = $state(false);
const open = $derived(multiple && (hovered || focused || pinned));
let body = $state<HTMLDivElement | null>(null);
let badgeEl = $state<HTMLSpanElement | null>(null);
let dotEl = $state<HTMLDivElement | null>(null);
const progress = { enter: 0, fan: 0 };
const paint = () => assign(body, discStyle(progress.enter, progress.fan));
const enter = spring(MARKER_SPRING.enter, (v) => {
	progress.enter = v;
	paint();
});
const fan = spring(MARKER_SPRING.fan, (v) => {
	progress.fan = v;
	paint();
});
const badge = spring(MARKER_SPRING.badge, (v) => assign(badgeEl, popStyle(v)));
const dot = spring(MARKER_SPRING.badge, (v) => assign(dotEl, popStyle(v, 0, 0, 0.5)));

$effect.pre(() => {
	if (!body) return;
	paint();
});
$effect(() => {
	const show = visible;
	if (!animate) {
		enter.jump(show ? 1 : 0);
		return;
	}
	if (!show) {
		enter.set(0);
		return;
	}
	const timer = setTimeout(() => enter.set(1), index * GROUP_STAGGER);
	return () => clearTimeout(timer);
});
let badgeReady = false;
$effect(() => {
	const isOpen = open;
	const many = multiple;
	if (!badgeReady && badgeEl) {
		badge.jump(many ? 1 : 0);
		badgeReady = true;
	}
	fan.set(isOpen ? 1 : 0);
	badge.set(many && !isOpen ? 1 : 0);
	dot.set(isOpen ? 1 : 0);
});
$effect(() => () => {
	for (const s of [enter, fan, badge, dot]) s.stop();
});

const first = $derived(group.items[0]);
const span = $derived(FAN_RADIUS * 2 + MARKER_PX[size]);
function onkeydown(event: KeyboardEvent) {
	if (event.key === "Escape" && open) {
		pinned = false;
		focused = false;
		hovered = false;
	}
	if (event.key !== "Tab") event.stopPropagation();
}
</script>

{#if first}
	<div
		data-slot="chart-marker"
		data-open={open ? "" : undefined}
		role="presentation"
		class={styles.group()}
		style:left="{left}px"
		style:top="{top}px"
		onpointerenter={() => {
			hovered = true;
			onHoverChange(group.key);
		}}
		onpointerleave={() => {
			hovered = false;
			onHoverChange(null);
		}}
		onfocusin={() => (focused = true)}
		onfocusout={(event) => {
			if (!event.currentTarget.contains(event.relatedTarget as Node)) focused = false;
		}}
		{onkeydown}
	>
		{#if multiple}
			<div
				aria-hidden="true"
				class={cn(
					"-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2",
					open ? "pointer-events-auto" : "pointer-events-none",
				)}
				style:width="{span}px"
				style:height="{span}px"
			></div>
		{/if}
		<div bind:this={body} class="relative size-full">
			{#if multiple}
				<button
					type="button"
					aria-expanded={open}
					aria-label={groupLabel(group.items.length, group.date)}
					class={cn(styles.disc(), "cursor-pointer")}
					style:background={first.color}
					onclick={() => (pinned = !pinned)}
				>
					{#if first.icon}
						{@render first.icon()}
					{:else}
						{first.title.slice(0, 1).toUpperCase()}
					{/if}
				</button>
				<span bind:this={badgeEl} aria-hidden="true" class={styles.badge()}>
					{group.items.length}
				</span>
			{:else}
				<ChartMarkerDisc marker={first} label={first.title} class={styles.disc()} />
			{/if}
		</div>
		{#if multiple}
			<div class={styles.fan()}>
				<div bind:this={dotEl} class={styles.dot()} style:opacity="0"></div>
				{#each group.items as marker, i (`${marker.title}-${i}`)}
					<ChartMarkerFanItem {marker} index={i} total={group.items.length} {open} {styles} />
				{/each}
			</div>
		{/if}
	</div>
{/if}
