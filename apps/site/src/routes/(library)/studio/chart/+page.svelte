<script lang="ts" module>
import { tv, type VariantProps } from "tailwind-variants";

const stage = tv({
	slots: {
		frame:
			"w-full rounded-xl border border-border bg-background p-3 shadow-sm transition-[max-width] duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] motion-reduce:transition-none sm:p-6",
	},
	variants: {
		frame: {
			wide: { frame: "max-w-4xl" },
			card: { frame: "max-w-md" },
			phone: { frame: "max-w-[22.5rem]" },
		},
	},
	defaultVariants: { frame: "wide" },
});

type Frame = NonNullable<VariantProps<typeof stage>["frame"]>;
</script>

<script lang="ts">
import SpecDials from "@baby-ui/demos/controls";
import {
	IconCheck,
	IconCopy,
	IconDeviceDesktop,
	IconDeviceMobile,
	IconFileCode,
	IconLayoutGrid,
	IconRefresh,
	IconSearch,
	IconShuffle,
	IconX,
} from "@baby-ui/icons";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	BarTooltip,
	BarXAxis,
	BarYAxis,
	Button,
	CartesianGrid,
	ChartContainer,
	ChartLegend,
	ChartTooltip,
	FunnelChart,
	Input,
	Line,
	LineChart,
	PieChart,
	RadarArea,
	RadarAxis,
	RadarChart,
	RadarGrid,
	RadarLabels,
	RadarTooltip,
	RingChart,
	Scatter,
	ScatterChart,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	Spinner,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Textarea,
	XAxis,
	YAxis,
} from "@baby-ui/svelte";
import { onMount } from "svelte";
import { hasProAccess } from "#lib/account.js";
import CodeBlock from "#lib/components/code-block.svelte";
import InstallCommand from "#lib/components/install-command.svelte";
import ProInstallGate from "#lib/components/pro-install-gate.svelte";
import SegmentControl, { type SegmentOption } from "#lib/components/segment-control.svelte";
import { demos } from "#lib/demos.js";
import StudioAbout from "#lib/studio/studio-about.svelte";
import StudioSeo from "#lib/studio/studio-seo.svelte";
import {
	startStudioSession,
	trackStudio,
	trackStudioSettled,
} from "#lib/studio/studio-events.js";
import { STUDIOS } from "#lib/studio/studios.js";
import {
	badDates,
	type ChartDataset,
	type ChartKind,
	type ChartShape,
	chartCode,
	chartConfig,
	funnelData,
	radarData,
	seriesData,
	sliceData,
	fits,
	isTime,
	parseCsv,
	SAMPLES,
	SHAPE_SERIES,
	seriesKey,
	shapeOf,
	splitProps,
} from "#lib/studio/chart.js";
import { changedProps } from "#lib/studio/codegen.js";
import { LiveCode } from "#lib/studio/live-code.svelte.js";
import { replaceState } from "$app/navigation";
import { page } from "$app/state";
import type { PageProps } from "./$types";

let { data }: PageProps = $props();
const aboutStudio = STUDIOS.find((s) => s.slug === "chart");

const FRAMES: SegmentOption<Frame>[] = [
	{ id: "wide", label: "Wide", icon: IconDeviceDesktop },
	{ id: "card", label: "Card", icon: IconLayoutGrid },
	{ id: "phone", label: "Phone", icon: IconDeviceMobile },
];
// Rail rows are h-12 with a 4px gap; each group's active fill slides by this much per row.
const ROW_PX = 52;
// What the first column holds, per shape (time-based series charts say Date instead).
const X_LABEL: Record<ChartShape, string> = {
	series: "Label",
	slices: "Slice",
	ring: "Ring",
	radar: "Metric",
};

const clone = (dataset: ChartDataset): ChartDataset => ({
	title: dataset.title,
	series: dataset.series.map((s) => ({ ...s })),
	rows: dataset.rows.map((r) => ({ x: r.x, values: [...r.values] })),
});
const freshSamples = (): Record<ChartShape, ChartDataset> => ({
	series: clone(SAMPLES.series),
	slices: clone(SAMPLES.slices),
	ring: clone(SAMPLES.ring),
	radar: clone(SAMPLES.radar),
});

