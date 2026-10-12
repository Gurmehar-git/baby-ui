<script lang="ts">
import Button from "../button/button.svelte";
import { cn } from "../lib/cn";
import RollingDigits from "../rolling-digits/rolling-digits.svelte";
import Switch from "../switch/switch.svelte";
import ToggleGroup from "../toggle-group/toggle-group.svelte";
import ToggleGroupItem from "../toggle-group/toggle-group-item.svelte";
import {
	type ComparisonBilling,
	type ComparisonColumn,
	type ComparisonSection,
	type ComparisonValue,
	columnPrice,
	comparisonCell,
	hasBilling,
	rowIsShared,
} from "./compare";
import { type ComparisonTableVariant, comparisonTable } from "./variants";

let {
	columns,
	sections,
	variant = "plain",
	title,
	description,
	differencesOnly = $bindable(),
	onDifferencesOnlyChange,
	billing = $bindable(),
	onBillingChange,
	value = $bindable(),
	onValueChange,
	maxHeight,
	footnote,
	locale,
	class: className,
}: {
	columns: ComparisonColumn[];
	sections: ComparisonSection[];
	/** `plain` sits on the page; `card` frames the matrix in a bordered surface. */
	variant?: ComparisonTableVariant;
	title?: string;
	description?: string;
	/** Hide rows where every column reads the same. Bindable. */
	differencesOnly?: boolean;
	onDifferencesOnlyChange?: (value: boolean) => void;
	/** Bindable. */
	billing?: ComparisonBilling;
	onBillingChange?: (billing: ComparisonBilling) => void;
	/** The chosen column, tinted down its length. Bindable. */
	value?: string | null;
	onValueChange?: (id: string | null) => void;
	/** Caps the height and scrolls inside, with the header row sticking to the top. */
	maxHeight?: string;
	footnote?: string;
	locale?: string;
	class?: string;
} = $props();

const uid = $props.id();
const s = $derived(comparisonTable({ variant }));
let ownDiff = $state(false);
let ownBilling = $state<ComparisonBilling>("monthly");
let ownValue = $state<string | null>(null);
const diff = $derived(differencesOnly ?? ownDiff);
const period = $derived(billing ?? ownBilling);
const chosen = $derived(value !== undefined ? value : ownValue);
const money = $derived(
	new Intl.NumberFormat(locale, {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}),
);
const rows = $derived(sections.flatMap((section) => section.rows));
const shown = $derived(rows.filter((row) => !(diff && rowIsShared(row, columns))).length);

function setDiff(next: boolean) {
	if (differencesOnly === undefined) ownDiff = next;
	else differencesOnly = next;
	onDifferencesOnlyChange?.(next);
}
function setBilling(next: string | string[]) {
	const picked = next === "yearly" ? "yearly" : next === "monthly" ? "monthly" : null;
	if (!picked) return;
	if (billing === undefined) ownBilling = picked;
	else billing = picked;
	onBillingChange?.(picked);
}
function choose(column: ComparisonColumn) {
	const next = chosen === column.id ? null : column.id;
	if (value === undefined) ownValue = next;
	else value = next;
	onValueChange?.(next);
	column.action?.onClick?.();
}
</script>

