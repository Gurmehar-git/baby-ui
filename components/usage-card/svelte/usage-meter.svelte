<script lang="ts">
import ChartStyle from "../../chart/svelte/chart-style.svelte";
import type { ChartConfig } from "../../chart/svelte/context";
import RollingDigits from "../../rolling-digits/svelte/rolling-digits.svelte";
import { type MeterStatus, meterKeyStep, type meterLayout, meterNumber } from "../meter";
import type { usageCard } from "../variants";

let {
	id,
	title,
	config,
	layout,
	limit,
	unit,
	decimals,
	freeLabel,
	overLabel,
	locale,
	activeIndex,
	onActiveIndexChange,
	styles,
}: {
	id: string;
	title: string;
	config: ChartConfig;
	layout: ReturnType<typeof meterLayout>;
	limit: number;
	unit: string;
	decimals: number;
	freeLabel: string;
	overLabel: string;
	locale?: string;
	activeIndex: number | null;
	onActiveIndexChange: (index: number | null) => void;
	styles: ReturnType<typeof usageCard>;
} = $props();

const STATUS_NOTE: Record<MeterStatus, (free: string, over: string) => string> = {
	ok: (free) => `Under the limit. ${free} free.`,
	near: (free) => `Almost full. ${free} free.`,
	over: (_, over) => `Over the limit by ${over}.`,
};

let track = $state<HTMLDivElement | null>(null);
let legend = $state<HTMLDivElement | null>(null);
let hovered = $state<number | null>(null);
let focused = $state<number | null>(null);
const amount = (value: number) =>
	`${meterNumber(value, decimals, locale)}${unit ? ` ${unit}` : ""}`;
const label = (key: string) => {
	const entry = config[key]?.label;
	return typeof entry === "string" ? entry : key;
};
const restIndex = $derived(layout.bars.length);
const items = $derived([
	...layout.bars.map((bar) => ({
		key: bar.key,
		label: label(bar.key),
		value: bar.value,
	})),
	{
		key: "rest",
		label: layout.status === "over" ? overLabel : freeLabel,
		value: layout.status === "over" ? layout.over : layout.free,
	},
]);
const active = $derived(hovered ?? focused ?? activeIndex);
const item = $derived(active !== null ? items[active] : undefined);
const caption = $derived(
	!item
		? `${unit} of ${amount(limit)} used`
		: active === restIndex
			? `${unit} ${layout.status === "over" ? "over the limit" : "free"}`
			: `${unit} in ${item.label}, ${Math.round((item.value / Math.max(limit, 1e-6)) * 100)}% of plan`,
);
const statusNote = $derived(
	STATUS_NOTE[layout.status](amount(layout.free), amount(layout.over)),
);

// Status changes are announced, and so is a growing overage; the first render stays quiet.
let announced = $state("");
let lastNotice: string | null = null;
$effect(() => {
	const notice = layout.status === "over" ? `over:${layout.over}` : layout.status;
	const message = statusNote;
	if (lastNotice !== null && lastNotice !== notice) announced = message;
	lastNotice = notice;
});

function indexAt(clientX: number) {
	const box = track?.getBoundingClientRect();
	if (!box?.width) return null;
	const at = ((clientX - box.left) / box.width) * 100;
	if (at > layout.limitAt) return restIndex;
	const hit = layout.bars.findIndex((bar) => at <= bar.left + bar.width);
	return hit === -1 ? restIndex : hit;
}
const toggle = (index: number | null) =>
	onActiveIndexChange(index === activeIndex ? null : index);
function onKey(event: KeyboardEvent) {
	if (event.key === "Escape") {
		if (activeIndex !== null) {
			event.preventDefault();
			onActiveIndexChange(null);
		}
		return;
	}
	const next = meterKeyStep(event.key, focused ?? 0, items.length);
	if (next === null) return;
	event.preventDefault();
	legend?.querySelectorAll("button")[next]?.focus();
}
const dim = (index: number) => active !== null && active !== index;
const restColor = $derived(
	layout.status === "over" ? "var(--destructive)" : "var(--border)",
);
</script>

<div data-chart={id} role="group" aria-label={title}>
	<ChartStyle {id} {config} />
	<div class={styles.headline()} aria-hidden="true">
		<RollingDigits
			variant="count"
			value={item ? item.value : layout.total}
			format={(value) => meterNumber(value, decimals, locale)}
			size="sm"
			startOnView={false}
			class={styles.figure()}
		/>
		<span class={styles.caption()}>{caption}</span>
	</div>
	<div
		bind:this={track}
		aria-hidden="true"
		class={styles.track()}
		onpointermove={(event) => {
			if (event.pointerType === "mouse") hovered = indexAt(event.clientX);
		}}
		onpointerleave={() => (hovered = null)}
		onpointerup={(event) => {
			if (event.pointerType !== "mouse") toggle(indexAt(event.clientX));
		}}
	>
		{#each layout.bars as bar, index (bar.key)}
			<span
				data-slot="usage-meter-segment"
				data-dim={dim(index)}
				class={styles.segment()}
				style:left="{bar.left}%"
				style:width="max(0px, calc({bar.width}% - 2px))"
				style:--meter-color="var(--color-{bar.key})"
			></span>
		{/each}
		<span
			class={styles.hatch()}
			style:left="{layout.limitAt}%"
			style:opacity={layout.status === "over" ? 1 : 0}
		></span>
		<span
			class={styles.marker()}
			style:left="{layout.limitAt}%"
			style:opacity={layout.status === "over" ? 1 : 0}
		></span>
	</div>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div bind:this={legend} class={styles.items()} onkeydown={onKey}>
		{#each items as entry, index (entry.key)}
			<button
				type="button"
				aria-pressed={activeIndex === index}
				data-active={active === index}
				data-dim={dim(index)}
				tabindex={index === (focused ?? activeIndex ?? 0) ? 0 : -1}
				class={styles.item()}
				style:--meter-color={index < restIndex ? `var(--color-${entry.key})` : restColor}
				onmouseenter={() => (hovered = index)}
				onmouseleave={() => (hovered = null)}
				onfocus={() => (focused = index)}
				onblur={() => (focused = null)}
				onclick={() => toggle(index)}
			>
				<span aria-hidden="true" class={styles.swatch()}></span>
				{entry.label}
				<span class={styles.amount()}>{amount(entry.value)}</span>
			</button>
		{/each}
	</div>
	<p class={styles.srOnly()}>{`${title}: ${amount(layout.total)} of ${amount(limit)} used. ${statusNote}`}</p>
	<span class={styles.srOnly()} aria-live="polite">{announced}</span>
</div>
