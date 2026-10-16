<script lang="ts">
import { untrack } from "svelte";
import ChartTooltipContent from "../../chart/svelte/chart-tooltip-content.svelte";
import ChartTooltipPanel from "../../chart/svelte/chart-tooltip-panel.svelte";
import { setActivePoint, useChart } from "../../chart/svelte/context";
import type { ActivePoint, Datum } from "../../chart/svelte/core";
import {
	CHART_DURATION,
	CHART_EASE,
	cubicBezier,
	type Playback,
	tween,
} from "../../chart/svelte/motion";
import {
	type ArcDatum,
	applyHoverGrow,
	arcColor,
	arcPath,
	type buildLayout,
	centroid,
	enterDelays,
	FADE_MS,
	type Focus,
	GROW_MS,
	growPadding,
	hoverGrowTargets,
	hubRadius,
	isDescendant,
	isOnPath,
	labelFits,
	labelRotation,
	localProgress,
	maxHoverThickness,
	relativeOpacity,
	SUNBURST_CURVE,
	transitionGeometry,
	ZOOM_MS,
} from "./geometry";
import { SUNBURST_HUB, type SunburstVariant, sunburstChart } from "./variants";

const SUNBURST_EASE = cubicBezier(...SUNBURST_CURVE);

let {
	frame,
	layout,
	focus,
	visible,
	variant,
	labels,
	hoverPop,
	staggerScale,
	animate,
	activeIndex,
	instant,
	setActive,
	zoomTo,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	layout: ReturnType<typeof buildLayout>;
	focus: Focus;
	visible: ArcDatum[];
	variant: SunburstVariant;
	labels: boolean;
	hoverPop: number;
	staggerScale: number;
	animate: boolean;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
	zoomTo: (id: string) => void;
} = $props();

const chart = useChart();
const hub = $derived(SUNBURST_HUB[variant]);
const styles = $derived(sunburstChart({ variant }));
const size = $derived(Math.min(frame.width, frame.height));
const radius = $derived(
	Math.max(8, size / 2 - growPadding(layout.maxDepth, size, hoverPop)),
);
const cx = $derived(frame.width / 2);
const cy = $derived(frame.height / 2);
const colored = $derived(
	new Set(
		Object.entries(chart.config)
			.filter(([, entry]) => entry.color || entry.theme)
			.map(([key]) => key),
	),
);

const timing = $derived(enterDelays(layout.arcs, staggerScale));
const labelsDelay = $derived(timing.maxDelay + CHART_DURATION.enter * 0.85);
const signature = $derived(layout.arcs.map((a) => `${a.id}:${a.value}`).join("|"));
// svelte-ignore state_referenced_locally
let elapsed = $state(animate ? 0 : Number.POSITIVE_INFINITY);
$effect.pre(() => {
	signature;
	const on = animate;
	return untrack(() => {
		if (!on) {
			elapsed = Number.POSITIVE_INFINITY;
			return;
		}
		const total = labelsDelay + CHART_DURATION.enter;
		elapsed = 0;
		const playback = tween({
			duration: total,
			ease: (t) => t,
			onUpdate: (p) => {
				elapsed = p * total;
			},
		});
		return () => playback.stop();
	});
});

// svelte-ignore state_referenced_locally
let prevFocusId = $state(focus.id);
let zoomT = $state(1);
// svelte-ignore state_referenced_locally
let shownFocus = focus.id;
$effect.pre(() => {
	const next = focus.id;
	return untrack(() => {
		if (shownFocus === next) return;
		prevFocusId = shownFocus;
		shownFocus = next;
		zoomT = 0;
		const playback = tween({
			duration: animate ? ZOOM_MS : 0,
			ease: SUNBURST_EASE,
			onUpdate: (p) => {
				zoomT = p;
			},
			onComplete: () => {
				prevFocusId = next;
			},
		});
		return () => playback.stop();
	});
});
const prevFocus = $derived(layout.focusById.get(prevFocusId) ?? focus);

const active = $derived(activeIndex !== null ? visible[activeIndex] : undefined);
let grow = $state<Map<string, number>>(new Map());
$effect.pre(() => {
	const targets = active
		? hoverGrowTargets(layout.arcs, active, focus, layout.maxDepth, radius, hoverPop, hub)
		: new Map<string, number>();
	const quick = instant || !animate;
	return untrack(() => {
		const starts = new Map(grow);
		const ids = new Set([...starts.keys(), ...targets.keys()]);
		let playback: Playback | null = null;
		playback = tween({
			duration: quick ? 0 : GROW_MS,
			ease: SUNBURST_EASE,
			onUpdate: (p) => {
				const next = new Map<string, number>();
				for (const id of ids) {
					const from = starts.get(id) ?? 0;
					const value = from + ((targets.get(id) ?? 0) - from) * p;
					if (value > 0.01) next.set(id, value);
				}
				grow = next;
			},
		});
		return () => playback?.stop();
	});
});