{#snippet mark(raw: ComparisonValue | undefined)}
	{@const cell = comparisonCell(raw)}
	{#if cell.value === true || cell.value === false}
		<svg aria-hidden="true" viewBox="0 0 22 22" fill="none" class={cell.value ? s.check() : s.missing()}>
			<circle cx="11" cy="11" r="9.5" stroke="currentColor" stroke-width="1.5" opacity="0.35" />
			<path d={cell.value ? "M6.6 11.3l3 3 5.9-6.4" : "M7 11h8"} stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
		<span class="sr-only">{cell.value ? "Included" : "Not included"}</span>
	{:else if cell.value === "partial"}
		<svg aria-hidden="true" viewBox="0 0 22 22" fill="none" class={s.partial()}>
			<circle cx="11" cy="11" r="9.25" stroke="currentColor" stroke-width="1.5" />
			<path d="M11 1.75a9.25 9.25 0 0 1 0 18.5z" fill="currentColor" />
		</svg>
		<span class="sr-only">Partly</span>
	{:else}
		<span>{cell.value}</span>
	{/if}
	{#if cell.note}<span class={s.note()}>{cell.note}</span>{/if}
{/snippet}

<section
	data-slot="comparison-table"
	data-variant={variant}
	aria-labelledby={title ? `${uid}-title` : undefined}
	class={cn(s.root(), className)}
>
	<div class={s.inner()}>
		<header class={s.header()}>
			<div class={s.heading()}>
				{#if title}<h2 id="{uid}-title" class={s.title()}>{title}</h2>{/if}
				{#if description}<p class={s.description()}>{description}</p>{/if}
			</div>
			<div class={s.controls()}>
				{#if hasBilling(columns)}
					<ToggleGroup variant="segmented" size="sm" label="Billing period" value={period} onValueChange={setBilling}>
						<ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
						<ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
					</ToggleGroup>
				{/if}
				<Switch bind:checked={() => diff, setDiff} label="Differences only" />
				<span class={s.count()} aria-live="polite">
					<RollingDigits value={shown} startOnView={false} /> of {rows.length} features
				</span>
			</div>
		</header>
		<div class={s.scroller()} style:max-height={maxHeight} style:overflow-y={maxHeight ? "auto" : undefined}>
			<div
				role="table"
				aria-label={title ?? "Comparison"}
				class={s.table()}
				style:grid-template-columns="minmax(11rem, 1.4fr) repeat({columns.length}, minmax(8rem, 1fr))"
			>
				<div role="row" class={cn(s.row(), s.headRow())} style:top="0">
					<div role="columnheader" class={s.labelCell()}><span class="sr-only">Feature</span></div>
					{#each columns as column (column.id)}
						{@const price = columnPrice(column, period)}
						<div
							role="columnheader"
							data-highlight={Boolean(column.highlight)}
							data-selected={chosen === column.id}
							class={cn(s.cell(), s.colHead())}
						>
							<span class={s.colName()}>{column.name}</span>
							{#if column.caption}<span class={s.colCaption()}>{column.caption}</span>{/if}
							{#if price !== undefined}
								<span>
									<RollingDigits variant="count" value={price} format={money.format} startOnView={false} class={s.price()} />
									<span class={s.period()}> per seat / month</span>
								</span>
							{/if}
							{#if column.action}
								{#if column.action.href}
									<Button size="sm" variant={column.highlight ? "default" : "outline"} href={column.action.href}>{column.action.label}</Button>
								{:else}
									<Button
										size="sm"
										variant={chosen === column.id || column.highlight ? "default" : "outline"}
										aria-pressed={chosen === column.id}
										onclick={() => choose(column)}
									>
										{chosen === column.id ? "Selected" : column.action.label}
									</Button>
								{/if}
							{/if}
						</div>
					{/each}
				</div>
				{#each sections as section (section.id)}
					{#if section.title}
						<div role="row" class={s.row()}>
							<div role="rowheader" class={s.section()}>{section.title}</div>
						</div>
					{/if}
					{#each section.rows as row (row.id)}
						{@const gone = diff && rowIsShared(row, columns)}
						<div role="row" data-hidden={gone} aria-hidden={gone || undefined} class={s.fold()}>
							<div class={s.foldInner()}>
								<div role="rowheader" class={s.labelCell()}>
									<span>{row.feature}</span>
									{#if row.hint}<span class={s.hint()}>{row.hint}</span>{/if}
								</div>
								{#each columns as column (column.id)}
									<div role="cell" data-highlight={Boolean(column.highlight)} data-selected={chosen === column.id} class={s.cell()}>
										{@render mark(row.values[column.id])}
									</div>
								{/each}
							</div>
						</div>
					{/each}
				{/each}
			</div>
		</div>
		{#if footnote}<p class={s.footnote()}>{footnote}</p>{/if}
	</div>
</section>
