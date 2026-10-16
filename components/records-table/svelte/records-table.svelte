<script lang="ts">
import Avatar from "../../avatar/svelte/avatar.svelte";
import AvatarFallback from "../../avatar/svelte/avatar-fallback.svelte";
import AvatarImage from "../../avatar/svelte/avatar-image.svelte";
import Checkbox from "../../checkbox/svelte/checkbox.svelte";
import DropdownMenu from "../../dropdown-menu/svelte/dropdown-menu.svelte";
import DropdownMenuContent from "../../dropdown-menu/svelte/dropdown-menu-content.svelte";
import DropdownMenuItem from "../../dropdown-menu/svelte/dropdown-menu-item.svelte";
import DropdownMenuTrigger from "../../dropdown-menu/svelte/dropdown-menu-trigger.svelte";
import { cn } from "../../lib/svelte/cn";
import Popover from "../../popover/svelte/popover.svelte";
import PopoverContent from "../../popover/svelte/popover-content.svelte";
import PopoverTrigger from "../../popover/svelte/popover-trigger.svelte";
import ConfigPopover from "./config-popover.svelte";
import GlyphIcon from "./glyph-icon.svelte";
import {
	ACTIONS_WIDTH,
	COLUMN_ORDER,
	COLUMN_WIDTHS,
	INPUT_COLUMNS,
	nextSort,
	pinOffsets,
	RECORDS_TABLE_LABELS,
	resolveColumn,
	sortRows,
	strengthLabel,
	strengthRank,
	TYPE_GLYPHS,
	toggleIn,
	updateColumn,
} from "./model";
import TagList from "./tag-list.svelte";
import type {
	ColumnKey,
	RecordRow,
	RecordSort,
	RecordSortKey,
	RecordsTableConfig,
	RecordsTableLabels,
} from "./types";
import { type RecordsDensity, recordsTable, strengthDot } from "./variants";

let {
	rows,
	labels,
	fill = false,
	density = "comfortable",
	modelOptions = [],
	calculatingColumn = null,
	resolvedCount = 0,
	onCalculate,
	selected = $bindable([]),
	onSelectedChange,
	sort = $bindable({ key: "name", dir: 1 }),
	onSortChange,
	pinned = $bindable([]),
	onPinnedChange,
	showAiColumn = $bindable(false),
	onShowAiColumnChange,
	config = $bindable({}),
	onConfigChange,
	class: classProp,
}: {
	/** Every company row shown. Required: this table has no sample data of its own. */
	rows: RecordRow[];
	labels?: Partial<RecordsTableLabels>;
	fill?: boolean;
	density?: RecordsDensity;
	/** Real model names offered by the Tool picker; empty offers nothing. */
	modelOptions?: string[];
	/** Column currently revealing computed values row by row. `null`/omitted shows none. */
	calculatingColumn?: string | null;
	/** Row count already resolved for `calculatingColumn`. */
	resolvedCount?: number;
	/** Fired when "Go calculate" is pressed; the caller owns the reveal timing. */
	onCalculate?: (column: ColumnKey) => void;
	selected?: string[];
	onSelectedChange?: (ids: string[]) => void;
	sort?: RecordSort;
	onSortChange?: (sort: RecordSort) => void;
	/** Columns kept in view while the table scrolls sideways. */
	pinned?: ColumnKey[];
	onPinnedChange?: (pinned: ColumnKey[]) => void;
	showAiColumn?: boolean;
	onShowAiColumnChange?: (show: boolean) => void;
	/** Per-column type, tool, inputs, prompt and behaviour settings. */
	config?: RecordsTableConfig;
	onConfigChange?: (config: RecordsTableConfig) => void;
	class?: string;
} = $props();

const text: RecordsTableLabels = $derived({ ...RECORDS_TABLE_LABELS, ...labels });
let widthOverrides = $state<Partial<Record<ColumnKey, number>>>({});
let resizingColumn = $state<ColumnKey | null>(null);
let openColumn = $state<ColumnKey | null>(null);
const classes = $derived(recordsTable({ density, aiShown: showAiColumn }));