// Empty until a pick or a shared link; the first editable chart shows meanwhile.
let picked = $state("");
let values = $state<Record<string, unknown>>({});
let datasets = $state(freshSamples());
let frame = $state<Frame>("wide");
let query = $state("");
let tab = $state("style");
let csv = $state("");
let csvError = $state("");
let codeOpen = $state(false);
let linkCopied = $state(false);
// Bumped to re-seed the dials: a new chart, a reset or a restored link.
let seed = $state(0);
let restored = $state(false);

const slug = $derived(picked || (data.kinds[0]?.spec.slug ?? ""));
const editable = $derived(data.kinds.find((k) => k.spec.slug === slug));
const sample = $derived(editable ? undefined : data.samples.find((s) => s.spec.slug === slug));
const spec = $derived(editable?.spec ?? sample?.spec ?? data.kinds[0]?.spec);
const defaults = $derived(editable?.defaults ?? sample?.defaults ?? {});
const kind = $derived<ChartKind | undefined>(editable?.kind);
const shape = $derived<ChartShape>(kind ? shapeOf(kind) : "series");
const dataset = $derived(datasets[shape]);
const limits = $derived(SHAPE_SERIES[shape]);
const parts = $derived(
	spec ? splitProps(spec, kind, values) : { chart: {}, series: {} },
);
const config = $derived(kind && kind !== "funnel" ? chartConfig(dataset, shape) : {});
const invalid = $derived(kind ? badDates(dataset, kind) : new Set<number>());
const changed = $derived(changedProps(values, defaults));
const codeParts = $derived(
	spec ? splitProps(spec, kind, changed) : { chart: {}, series: {} },
);
const locked = $derived(spec?.tier === "pro" && !hasProAccess());
const s = $derived(stage({ frame }));
const matches = (name: string) => name.toLowerCase().includes(query.trim().toLowerCase());
const shownKinds = $derived(data.kinds.filter((k) => matches(k.spec.name)));
const shownSamples = $derived(data.samples.filter((k) => matches(k.spec.name)));
const activeKind = $derived(shownKinds.findIndex((k) => k.spec.slug === slug));
const activeSample = $derived(shownSamples.findIndex((k) => k.spec.slug === slug));
const xLabel = $derived(kind && isTime(kind) ? "Date" : kind === "funnel" ? "Stage" : X_LABEL[shape]);

function pick(next: string) {
	if (next === slug) return;
	picked = next;
	values = {};
	seed++;
	const tier = data.kinds.find((k) => k.spec.slug === next)?.spec.tier ?? "free";
	trackStudio("item_picked", { studio: "chart", slug: next, tier, via: "list" });
}

function reset() {
	values = {};
	datasets[shape] = clone(SAMPLES[shape]);
	seed++;
	trackStudio("reset", { studio: "chart", slug });
}

function openCode() {
	codeOpen = true;
	trackStudio("code_opened", { studio: "chart", slug, locked });
}

onMount(() => startStudioSession("chart"));
$effect(() => {
	const names = Object.keys(changed);
	if (!names.length) return;
	trackStudioSettled("chart-props", "props_changed", { studio: "chart", slug, props: names });
});

// New values within the current spread, so the shape changes but the scale still reads.
function randomise() {
	datasets[shape].rows = dataset.rows.map((row) => ({
		x: row.x,
		values: row.values.map((v) =>
			Math.round(Math.max(0, (v || 100) * (0.55 + Math.random() * 0.9))),
		),
	}));
}

function addRow() {
	const last = dataset.rows.at(-1);
	const next = last ? new Date(last.x) : new Date(Date.UTC(2026, 0, 1));
	const dated = kind !== undefined && isTime(kind) && !Number.isNaN(next.getTime());
	if (dated) next.setUTCMonth(next.getUTCMonth() + 1);
	datasets[shape].rows.push({
		x: dated ? next.toISOString().slice(0, 10) : `Item ${dataset.rows.length + 1}`,
		values: dataset.series.map((_, i) => last?.values[i] ?? 0),
	});
}

