<script lang="ts">
import ChartFrame from "../../chart/svelte/chart-frame.svelte";
import { useChart } from "../../chart/svelte/context";
import {
	type ArcDatum,
	buildLayout,
	DEFAULT_HOVER_POP,
	type Focus,
	focusTrail,
	type SunburstNode,
	visibleArcs,
} from "../geometry";
import { type SunburstVariant, sunburstChart } from "../variants";
import SunburstPlot from "./sunburst-plot.svelte";

let {
	data,
	variant = "sunburst",
	labels = true,
	breadcrumb = true,
	hoverPop = DEFAULT_HOVER_POP,
	staggerScale = 1,
	focus: focusId = $bindable(),
	onFocusChange,
	activeIndex = $bindable(null),
	onActiveIndexChange,
	animate = true,
	tableHeaders = ["Path", "Value", "Share"],
	breadcrumbLabel = "Drill-down path",
	roleDescription = "sunburst chart",
	class: className,
}: {
	/** Root of the tree; leaves carry `value`, branches sum their children. */
	data: SunburstNode;
	variant?: SunburstVariant;
	/** Names along arcs wide enough to hold them. */
	labels?: boolean;
	/** Drill-down path above the chart, one button per level. */
	breadcrumb?: boolean;
	/** Pixels the hovered path grows outward. */
	hoverPop?: number;
	/** Multiplies the ring and clockwise stagger; floored at 0.25. */
	staggerScale?: number;
	/** Id of the node the chart is zoomed into: names joined by " / ". Bindable. */
	focus?: string;
	onFocusChange?: (id: string) => void;
	activeIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	animate?: boolean;
	/** Screen-reader table headers: path, value, share. */
	tableHeaders?: [string, string, string];
	breadcrumbLabel?: string;
	roleDescription?: string;
	class?: string;
} = $props();

const chart = useChart();
const layout = $derived(buildLayout(data, chart.hidden));
const focus = $derived(
	(focusId !== undefined ? layout.focusById.get(focusId) : undefined) ??
		(layout.focusById.get(layout.rootId) as Focus),
);
const visible = $derived(visibleArcs(layout.arcs, focus));
let instant = $state(false);
function setActive(index: number | null, fromKeyboard: boolean) {
	instant = fromKeyboard;
	activeIndex = index;
	onActiveIndexChange?.(index);
}
function zoomTo(id: string) {
	if (id === focus.id || !layout.focusById.has(id)) return;
	focusId = id;
	onFocusChange?.(id);
}
const active = $derived(activeIndex !== null ? visible[activeIndex] : undefined);
const share = (arc: ArcDatum, of: number) =>
	chart.format.percent(of > 0 ? arc.value / of : 0);

function onkeydown(event: KeyboardEvent) {
	if (event.defaultPrevented) return;
	if ((event.key === "Enter" || event.key === " ") && active?.hasChildren) {
		event.preventDefault();
		zoomTo(active.id);
		setActive(0, true);
	} else if ((event.key === "Backspace" || event.key === "Escape") && focus.parentId) {
		event.preventDefault();
		zoomTo(focus.parentId);
		setActive(null, true);
	}
}

const styles = $derived(sunburstChart({ variant }));
const trail = $derived(focusTrail(focus, layout.focusById));
const branches = $derived(layout.arcs.filter((arc) => arc.depth === 1));
const largest = $derived(
	branches.reduce<ArcDatum | undefined>(
		(best, a) => (!best || a.value > best.value ? a : best),
		undefined,
	),
);
const summary = $derived(
	chart.description ??
		(largest
			? `${branches.length} branches over ${layout.maxDepth} rings totalling ${chart.format.number(layout.total)}. Largest: ${largest.name}, ${share(largest, layout.total)}.`
			: "No data."),
);
const table = $derived({
	columns: tableHeaders,
	rows: layout.arcs.map((arc) => ({
		header: arc.trail.join(" / "),
		cells: [chart.format.number(arc.value), share(arc, layout.total)],
	})),
});
const announcement = $derived(
	active && instant
		? `${active.trail.join(" / ")}: ${chart.format.number(active.value)}, ${share(active, focus.value)}`
		: "",
);
</script>

{#if breadcrumb}
	<nav aria-label={breadcrumbLabel} data-slot="sunburst-breadcrumb" class={styles.breadcrumb()}>
		{#each trail as crumb, index (crumb.id)}
			<span class="flex items-center gap-1">
				{#if index > 0}
					<span aria-hidden="true" class={styles.separator()}>/</span>
				{/if}
				<button
					type="button"
					class={styles.crumb()}
					aria-current={index === trail.length - 1 ? "page" : undefined}
					onclick={() => {
						zoomTo(crumb.id);
						setActive(null, false);
					}}
				>
					{crumb.name}
				</button>
			</span>
		{/each}
	</nav>
{/if}
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="contents" {onkeydown}>
	<ChartFrame
		{roleDescription}
		{summary}
		{table}
		count={visible.length}
		{activeIndex}
		onActiveChange={setActive}
		interactive={visible.length > 0}
		{announcement}
		class={className}
	>
		{#snippet children(frame)}
			<SunburstPlot
				{frame}
				{layout}
				{focus}
				{visible}
				{variant}
				{labels}
				{hoverPop}
				{staggerScale}
				{animate}
				{activeIndex}
				{instant}
				{setActive}
				{zoomTo}
			/>
		{/snippet}
	</ChartFrame>
</div>
