<script lang="ts">
import type { ComponentProps, Snippet } from "svelte";
import Card from "../../card/svelte/card.svelte";
import type { ChartStatus, Datum } from "../../chart/core";
import { cn } from "../../lib/cn";
import {
	type OverviewCardChartKind,
	type OverviewCardSize,
	overviewCard,
} from "../variants";
import { setOverviewCard } from "./context";

let {
	name,
	data,
	dataKey,
	xKey = "date",
	value,
	label,
	trend,
	chart = "area",
	size = "default",
	color = "var(--chart-1)",
	locale,
	formatValue,
	formatLabel,
	status = "ready",
	activeIndex = $bindable(null),
	onActiveIndexChange,
	class: className,
	children,
	...rest
}: Omit<ComponentProps<typeof Card>, "children"> & {
	/** What the metric is: the chart's accessible name and the period switcher's lead. */
	name: string;
	data: Datum[];
	dataKey: string;
	xKey?: string;
	/** Headline at rest, e.g. the period total. */
	value: number;
	/** Caption under the headline at rest, e.g. "This month". */
	label: string;
	/** Change over the whole period, in percent. */
	trend: number;
	chart?: OverviewCardChartKind;
	size?: OverviewCardSize;
	/** Series colour; defaults to the first chart slot. */
	color?: string;
	locale?: string;
	formatValue?: (value: number) => string;
	/** Caption for a hovered point. Defaults to the point's short date. */
	formatLabel?: (date: Date) => string;
	status?: ChartStatus;
	/** Bindable. */
	activeIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	children?: Snippet;
} = $props();

const number = $derived(
	formatValue ?? new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format,
);
const day = $derived(new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }));
const styles = $derived(overviewCard({ size, chart }));

setOverviewCard({
	get name() {
		return name;
	},
	get data() {
		return data;
	},
	get dataKey() {
		return dataKey;
	},
	get xKey() {
		return xKey;
	},
	get value() {
		return value;
	},
	get label() {
		return label;
	},
	get trend() {
		return trend;
	},
	get chart() {
		return chart;
	},
	get color() {
		return color;
	},
	get locale() {
		return locale;
	},
	get status() {
		return status;
	},
	get activeIndex() {
		return activeIndex;
	},
	get number() {
		return number;
	},
	get formatLabel() {
		return formatLabel ?? ((d: Date) => day.format(d));
	},
	get styles() {
		return styles;
	},
	setActive(index) {
		activeIndex = index;
		onActiveIndexChange?.(index);
	},
});
</script>

<!-- A chart-first metric card from parts; hovering OverviewCardChart drives OverviewCardValue. -->
<Card {...rest} data-slot="overview-card" class={cn(styles.root(), className)}>
	{@render children?.()}
</Card>