const cap = $derived(maxHoverThickness(layout.maxDepth, radius, hoverPop, hub));
function geometry(arc: ArcDatum) {
	const base = transitionGeometry(
		arc,
		prevFocus,
		focus,
		layout.maxDepth,
		radius,
		hub,
		zoomT,
	);
	return base ? applyHoverGrow(base, arc.id, (id) => grow.get(id) ?? 0, cap) : null;
}
const related = (arc: ArcDatum) =>
	!active || isDescendant(arc, active.id) || isOnPath(arc, active.id);
const color = (arc: ArcDatum) => arcColor(arc, colored);
const fade = $derived(SUNBURST_EASE(localProgress(elapsed, 0, FADE_MS)));
const labelOpacity = $derived(
	CHART_EASE(localProgress(elapsed, labelsDelay, CHART_DURATION.enter)),
);

const drawOrder = $derived([...layout.arcs].sort((a, b) => b.depth - a.depth));
const shapes = $derived(
	drawOrder.map((arc) => {
		const g = geometry(arc);
		const p = CHART_EASE(
			localProgress(elapsed, timing.delays.get(arc.id) ?? 0, CHART_DURATION.enter),
		);
		return { arc, g, p, d: g ? arcPath(g, p) : "" };
	}),
);
const activePoint = $derived.by<ActivePoint | null>(() => {
	if (!active || activeIndex === null) return null;
	const g = geometry(active);
	if (!g) return null;
	const at = centroid(g);
	return {
		index: activeIndex,
		datum: {
			id: active.id,
			name: active.trail.join(" / "),
			value: active.value,
			category: active.category,
		},
		x: cx + at.x,
		y: { value: cy + at.y },
	};
});
setActivePoint({
	get active() {
		return activePoint;
	},
	get instant() {
		return instant;
	},
	title: (datum: Datum) => String(datum.name ?? ""),
	rows: (datum: Datum) => [
		{
			key: String(datum.category ?? ""),
			label: chart.format.percent(
				focus.value > 0 ? Number(datum.value) / focus.value : 0,
			),
			color: active ? color(active) : "currentColor",
			value: Number(datum.value),
		},
	],
});

const hubR = $derived(hubRadius(focus, prevFocus, layout.maxDepth, radius, hub, zoomT));
const focusArc = $derived(layout.arcs.find((arc) => arc.id === focus.id));
const shown = $derived(active ?? focus);
</script>

<svg
	aria-hidden="true"
	width={frame.width}
	height={frame.height}
	class="absolute inset-0 block overflow-visible"
	style:opacity={fade}
	onpointerleave={() => {
		if (activeIndex !== null) setActive(null, false);
	}}
>
	<g transform="translate({cx},{cy})">
		{#each shapes as { arc, p, d } (arc.id)}
			{#if d}
				{@const index = visible.indexOf(arc)}
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<g
					data-slot="sunburst-segment"
					data-id={arc.id}
					data-active={active === arc ? "" : undefined}
					class={styles.segment()}
					style:opacity={related(arc) ? 1 : 0.25}
					style:transform={p < 1 ? `scale(${0.9 + 0.1 * p})` : undefined}
					style:transform-origin="0 0"
					style:cursor={arc.hasChildren ? "pointer" : "default"}
					onpointerenter={() => {
						if (index >= 0) setActive(index, false);
					}}
					onclick={() => {
						if (!arc.hasChildren) return;
						zoomTo(arc.id);
						setActive(null, false);
					}}
				>
					<path
						{d}
						fill={color(arc)}
						fill-opacity={relativeOpacity(arc.depth - focus.depth)}
						class={styles.path()}
					/>
				</g>
			{/if}
		{/each}
		{#if hubR > 1}
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<circle
				data-slot="sunburst-hub"
				r={Math.max(hubR - 2, 0)}
				class={styles.hub()}
				style:fill={focus.depth > 0 && focusArc ? color(focusArc) : undefined}
				style:cursor={focus.parentId ? "pointer" : "default"}
				onclick={() => {
					if (focus.parentId) zoomTo(focus.parentId);
				}}
			/>
		{/if}
		{#if labels}
			{#each shapes as { arc, g } (arc.id)}
				{#if g && labelFits(g, arc.name) && related(arc)}
					{@const at = centroid(g)}
					<text
						x={at.x}
						y={at.y}
						text-anchor="middle"
						dominant-baseline="middle"
						transform="rotate({labelRotation(at.angle)} {at.x} {at.y})"
						class={styles.label()}
						style:opacity={labelOpacity}
					>
						{arc.name}
					</text>
				{/if}
			{/each}
		{/if}
	</g>
</svg>
{#if hubR > 24}
	<div
		data-slot="sunburst-center"
		class={styles.center()}
		style:left="{cx - hubR}px"
		style:top="{cy - hubR}px"
		style:width="{hubR * 2}px"
		style:height="{hubR * 2}px"
	>
		<span class={styles.value()}>{chart.format.number(shown.value)}</span>
		<span class={styles.caption()}>{shown.name}</span>
	</div>
{/if}
{#if frame.el}
	<ChartTooltipPanel
		target={frame.el}
		anchor={activePoint ? { x: activePoint.x, y: activePoint.y.value ?? cy } : null}
		{instant}
		bounds={{ width: frame.width, height: frame.height }}
	>
		<ChartTooltipContent />
	</ChartTooltipPanel>
{/if}
