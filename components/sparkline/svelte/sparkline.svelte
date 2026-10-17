<script lang="ts">
import { untrack } from "svelte";
import { cn } from "../../lib/cn";
import SlotText from "../../slot-text/svelte/slot-text.svelte";
import { createSparkline, pointAt, scrubKey } from "../spark";
import { type SparklineVariant, sparkline } from "../variants";

let {
	data,
	label,
	value,
	change,
	labels,
	formatValue,
	width = 160,
	height = 52,
	area = true,
	interactive = true,
	variant = "default",
	class: classProp,
}: {
	data: number[];
	label: string;
	/** Headline value, such as "$12.4k"; scrubbing swaps in the point's value. */
	value?: string;
	/** Context beside the value, such as "+8.2%". */
	change?: string;
	/** One label per point, such as a date, shown while that point is scrubbed. */
	labels?: string[];
	formatValue?: (value: number, index: number) => string;
	/** Width and height ratio of the plot; it fills its container's width. */
	width?: number;
	height?: number;
	/** A faint fill under the line. */
	area?: boolean;
	/** Pointer and keyboard scrubbing through the points. */
	interactive?: boolean;
	variant?: SparklineVariant;
	class?: string;
} = $props();

const uid = $props.id();
const clip = (name: string) => `url(#spark${uid}-${name})`;
let root = $state<HTMLElement>();
let plot = $state<HTMLDivElement>();
let svg = $state<SVGSVGElement>();
let line = $state<SVGPathElement>();
let trail = $state<SVGPathElement>();
let areaPath = $state<SVGPathElement>();
let cursor = $state<SVGLineElement>();
let dot = $state<SVGPathElement>();
let lit = $state<SVGRectElement>();
let dim = $state<SVGRectElement>();
let fill = $state<SVGRectElement>();
let baseline = $state<SVGLineElement>();
let active = $state<number | null>(null);
let landed = $state(false);
let engine: ReturnType<typeof createSparkline> | undefined;
const grouped = new Intl.NumberFormat("en-US");

const last = $derived(Math.max(1, data.length - 1));
const index = $derived(active === null ? null : Math.min(active, last));
const key = $derived(data.join(","));

$effect(() => {
	if (
		!svg ||
		!line ||
		!trail ||
		!cursor ||
		!dot ||
		!lit ||
		!dim ||
		!fill ||
		!baseline ||
		!plot ||
		!root
	)
		return;
	const box = plot;
	const spark = createSparkline(
		{ svg, line, trail, area: areaPath ?? null, cursor, dot, lit, dim, fill, baseline },
		untrack(() => data),
		() => (landed = true),
	);
	engine = spark;
	const ratio = untrack(() => height / width);
	const ro = new ResizeObserver(() =>
		spark.resize(box.clientWidth, box.clientWidth * ratio),
	);
	ro.observe(box);
	const io = new IntersectionObserver(
		([entry]) => {
			if (!entry?.isIntersecting) return;
			io.disconnect();
			spark.reveal();
		},
		{ threshold: 0.5 },
	);
	io.observe(root);
	return () => {
		ro.disconnect();
		io.disconnect();
		spark.destroy();
	};
});
let seen = untrack(() => key);
$effect(() => {
	if (key === seen) return;
	seen = key;
	engine?.setData(untrack(() => data));
});
$effect(() => {
	engine?.setCursor(index === null ? 1 : index / last);
});

const s = $derived(sparkline({ variant }));
const format = (at: number) =>
	formatValue ? formatValue(data[at] ?? 0, at) : grouped.format(data[at] ?? 0);
const scrubbing = $derived(index !== null);
const point = $derived(format(index ?? last));
const when = $derived(labels?.[index ?? last]);
const headline = $derived(value === undefined ? undefined : scrubbing ? point : value);
const aside = $derived(
	index === null
		? (change ?? "")
		: value === undefined
			? [point, when].filter(Boolean).join(" · ")
			: (when ?? `${index + 1} of ${last + 1}`),
);

function onkeydown(event: KeyboardEvent) {
	if (event.key === "Escape" && scrubbing) {
		event.preventDefault();
		active = null;
		return;
	}
	const next = scrubKey(event.key, index ?? last, last);
	if (next === null) return;
	event.preventDefault();
	active = next;
}
</script>

<figure
	bind:this={root}
	data-slot="sparkline"
	aria-label={`${label}: ${value ?? data[last]}. ${change ?? ""}`.trim()}
	class={cn(s.root(), classProp)}
>
	<figcaption class={s.caption()}>
		<span class={s.label()}>{label}</span>
		{#if headline !== undefined}
			<strong class={s.value()}><SlotText value={headline} spins={0} duration={0.35} stagger={0.02} /></strong>
		{/if}
		<small class={cn(s.aside(), scrubbing && "text-muted-foreground")}
			><SlotText value={aside} spins={0} duration={0.35} stagger={0.02} /></small
		>
	</figcaption>
	{#if interactive}
		<div
			bind:this={plot}
			class={s.plot()}
			role="slider"
			tabindex="0"
			aria-label="{label}, explore values"
			aria-valuemin={1}
			aria-valuemax={last + 1}
			aria-valuenow={(index ?? last) + 1}
			aria-valuetext="{when ?? (index === null ? 'Latest' : `Point ${index + 1} of ${last + 1}`)}: {point}"
			onpointerdown={(event) => (active = pointAt(event.currentTarget, event.clientX, last))}
			onpointermove={(event) => {
				if (event.pointerType === "mouse" || event.buttons) active = pointAt(event.currentTarget, event.clientX, last);
			}}
			onpointerup={(event) => event.pointerType !== "mouse" && (active = null)}
			onpointerleave={() => (active = null)}
			onpointercancel={() => (active = null)}
			onblur={() => (active = null)}
			{onkeydown}
		>
			{@render chart()}
		</div>
	{:else}
		<div bind:this={plot} class={s.plot()}>{@render chart()}</div>
	{/if}
</figure>

{#snippet chart()}
	<svg bind:this={svg} aria-hidden="true" focusable="false" viewBox="0 0 {width} {height}" class={s.chart()}>
		<defs>
			<clipPath id="spark{uid}-lit" clipPathUnits="userSpaceOnUse"><rect bind:this={lit} x="-16" y="-16" /></clipPath>
			<clipPath id="spark{uid}-dim" clipPathUnits="userSpaceOnUse"><rect bind:this={dim} y="-16" /></clipPath>
			<clipPath id="spark{uid}-fill" clipPathUnits="userSpaceOnUse"><rect bind:this={fill} x="-16" y="-16" /></clipPath>
		</defs>
		{#if area}<path bind:this={areaPath} clip-path={clip("fill")} class={s.area()} />{/if}
		<line bind:this={baseline} x1="0" class={s.baseline()} />
		<path bind:this={trail} data-on={scrubbing && landed} clip-path={clip("dim")} class={s.trail()} />
		<path bind:this={line} pathLength="1" clip-path={clip("lit")} class={s.line()} />
		<line bind:this={cursor} y1="0" data-on={scrubbing} class={s.cursor()} />
		<path bind:this={dot} data-landed={landed} data-scrub={scrubbing} class={s.dot()} />
	</svg>
{/snippet}