const widths = $derived({ ...COLUMN_WIDTHS[density], ...widthOverrides });
const visibleColumns = $derived(
	COLUMN_ORDER.filter((key) => key !== "ai" || showAiColumn),
);
const offsets = $derived(pinOffsets(pinned, visibleColumns, widths));
const visibleRows = $derived(sortRows(rows, sort));
const allSelected = $derived(
	visibleRows.length > 0 && visibleRows.every((row) => selected.includes(row.id)),
);
const partiallySelected = $derived(
	!allSelected && visibleRows.some((row) => selected.includes(row.id)),
);
const tableWidth = $derived(
	visibleColumns.reduce((sum, key) => sum + widths[key], ACTIONS_WIDTH),
);

function setSelected(next: string[]) {
	selected = next;
	onSelectedChange?.(next);
}
function setSort(next: RecordSort) {
	sort = next;
	onSortChange?.(next);
}
function setPinned(next: ColumnKey[]) {
	pinned = next;
	onPinnedChange?.(next);
}
function setAiShown(next: boolean) {
	showAiColumn = next;
	onShowAiColumnChange?.(next);
}
function setConfig(next: RecordsTableConfig) {
	config = next;
	onConfigChange?.(next);
}

function isCalc(col: ColumnKey, index: number) {
	return calculatingColumn === col && index >= resolvedCount;
}

/** Sticky placement for pinned columns. */
function pinStyle(key: ColumnKey) {
	const left = offsets[key];
	return left === undefined
		? undefined
		: `position: sticky; left: ${left}px; z-index: 2;`;
}
function pinClass(key: ColumnKey, selectedRow = false) {
	if (offsets[key] === undefined) return undefined;
	return classes.pinCell({ selected: selectedRow });
}

function toggleAll() {
	const ids = visibleRows.map((row) => row.id);
	setSelected(
		allSelected
			? selected.filter((id) => !ids.includes(id))
			: [...new Set([...selected, ...ids])],
	);
}

function startColumnResize(key: ColumnKey, minWidth = 120) {
	return (event: PointerEvent) => {
		event.preventDefault();
		event.stopPropagation();
		openColumn = null;
		const startX = event.clientX;
		const startWidth = widths[key];
		document.body.style.cursor = "col-resize";
		document.body.style.userSelect = "none";
		resizingColumn = key;
		function move(moveEvent: PointerEvent) {
			const width = Math.max(minWidth, startWidth + moveEvent.clientX - startX);
			widthOverrides = { ...widthOverrides, [key]: width };
		}
		function finish() {
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", finish);
			window.removeEventListener("pointercancel", finish);
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
			resizingColumn = null;
		}
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", finish);
		window.addEventListener("pointercancel", finish);
	};
}

const hideAi = () => {
	setAiShown(false);
	openColumn = null;
};
const footerCell = $derived(
	cn(classes.cell(), "border-border border-r text-muted-foreground text-xs"),
);
</script>