function addSeries() {
	if (dataset.series.length >= limits.max) return;
	const label = `Series ${dataset.series.length + 1}`;
	datasets[shape].series.push({ key: seriesKey(label, dataset.series.length), label });
	for (const row of datasets[shape].rows) row.values.push(0);
}

function removeSeries(index: number) {
	if (dataset.series.length <= limits.min) return;
	datasets[shape].series.splice(index, 1);
	for (const row of datasets[shape].rows) row.values.splice(index, 1);
}

function renameSeries(index: number, label: string) {
	const target = datasets[shape].series[index];
	if (!target) return;
	target.label = label;
	// Keys must stay unique, or two series would read the same column.
	const key = seriesKey(label, index);
	target.key = dataset.series.some((x, i) => i !== index && x.key === key)
		? `${key}${index + 1}`
		: key;
}

function importCsv() {
	const parsed = parseCsv(csv, limits.max);
	if (!parsed || !fits(parsed, shape)) {
		csvError =
			limits.min === limits.max
				? `Paste a header row and data rows with exactly ${limits.max} value column${limits.max > 1 ? "s" : ""}.`
				: "Paste a header row and at least one data row, comma separated.";
		return;
	}
	datasets[shape] = { ...parsed, title: dataset.title };
	csvError = "";
	csv = "";
}

const isFrame = (value: string | null): value is Frame => FRAMES.some((f) => f.id === value);
const isDataset = (value: unknown): value is ChartDataset =>
	typeof value === "object" &&
	value !== null &&
	"series" in value &&
	Array.isArray(value.series) &&
	"rows" in value &&
	Array.isArray(value.rows);
const known = (value: string | null) =>
	value !== null &&
	(data.kinds.some((k) => k.spec.slug === value) ||
		data.samples.some((k) => k.spec.slug === value));

// A shared link restores the chart, its props, its data and the frame.
onMount(() => {
	const params = page.url.searchParams;
	const chart = params.get("chart");
	if (known(chart) && chart) picked = chart;
	const f = params.get("frame");
	if (isFrame(f)) frame = f;
	try {
		const parsed: unknown = JSON.parse(params.get("p") ?? "{}");
		if (parsed && typeof parsed === "object") values = { ...parsed };
		const shared: unknown = JSON.parse(params.get("d") ?? "null");
		if (isDataset(shared) && fits(shared, shape)) datasets[shape] = clone(shared);
	} catch {
		values = {};
	}
	seed++;
	restored = true;
});

// The address bar always holds a shareable link; data rides along once it differs from the sample.
$effect(() => {
	if (!restored) return;
	const url = new URL(page.url.href);
	url.search = "";
	url.searchParams.set("chart", slug);
	if (Object.keys(changed).length) url.searchParams.set("p", JSON.stringify(changed));
	if (frame !== "wide") url.searchParams.set("frame", frame);
	const snapshot = JSON.stringify(dataset);
	if (kind && snapshot !== JSON.stringify(SAMPLES[shape])) url.searchParams.set("d", snapshot);
	const timer = setTimeout(() => replaceState(url, {}), 300);
	return () => clearTimeout(timer);
});

let copyTimer: ReturnType<typeof setTimeout>;
async function copyLink() {
	await navigator.clipboard.writeText(window.location.href);
	linkCopied = true;
	trackStudio("link_copied", { studio: "chart", slug });
	clearTimeout(copyTimer);
	copyTimer = setTimeout(() => (linkCopied = false), 1600);
}

// Generated code highlights in the browser; sample charts' usage arrives highlighted.
const live = new LiveCode(() => ({
	open: codeOpen && !sample,
	panels:
		editable && kind
			? (["react", "svelte"] as const).map((framework) => ({
					id: framework,
					label: framework === "react" ? "React" : "Svelte",
					lang: framework === "react" ? "tsx" : "svelte",
					code: chartCode({
						framework,
						kind,
						dataset,
						chart: codeParts.chart,
						series: codeParts.series,
						paths: editable.paths[framework],
					}),
				}))
			: [],
}));
const panels = $derived(sample ? sample.panels : live.panels);
const allCharts = $derived([...data.kinds, ...data.samples]);
</script>