{#snippet header(key: ColumnKey, sortKey?: RecordSortKey, withSelectAll = false, onHide?: () => void)}
	{@const label = text[key]}
	<th
		style={pinStyle(key)}
		inert={key === "ai" && !showAiColumn}
		class={cn(
			classes.headerCell(),
			"relative border-border border-r border-b bg-card text-left font-medium text-xs text-muted-foreground",
			openColumn === key && "bg-primary/[0.04]",
			key === "ai" && classes.aiCell(),
		)}
	>
		<div class={cn("flex min-w-0 items-center gap-1.5", key === "ai" && classes.aiInner())}>
			{#if withSelectAll}
				<Checkbox
					bind:checked={() => allSelected, () => toggleAll()}
					indeterminate={partiallySelected}
					aria-label={text.selectAll}
					class="shrink-0"
				/>
			{/if}
			<Popover bind:open={() => openColumn === key, (o) => (openColumn = o ? key : null)}>
				<PopoverTrigger
					class="min-w-0 items-center gap-1.5 truncate rounded-md px-1 hover:bg-accent"
					aria-label={text.configure(label)}
				>
					<GlyphIcon glyphs={TYPE_GLYPHS[resolveColumn(key, config, text).type]} />
					<span class="truncate">{label}</span>
				</PopoverTrigger>
				<PopoverContent align="start" class="w-80 p-3">
					<ConfigPopover
						title={label}
						labels={text}
						column={resolveColumn(key, config, text)}
						onChange={(patch) => setConfig(updateColumn(config, key, patch))}
						inputOptions={INPUT_COLUMNS.filter((k) => k !== key).map((k) => text[k])}
						{modelOptions}
						pinned={pinned.includes(key)}
						onTogglePin={() => setPinned(toggleIn(pinned, key))}
						{onHide}
						calculating={calculatingColumn != null}
						onCalculate={() => {
							onCalculate?.(key);
							openColumn = null;
						}}
					/>
				</PopoverContent>
			</Popover>
			{#if sortKey}
				<button
					type="button"
					aria-label={text.sortBy(label)}
					aria-pressed={sort.key === sortKey}
					onclick={(event) => {
						event.stopPropagation();
						setSort(nextSort(sort, sortKey));
					}}
					class={cn(
						"shrink-0 cursor-pointer text-muted-foreground transition-[opacity,rotate] duration-(--duration-fast) motion-reduce:transition-none",
						sort.key === sortKey ? "opacity-100" : "opacity-0 hover:opacity-60 focus-visible:opacity-60",
						sort.key === sortKey && sort.dir === -1 && "rotate-180",
					)}
				>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M12 5v14M5 12l7 7 7-7" />
					</svg>
				</button>
			{/if}
		</div>
		<!-- svelte-ignore a11y_no_static_element_interactions -- pointer drag handle, not a real separator control -->
		<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -- a column resize handle can't be a semantic <hr> -->
		<span
			role="separator"
			aria-orientation="vertical"
			aria-label={text.resize(label)}
			onpointerdown={startColumnResize(key)}
			class={cn(
				"-right-0.5 absolute inset-y-0 w-1 cursor-col-resize touch-none",
				resizingColumn === key && "bg-primary/40",
			)}
		></span>
	</th>
{/snippet}

{#snippet calcCell()}
	<span class="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
		{text.calculating}
		<span class="size-1.5 animate-pulse rounded-full bg-muted-foreground motion-reduce:animate-none"></span>
	</span>
{/snippet}

<div data-slot="records-table" class={cn(classes.root(), fill ? "w-full" : "w-fit max-w-full", classProp)}>
	<div data-slot="records-table-scroll" class="overflow-auto rounded-2xl border border-border" style="scrollbar-width: thin;">
		<table class={classes.table()} style="width: {fill ? '100%' : `${tableWidth}px`}; min-width: {tableWidth}px;">
			<colgroup>
				{#each COLUMN_ORDER as key (key)}
					{#if key === "ai"}
						<col class={classes.aiCol()} style="width: {showAiColumn ? widths.ai : 0}px;" />
					{:else}
						<col style="width: {widths[key]}px;" />
					{/if}
				{/each}
				<col style="width: {ACTIONS_WIDTH}px;" />
			</colgroup>
			<thead>
				<tr>
					{@render header("company", "name", true)}
					{@render header("categories")}
					{@render header("last", "last")}
					{@render header("strength", "strength")}
					{@render header("links")}
					{@render header("ai", undefined, false, hideAi)}
					<th class={cn(classes.headerCell(), "border-border border-b bg-card px-2")}>
						<div class="flex items-center gap-1">
							<DropdownMenu>
								<DropdownMenuTrigger
									aria-label={text.newProperty}
									class="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
								>
									<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<path d="M12 5v14M5 12h14" />
									</svg>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										onclick={() => {
											setAiShown(true);
											openColumn = "ai";
										}}
									>
										{text.ai}
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
							<DropdownMenu>
								<DropdownMenuTrigger
									aria-label={text.tableOptions}
									class="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
								>
									<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
										<circle cx="5" cy="12" r="1.6" />
										<circle cx="12" cy="12" r="1.6" />
										<circle cx="19" cy="12" r="1.6" />
									</svg>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem onclick={() => setAiShown(true)}>{text.addProperty}</DropdownMenuItem>
									<DropdownMenuItem onclick={() => (widthOverrides = { ...COLUMN_WIDTHS.compact })}>
										{text.compactColumns}
									</DropdownMenuItem>
									<DropdownMenuItem onclick={() => (widthOverrides = {})}>{text.resetWidths}</DropdownMenuItem>
									<DropdownMenuItem onclick={() => setSelected([])}>{text.clearSelection}</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</th>
				</tr>
			</thead>
			<tbody>
				{#each visibleRows as row, index (row.id)}
					{@const isSelected = selected.includes(row.id)}
					{@const td = (key: ColumnKey, extra?: string | false) =>
						cn(classes.cell(), "border-border border-r border-b", pinClass(key, isSelected), extra)}
					<tr
						data-slot="records-table-row"
						data-selected={isSelected || undefined}
						class={classes.row({ selected: isSelected })}
					>
						<td style={pinStyle("company")} class={td("company")}>
							<div class="flex min-w-0 items-center gap-2">
								<span class="w-4 shrink-0 text-xs text-muted-foreground tabular-nums">{index + 1}</span>
								<Checkbox
									bind:checked={() => isSelected, () => setSelected(toggleIn(selected, row.id))}
									aria-label={text.selectRow(row.name)}
									class="shrink-0"
								/>
								<Avatar aria-hidden="true" shape="square" class="size-5 rounded-[5px] bg-muted text-xs">
									<AvatarImage src={row.logo} alt="" />
									<AvatarFallback>{row.name.charAt(0)}</AvatarFallback>
								</Avatar>
								<a
									href={row.website ? `https://${row.website}` : undefined}
									onclick={(event) => {
										if (!row.website) event.preventDefault();
									}}
									title={row.name}
									class={cn("min-w-0 truncate font-medium text-foreground", row.website && "hover:underline")}
								>
									{row.name}
								</a>
							</div>
						</td>
						<td style={pinStyle("categories")} class={td("categories")}>
							{#if isCalc("categories", index)}
								{@render calcCell()}
							{:else}
								<TagList tags={row.tags} />
							{/if}
						</td>
						<td style={pinStyle("last")} class={td("last", row.strength === "none" && "text-muted-foreground")}>
							{#if isCalc("last", index)}
								{@render calcCell()}
							{:else}
								{row.last}
							{/if}
						</td>
						<td style={pinStyle("strength")} class={td("strength")}>
							{#if isCalc("strength", index)}
								{@render calcCell()}
							{:else}
								<span class="inline-flex items-center gap-1.5">
									<span class={strengthDot({ strength: row.strength })}></span>
									{strengthLabel(row.strength, text)}
								</span>
							{/if}
						</td>
						<td style={pinStyle("links")} class={td("links")}>
							{#if isCalc("links", index)}
								{@render calcCell()}
							{:else if row.website}
								<a class="inline-flex min-w-0 items-center gap-1 text-primary hover:underline" href={`https://${row.website}`} title={row.website} target="_blank" rel="noreferrer">
									<span class="min-w-0 truncate">{row.website}</span>
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<path d="M14 5h5v5M19 5l-8 8" />
									</svg>
								</a>
							{:else}
								<span class="text-muted-foreground">{text.empty}</span>
							{/if}
						</td>
						<td style={pinStyle("ai")} inert={!showAiColumn} class={td("ai", classes.aiCell())}>
							<div class={classes.aiInner()}>
								{#if isCalc("ai", index)}
									{@render calcCell()}
								{:else}
									<span class={row.aiValue ? undefined : "text-muted-foreground"}>{row.aiValue ?? text.empty}</span>
								{/if}
							</div>
						</td>
						<td class={cn(classes.cell(), "border-border border-b px-2")}></td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<td style={pinStyle("company")} class={cn(footerCell, pinClass("company"))}>{text.count(rows.length)}</td>
					<td style={pinStyle("categories")} class={cn(classes.cell(), "border-border border-r", pinClass("categories"))}></td>
					<td style={pinStyle("last")} class={cn(footerCell, pinClass("last"))}>{text.empty}</td>
					<td style={pinStyle("strength")} class={cn(footerCell, "tabular-nums", pinClass("strength"))}>
						{rows.length
							? text.average(
									Math.round((rows.reduce((sum, row) => sum + strengthRank(row.strength), 0) / rows.length / 3) * 100),
								)
							: text.empty}
					</td>
					<td style={pinStyle("links")} class={cn(footerCell, pinClass("links"))}>
						{text.linkCount(rows.filter((row) => row.website).length)}
					</td>
					<td style={pinStyle("ai")} inert={!showAiColumn} class={cn(footerCell, pinClass("ai"), classes.aiCell())}>
						<div class={classes.aiInner()}>{text.filled(rows.filter((row) => row.aiValue).length)}</div>
					</td>
					<td class={cn(classes.cell(), "px-2")}></td>
				</tr>
			</tfoot>
		</table>
	</div>
</div>