<StudioSeo slug="chart" crumb="Chart" />

{#snippet kindRow(item: { spec: { slug: string; name: string; description: string; tier?: string } })}
	<li>
		<button
			type="button"
			onclick={() => pick(item.spec.slug)}
			aria-current={item.spec.slug === slug ? "true" : undefined}
			class="group/kind flex h-12 w-full flex-col justify-center rounded-lg px-3 text-left transition-[color,scale] duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] not-aria-[current=true]:hover:bg-foreground/[0.06] active:scale-[0.98] motion-reduce:transition-none"
		>
			<span class="flex items-center gap-1.5">
				<span class="truncate font-medium text-foreground text-sm transition-colors group-aria-[current=true]/kind:text-background">{item.spec.name}</span>
				{#if item.spec.tier === "pro"}
					<span class="rounded-full bg-foreground px-1.5 py-px font-medium text-[10px] text-background group-aria-[current=true]/kind:bg-background group-aria-[current=true]/kind:text-foreground">Pro</span>
				{/if}
			</span>
			<span class="truncate text-muted-foreground text-xs transition-colors group-aria-[current=true]/kind:text-background/70">{item.spec.description}</span>
		</button>
	</li>
{/snippet}

{#snippet pill(index: number)}
	{#if index >= 0}
		<span
			aria-hidden="true"
			class="absolute inset-x-1 top-1 h-12 rounded-lg bg-foreground transition-transform duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] motion-reduce:transition-none"
			style:transform="translateY({index * ROW_PX}px)"
		></span>
	{/if}
{/snippet}

{#if spec}
	<main class="flex flex-col p-3 xl:h-[calc(100dvh-var(--header-h))]">
		<h1 class="sr-only">Chart studio</h1>
		<div class="grid min-h-0 flex-1 grid-cols-1 gap-3 xl:grid-cols-[24rem_minmax(0,1fr)] xl:grid-rows-2 xl:gap-y-0">
			<!-- Every chart: the ones whose data you edit, then the ones that keep their sample data. -->
			<nav aria-label="Chart type" class="hidden min-h-0 flex-col rounded-xl border border-border bg-card p-1 xl:col-start-1 xl:row-start-1 xl:flex xl:rounded-b-none xl:border-b-0">
				<div class="relative px-1 pt-1 pb-2">
					<IconSearch size={14} class="pointer-events-none absolute top-1/2 left-3.5 -mt-1 -translate-y-1/2 text-muted-foreground" />
					<Input size="sm" bind:value={query} placeholder="Filter charts" aria-label="Filter charts" class="pl-8" />
				</div>
				<div class="min-h-0 flex-1 overflow-y-auto rounded-[7px] bg-background p-1">
					{#if shownKinds.length}
						<p class="px-2.5 pt-1.5 pb-1 font-medium text-muted-foreground text-xs">Your data</p>
						<div class="relative">
							{@render pill(activeKind)}
							<ul class="relative flex flex-col gap-1 p-1">
								{#each shownKinds as item (item.spec.slug)}
									{@render kindRow(item)}
								{/each}
							</ul>
						</div>
					{/if}
					{#if shownSamples.length}
						<p class="px-2.5 pt-3 pb-1 font-medium text-muted-foreground text-xs">Sample data</p>
						<div class="relative">
							{@render pill(activeSample)}
							<ul class="relative flex flex-col gap-1 p-1">
								{#each shownSamples as item (item.spec.slug)}
									{@render kindRow(item)}
								{/each}
							</ul>
						</div>
					{/if}
					{#if !shownKinds.length && !shownSamples.length}
						<p class="px-2.5 py-2 text-muted-foreground text-sm">No chart matches.</p>
					{/if}
				</div>
			</nav>

			<!-- Stage: size switch and actions above, the chart, then its name and a data shuffle. -->
			<section aria-label="Preview" class="flex min-h-[22rem] min-w-0 flex-col rounded-xl border border-border bg-card p-1 xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:min-h-[28rem]">
				<div class="flex flex-wrap items-center justify-between gap-2 px-2 pt-1 pb-2">
					<!-- Phones get a picker instead of the rail, and no size switch: the stage is already phone-wide. -->
					<div class="min-w-0 flex-1 xl:hidden">
						<Select items={allCharts.map((c) => ({ value: c.spec.slug, label: c.spec.name }))} bind:value={() => slug, pick}>
							<SelectTrigger size="sm" aria-label="Chart" class="w-full max-w-56">
								<SelectValue />
							</SelectTrigger>
							<SelectContent size="sm">
								{#each allCharts as item (item.spec.slug)}
									<SelectItem value={item.spec.slug} label={item.spec.name}>{item.spec.name}</SelectItem>
								{/each}
							</SelectContent>
						</Select>
					</div>
					<div class="hidden sm:block">
						<SegmentControl size="sm" label="Preview size" options={FRAMES} current={frame} onPick={(id) => (frame = id)} />
					</div>
					<div class="flex items-center gap-1">
						<Button size="sm" variant="ghost" aria-label={linkCopied ? "Link copied" : "Copy link"} onclick={copyLink}>
							{#if linkCopied}<IconCheck />{:else}<IconCopy />{/if}
							<span class="hidden sm:inline">{linkCopied ? "Link copied" : "Copy link"}</span>
						</Button>
						<Button size="sm" onclick={openCode}>
							<IconFileCode />
							Get code
						</Button>
					</div>
				</div>
				<div class="grid min-h-0 flex-1 place-items-center overflow-auto rounded-[7px] bg-background bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] p-2 sm:p-8">
					<div class={s.frame()}>
						{#if kind}
							{@const square = shape !== "series"}
							{#key `${kind}:${dataset.series.map((x) => x.key).join(",")}:${dataset.rows.length}`}
								<ChartContainer {config} title={dataset.title || undefined} aspect={square ? "square" : undefined}>
									{#if kind === "area"}
										<AreaChart data={seriesData(dataset, kind)} {...parts.chart}>
											<CartesianGrid />
											<YAxis />
											<XAxis />
											{#each dataset.series as item (item.key)}
												<Area dataKey={item.key} {...parts.series} />
											{/each}
											<ChartTooltip />
										</AreaChart>
									{:else if kind === "line"}
										<LineChart data={seriesData(dataset, kind)} {...parts.chart}>
											<CartesianGrid />
											<YAxis />
											<XAxis />
											{#each dataset.series as item (item.key)}
												<Line dataKey={item.key} {...parts.series} />
											{/each}
											<ChartTooltip />
										</LineChart>
									{:else if kind === "bar"}
										<BarChart
											data={seriesData(dataset, kind)}
											{...parts.chart}
											margin={parts.chart.orientation === "horizontal" ? { left: 48, bottom: 28 } : undefined}
										>
											<CartesianGrid />
											<BarTooltip />
											{#each dataset.series as item (item.key)}
												<Bar dataKey={item.key} {...parts.series} />
											{/each}
											<BarXAxis />
											<BarYAxis />
										</BarChart>
									{:else if kind === "scatter"}
										<ScatterChart data={seriesData(dataset, kind)} {...parts.chart}>
											<CartesianGrid />
											<YAxis />
											<XAxis />
											{#each dataset.series as item (item.key)}
												<Scatter dataKey={item.key} {...parts.series} />
											{/each}
											<ChartTooltip dots={false} />
										</ScatterChart>
									{:else if kind === "pie"}
										<PieChart data={sliceData(dataset, false)} {...parts.chart} />
									{:else if kind === "ring"}
										<RingChart data={sliceData(dataset, true)} {...parts.chart} />
									{:else if kind === "funnel"}
										<FunnelChart data={funnelData(dataset)} {...parts.chart} />
									{:else}
										{@const radar = radarData(dataset)}
										<RadarChart data={radar.series} metrics={radar.metrics} {...parts.chart}>
											<RadarGrid />
											<RadarAxis />
											<RadarLabels />
											{#each dataset.series as item, i (item.key)}
												<RadarArea index={i} {...parts.series} />
											{/each}
											<RadarTooltip />
										</RadarChart>
									{/if}
									{#if kind !== "funnel"}<ChartLegend />{/if}
								</ChartContainer>
							{/key}
						{:else}
							<!-- Sample-data charts render their own demo, which reads the same dials. -->
							{#key slug}
								{#await demos[slug]?.()}
									<div class="grid h-64 place-items-center"><Spinner size="sm" label="Loading chart" /></div>
								{:then mod}
									{#if mod}
										{@const Demo = mod.default}
										<div class="flex justify-center"><Demo props={values} /></div>
									{/if}
								{/await}
							{/key}
						{/if}
					</div>
				</div>
				<div class="flex items-center justify-between gap-3 px-2 pt-2 pb-1">
					<div class="min-w-0">
						<p class="truncate font-medium text-foreground text-sm">{spec.name}</p>
						<p class="truncate text-muted-foreground text-xs">
							{kind ? `${dataset.rows.length} rows · ${dataset.series.length} series` : "Sample data; tune it here, swap the data in code"}
						</p>
					</div>
					{#if kind}
						<Button size="sm" variant="outline" onclick={randomise}>
							<IconShuffle />
							Shuffle values
						</Button>
					{/if}
				</div>
			</section>

			<!-- Style: the chart's own dials. Data: edit cells, add rows and series, or paste CSV. -->
			<aside aria-label="Tune the chart" class="flex min-h-0 flex-col rounded-xl border border-border bg-card p-1 xl:col-start-1 xl:row-start-2 xl:rounded-t-none">
				<div class="flex shrink-0 items-start justify-between gap-2 px-2.5 pt-2 pb-1">
					<div>
						<p class="font-medium text-foreground text-sm">Tune the chart</p>
						<p class="text-muted-foreground text-xs">
							{kind ? "Style it, then make the data yours." : "Every option this chart has."}
						</p>
					</div>
					<Button variant="ghost" size="icon-sm" aria-label="Reset" onclick={reset}>
						<IconRefresh />
					</Button>
				</div>
				<Tabs bind:value={tab} variant="underline" size="sm" class="flex min-h-0 flex-1 flex-col">
					<TabsList class="shrink-0 px-2.5">
						<TabsTrigger value="style">Style</TabsTrigger>
						<TabsTrigger value="data" disabled={!kind}>Data</TabsTrigger>
					</TabsList>
					<TabsContent value="style" class="mt-1 min-h-0 flex-1 overflow-y-auto rounded-[7px] bg-background py-2">
						{#key `${slug}:${seed}`}
							<SpecDials {spec} bind:values />
						{/key}
					</TabsContent>
					<TabsContent value="data" class="mt-1 min-h-0 flex-1 overflow-y-auto rounded-[7px] bg-background p-2">
						{#if kind}
							<div class="overflow-x-auto">
								<table class="w-full border-separate border-spacing-1 text-xs">
									<thead>
										<tr>
											<th class="px-1 text-left font-medium text-muted-foreground">{xLabel}</th>
											{#each dataset.series as item, i (i)}
												<th class="min-w-24">
													<div class="flex items-center gap-1">
														{#if shape === "series" || shape === "radar"}
															<span aria-hidden="true" class="size-2 shrink-0 rounded-full" style:background-color="var(--chart-{(i % 5) + 1})"></span>
														{/if}
														{#if limits.fixed}
															<span class="px-1 text-left font-medium text-muted-foreground">{limits.fixed[i]}</span>
														{:else}
															<Input
																size="sm"
																aria-label="Column {i + 1} name"
																value={item.label}
																oninput={(event) => renameSeries(i, event.currentTarget.value)}
																class="h-7"
															/>
														{/if}
														{#if limits.max > limits.min}
															<Button
																size="icon-sm"
																variant="ghost"
																aria-label="Remove {item.label}"
																disabled={dataset.series.length <= limits.min}
																onclick={() => removeSeries(i)}
																class="size-7 shrink-0"
															>
																<IconX />
															</Button>
														{/if}
													</div>
												</th>
											{/each}
											<th class="w-7"></th>
										</tr>
									</thead>
									<tbody>
										{#each dataset.rows as row, r (r)}
											<tr>
												<td>
													<Input
														size="sm"
														aria-label="Row {r + 1} {xLabel.toLowerCase()}"
														aria-invalid={invalid.has(r) || undefined}
														bind:value={row.x}
														class="h-7 min-w-28"
													/>
												</td>
												{#each dataset.series as item, i (i)}
													<td>
														<Input
															size="sm"
															type="number"
															aria-label="{item.label}, row {r + 1}"
															value={String(row.values[i] ?? 0)}
															oninput={(event) => (row.values[i] = Number(event.currentTarget.value) || 0)}
															class="h-7 tabular-nums"
														/>
													</td>
												{/each}
												<td>
													<Button
														size="icon-sm"
														variant="ghost"
														aria-label="Remove row {r + 1}"
														disabled={dataset.rows.length <= 2}
														onclick={() => datasets[shape].rows.splice(r, 1)}
														class="size-7"
													>
														<IconX />
													</Button>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
							{#if invalid.size}
								<p class="mt-1 px-1 text-destructive-strong text-xs">
									{invalid.size === 1 ? "One date doesn't" : `${invalid.size} dates don't`} parse; use YYYY-MM-DD.
								</p>
							{/if}
							<div class="mt-2 flex gap-2 px-1">
								<Button size="xs" variant="outline" onclick={addRow}>Add row</Button>
								{#if limits.max > limits.min}
									<Button size="xs" variant="outline" disabled={dataset.series.length >= limits.max} onclick={addSeries}>
										Add series
									</Button>
								{/if}
							</div>
							<div class="mt-5 border-border border-t px-1 pt-4">
								<label for="chart-title" class="font-medium text-muted-foreground text-xs">Title</label>
								<Input id="chart-title" size="sm" bind:value={datasets[shape].title} placeholder="Chart title" class="mt-1.5" />
							</div>
							<div class="mt-4 px-1">
								<label for="chart-csv" class="font-medium text-muted-foreground text-xs">Paste CSV</label>
								<Textarea
									id="chart-csv"
									bind:value={csv}
									rows={4}
									placeholder={`${xLabel.toLowerCase()},${dataset.series.map((x) => x.key).join(",")}`}
									class="mt-1.5 font-mono text-xs"
								/>
								{#if csvError}<p class="mt-1 text-destructive-strong text-xs">{csvError}</p>{/if}
								<Button size="xs" class="mt-2" disabled={!csv.trim()} onclick={importCsv}>Replace data</Button>
							</div>
						{/if}
					</TabsContent>
				</Tabs>
			</aside>
		</div>
	</main>

	<Sheet bind:open={codeOpen}>
		<SheetContent side="right" variant="framed" class="w-[min(40rem,100vw)]">
			<SheetHeader>
				<SheetTitle>{spec.name}</SheetTitle>
				<SheetClose />
			</SheetHeader>
			{#if locked}
				<ProInstallGate name={spec.name} />
			{:else}
				<InstallCommand slug={spec.slug} />
				<CodeBlock {panels} maxHeight="none" />
				<p class="text-muted-foreground text-xs">
					{kind
						? "Your data and the options you changed are written inline."
						: "The documented usage; pass your own data and the props you tuned."}
				</p>
				{#if !kind && Object.keys(changed).length}
					<div class="rounded-lg border border-border bg-card p-3">
						<p class="font-medium text-muted-foreground text-xs">Props you changed</p>
						<code class="mt-1.5 block font-mono text-foreground text-xs leading-relaxed [overflow-wrap:anywhere]">
							{Object.entries(changed)
								.map(([name, value]) => (typeof value === "string" ? `${name}="${value}"` : `${name}={${JSON.stringify(value)}}`))
								.join(" ")}
						</code>
					</div>
				{/if}
			{/if}
		</SheetContent>
	</Sheet>
{/if}

{#if aboutStudio}<StudioAbout studio={aboutStudio} />{/if}
