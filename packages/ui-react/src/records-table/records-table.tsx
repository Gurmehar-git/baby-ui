"use client";

import {
	type CSSProperties,
	type ReactNode,
	type PointerEvent as ReactPointerEvent,
	useMemo,
	useState,
} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar/avatar";
import { Checkbox } from "../checkbox/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../dropdown-menu/dropdown-menu";
import { cn } from "../lib/cn";
import { Popover, PopoverContent, PopoverTrigger } from "../popover/popover";
import { ConfigPopover, GlyphIcon, Icon } from "./config-popover";
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
import { TagList } from "./tag-list";
import type {
	ColumnKey,
	RecordRow,
	RecordSort,
	RecordSortKey,
	RecordsTableConfig,
	RecordsTableLabels,
} from "./types";
import { type RecordsDensity, recordsTable, strengthDot } from "./variants";

export type {
	ColumnKey,
	RecordRow,
	RecordSort,
	RecordSortKey,
	RecordsColumnConfig,
	RecordsColumnMeta,
	RecordsColumnSettings,
	RecordsColumnType,
	RecordsPrompt,
	RecordsTableConfig,
	RecordsTableLabels,
	RecordsToolKind,
} from "./types";
export type { RecordStrength, RecordsDensity } from "./variants";

/** Value from `value` when controlled, else local state; `set` always reports through `onChange`. */
function useControllable<T>(
	value: T | undefined,
	initial: T,
	onChange?: (next: T) => void,
) {
	const [inner, setInner] = useState(initial);
	const current = value ?? inner;
	const set = (next: T) => {
		if (value === undefined) setInner(next);
		onChange?.(next);
	};
	return [current, set] as const;
}

function CalcCell({ label }: { label: string }) {
	return (
		<span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
			{label}
			<span className="size-1.5 animate-pulse rounded-full bg-muted-foreground motion-reduce:animate-none" />
		</span>
	);
}

export interface RecordsTableProps {
	/** Every company row shown. Required: this table has no sample data of its own. */
	rows: RecordRow[];
	labels?: Partial<RecordsTableLabels>;
	/** Stretches to fill its container instead of sizing to its own columns. */
	fill?: boolean;
	density?: RecordsDensity;
	/** Real model names offered by the Tool picker; empty offers nothing. */
	modelOptions?: string[];
	/** Column currently revealing computed values row by row. `null`/omitted shows none. */
	calculatingColumn?: string | null;
	/** Row count already resolved for `calculatingColumn`. */
	resolvedCount?: number;
	/** Fired when "Go calculate" is pressed for a column; the caller owns the reveal timing. */
	onCalculate?: (column: ColumnKey) => void;
	/** Controlled selected row ids. */
	selected?: string[];
	defaultSelected?: string[];
	onSelectedChange?: (ids: string[]) => void;
	sort?: RecordSort;
	defaultSort?: RecordSort;
	onSortChange?: (sort: RecordSort) => void;
	/** Columns kept in view while the table scrolls sideways. */
	pinned?: ColumnKey[];
	defaultPinned?: ColumnKey[];
	onPinnedChange?: (pinned: ColumnKey[]) => void;
	showAiColumn?: boolean;
	defaultShowAiColumn?: boolean;
	onShowAiColumnChange?: (show: boolean) => void;
	/** Per-column type, tool, inputs, prompt and behaviour settings. */
	config?: RecordsTableConfig;
	defaultConfig?: RecordsTableConfig;
	onConfigChange?: (config: RecordsTableConfig) => void;
	className?: string;
}

/** An AI-spreadsheet grid. Columns are configurable properties: click a header to open its
 * config (type, tool, inputs), add a new AI column, and reveal it row-by-row on calculate. */
export function RecordsTable({
	rows,
	labels,
	fill = false,
	density = "comfortable",
	modelOptions = [],
	calculatingColumn = null,
	resolvedCount = 0,
	onCalculate,
	selected: selectedProp,
	defaultSelected = [],
	onSelectedChange,
	sort: sortProp,
	defaultSort = { key: "name", dir: 1 },
	onSortChange,
	pinned: pinnedProp,
	defaultPinned = [],
	onPinnedChange,
	showAiColumn,
	defaultShowAiColumn = false,
	onShowAiColumnChange,
	config: configProp,
	defaultConfig = {},
	onConfigChange,
	className,
}: RecordsTableProps) {
	const text: RecordsTableLabels = { ...RECORDS_TABLE_LABELS, ...labels };
	const [selected, setSelected] = useControllable(
		selectedProp,
		defaultSelected,
		onSelectedChange,
	);
	const [sort, setSort] = useControllable(sortProp, defaultSort, onSortChange);
	const [pinned, setPinned] = useControllable(pinnedProp, defaultPinned, onPinnedChange);
	const [aiShown, setAiShown] = useControllable(
		showAiColumn,
		defaultShowAiColumn,
		onShowAiColumnChange,
	);
	const [config, setConfig] = useControllable(configProp, defaultConfig, onConfigChange);
	const [widthOverrides, setWidthOverrides] = useState<
		Partial<Record<ColumnKey, number>>
	>({});
	const [resizingColumn, setResizingColumn] = useState<ColumnKey | null>(null);
	const [openColumn, setOpenColumn] = useState<ColumnKey | null>(null);
	const {
		root,
		table,
		cell,
		headerCell,
		row: rowClass,
		pinCell,
		aiCol,
		aiCell,
		aiInner,
	} = recordsTable({ density, aiShown });

	const widths = { ...COLUMN_WIDTHS[density], ...widthOverrides };
	const visibleColumns = COLUMN_ORDER.filter((key) => key !== "ai" || aiShown);
	const offsets = pinOffsets(pinned, visibleColumns, widths);
	const visibleRows = useMemo(() => sortRows(rows, sort), [rows, sort]);
	const allSelected =
		visibleRows.length > 0 && visibleRows.every((row) => selected.includes(row.id));
	const partiallySelected =
		!allSelected && visibleRows.some((row) => selected.includes(row.id));
	const tableWidth = visibleColumns.reduce(
		(sum, key) => sum + widths[key],
		ACTIONS_WIDTH,
	);

	const isCalc = (col: ColumnKey, index: number) =>
		calculatingColumn === col && index >= resolvedCount;
	/** Sticky placement for pinned columns; `selectedRow` keeps the row tint opaque over scrolled cells. */
	const pinStyle = (key: ColumnKey): CSSProperties | undefined =>
		offsets[key] === undefined
			? undefined
			: { position: "sticky", left: offsets[key], zIndex: 2 };
	const pinClass = (key: ColumnKey, selectedRow = false) =>
		offsets[key] === undefined ? undefined : pinCell({ selected: selectedRow });
	/** The AI column stays mounted so show/hide animates its width instead of snapping. */
	const aiProps = (key: ColumnKey) => (key === "ai" ? { inert: !aiShown } : {});

	function toggleAll() {
		const ids = visibleRows.map((row) => row.id);
		setSelected(
			allSelected
				? selected.filter((id) => !ids.includes(id))
				: [...new Set([...selected, ...ids])],
		);
	}

	function startColumnResize(key: ColumnKey, minWidth = 120) {
		return (event: ReactPointerEvent<HTMLSpanElement>) => {
			event.preventDefault();
			event.stopPropagation();
			setOpenColumn(null);
			const startX = event.clientX;
			const startWidth = widths[key];
			document.body.style.cursor = "col-resize";
			document.body.style.userSelect = "none";
			setResizingColumn(key);
			function move(moveEvent: PointerEvent) {
				const width = Math.max(minWidth, startWidth + moveEvent.clientX - startX);
				setWidthOverrides((current) => ({ ...current, [key]: width }));
			}
			function finish() {
				window.removeEventListener("pointermove", move);
				window.removeEventListener("pointerup", finish);
				window.removeEventListener("pointercancel", finish);
				document.body.style.cursor = "";
				document.body.style.userSelect = "";
				setResizingColumn(null);
			}
			window.addEventListener("pointermove", move);
			window.addEventListener("pointerup", finish);
			window.addEventListener("pointercancel", finish);
		};
	}

	function configPopover(key: ColumnKey, onHide?: () => void) {
		return (
			<ConfigPopover
				title={text[key]}
				labels={text}
				column={resolveColumn(key, config, text)}
				onChange={(patch) => setConfig(updateColumn(config, key, patch))}
				inputOptions={INPUT_COLUMNS.filter((k) => k !== key).map((k) => text[k])}
				modelOptions={modelOptions}
				pinned={pinned.includes(key)}
				onTogglePin={() => setPinned(toggleIn(pinned, key))}
				onHide={onHide}
				calculating={calculatingColumn != null}
				onCalculate={() => {
					onCalculate?.(key);
					setOpenColumn(null);
				}}
			/>
		);
	}

	function header(
		key: ColumnKey,
		sortKey?: RecordSortKey,
		lead?: ReactNode,
		onHide?: () => void,
	) {
		const label = text[key];
		return (
			<th
				key={key}
				style={pinStyle(key)}
				{...aiProps(key)}
				className={cn(
					headerCell(),
					"relative border-border border-r border-b bg-card text-left font-medium text-xs text-muted-foreground",
					openColumn === key && "bg-primary/[0.04]",
					key === "ai" && aiCell(),
				)}
			>
				<div
					className={cn("flex min-w-0 items-center gap-1.5", key === "ai" && aiInner())}
				>
					{lead}
					<Popover
						open={openColumn === key}
						onOpenChange={(o) => setOpenColumn(o ? key : null)}
					>
						<PopoverTrigger
							className="min-w-0 items-center gap-1.5 truncate rounded-md px-1 hover:bg-accent"
							aria-label={text.configure(label)}
						>
							<GlyphIcon glyphs={TYPE_GLYPHS[resolveColumn(key, config, text).type]} />
							<span className="truncate">{label}</span>
						</PopoverTrigger>
						<PopoverContent align="start" className="w-80 p-3">
							{configPopover(key, onHide)}
						</PopoverContent>
					</Popover>
					{sortKey ? (
						<button
							type="button"
							aria-label={text.sortBy(label)}
							aria-pressed={sort.key === sortKey}
							onClick={(event) => {
								event.stopPropagation();
								setSort(nextSort(sort, sortKey));
							}}
							className={cn(
								"shrink-0 cursor-pointer text-muted-foreground transition-[opacity,rotate] duration-(--duration-fast) motion-reduce:transition-none",
								sort.key === sortKey
									? "opacity-100"
									: "opacity-0 hover:opacity-60 focus-visible:opacity-60",
								sort.key === sortKey && sort.dir === -1 && "rotate-180",
							)}
						>
							<Icon size={12}>
								<path d="M12 5v14M5 12l7 7 7-7" />
							</Icon>
						</button>
					) : null}
				</div>
				{/* biome-ignore lint/a11y/useSemanticElements: a drag handle can't be a semantic <hr> */}
				<span
					role="separator"
					aria-orientation="vertical"
					aria-label={text.resize(label)}
					onPointerDown={startColumnResize(key)}
					className={cn(
						"-right-0.5 absolute inset-y-0 w-1 cursor-col-resize touch-none",
						resizingColumn === key && "bg-primary/40",
					)}
				/>
			</th>
		);
	}

	const footerCell = cn(cell(), "border-border border-r text-muted-foreground text-xs");

	return (
		<div
			data-slot="records-table"
			className={cn(root(), fill ? "w-full" : "w-fit max-w-full", className)}
		>
			<div
				data-slot="records-table-scroll"
				className="overflow-auto rounded-2xl border border-border"
				style={{ scrollbarWidth: "thin" }}
			>
				<table
					className={table()}
					style={{ width: fill ? "100%" : tableWidth, minWidth: tableWidth }}
				>
					<colgroup>
						{COLUMN_ORDER.map((key) =>
							key === "ai" ? (
								<col
									key={key}
									className={aiCol()}
									style={{ width: aiShown ? widths.ai : 0 }}
								/>
							) : (
								<col key={key} style={{ width: widths[key] }} />
							),
						)}
						<col style={{ width: ACTIONS_WIDTH }} />
					</colgroup>
					<thead>
						<tr>
							{header(
								"company",
								"name",
								<Checkbox
									checked={allSelected}
									indeterminate={partiallySelected}
									onCheckedChange={toggleAll}
									aria-label={text.selectAll}
									className="shrink-0"
								/>,
							)}
							{header("categories")}
							{header("last", "last")}
							{header("strength", "strength")}
							{header("links")}
							{header("ai", undefined, undefined, () => {
								setAiShown(false);
								setOpenColumn(null);
							})}
							<th className={cn(headerCell(), "border-border border-b bg-card px-2")}>
								<div className="flex items-center gap-1">
									<DropdownMenu>
										<DropdownMenuTrigger
											aria-label={text.newProperty}
											className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
										>
											<Icon size={15}>
												<path d="M12 5v14M5 12h14" />
											</Icon>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onClick={() => {
													setAiShown(true);
													setOpenColumn("ai");
												}}
											>
												{text.ai}
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
									<DropdownMenu>
										<DropdownMenuTrigger
											aria-label={text.tableOptions}
											className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
										>
											<svg
												width="15"
												height="15"
												viewBox="0 0 24 24"
												fill="currentColor"
												aria-hidden
											>
												<circle cx="5" cy="12" r="1.6" />
												<circle cx="12" cy="12" r="1.6" />
												<circle cx="19" cy="12" r="1.6" />
											</svg>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem onClick={() => setAiShown(true)}>
												{text.addProperty}
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => setWidthOverrides(COLUMN_WIDTHS.compact)}
											>
												{text.compactColumns}
											</DropdownMenuItem>
											<DropdownMenuItem onClick={() => setWidthOverrides({})}>
												{text.resetWidths}
											</DropdownMenuItem>
											<DropdownMenuItem onClick={() => setSelected([])}>
												{text.clearSelection}
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</th>
						</tr>
					</thead>
					<tbody>
						{visibleRows.map((row, index) => {
							const isSelected = selected.includes(row.id);
							const td = (key: ColumnKey, extra?: string) => ({
								style: pinStyle(key),
								...aiProps(key),
								className: cn(
									cell(),
									"border-border border-r border-b",
									pinClass(key, isSelected),
									key === "ai" && aiCell(),
									extra,
								),
							});
							return (
								<tr
									key={row.id}
									data-slot="records-table-row"
									data-selected={isSelected || undefined}
									className={rowClass({ selected: isSelected })}
								>
									<td {...td("company")}>
										<div className="flex min-w-0 items-center gap-2">
											<span className="w-4 shrink-0 text-xs text-muted-foreground tabular-nums">
												{index + 1}
											</span>
											<Checkbox
												checked={isSelected}
												onCheckedChange={() => setSelected(toggleIn(selected, row.id))}
												aria-label={text.selectRow(row.name)}
												className="shrink-0"
											/>
											<Avatar
												aria-hidden
												shape="square"
												className="size-5 rounded-[5px] bg-muted text-xs"
											>
												<AvatarImage src={row.logo} alt="" />
												<AvatarFallback>{row.name.charAt(0)}</AvatarFallback>
											</Avatar>
											<a
												href={row.website ? `https://${row.website}` : undefined}
												onClick={(event) => {
													if (!row.website) event.preventDefault();
												}}
												title={row.name}
												className={cn(
													"min-w-0 truncate font-medium text-foreground",
													row.website && "hover:underline",
												)}
											>
												{row.name}
											</a>
										</div>
									</td>
									<td {...td("categories")}>
										{isCalc("categories", index) ? (
											<CalcCell label={text.calculating} />
										) : (
											<TagList tags={row.tags} />
										)}
									</td>
									<td
										{...td(
											"last",
											row.strength === "none" ? "text-muted-foreground" : undefined,
										)}
									>
										{isCalc("last", index) ? (
											<CalcCell label={text.calculating} />
										) : (
											row.last
										)}
									</td>
									<td {...td("strength")}>
										{isCalc("strength", index) ? (
											<CalcCell label={text.calculating} />
										) : (
											<span className="inline-flex items-center gap-1.5">
												<span className={strengthDot({ strength: row.strength })} />
												{strengthLabel(row.strength, text)}
											</span>
										)}
									</td>
									<td {...td("links")}>
										{isCalc("links", index) ? (
											<CalcCell label={text.calculating} />
										) : row.website ? (
											<a
												className="inline-flex min-w-0 items-center gap-1 text-primary hover:underline"
												href={`https://${row.website}`}
												title={row.website}
												target="_blank"
												rel="noreferrer"
											>
												<span className="min-w-0 truncate">{row.website}</span>
												<Icon size={12}>
													<path d="M14 5h5v5M19 5l-8 8" />
												</Icon>
											</a>
										) : (
											<span className="text-muted-foreground">{text.empty}</span>
										)}
									</td>
									<td {...td("ai")}>
										<div className={aiInner()}>
											{isCalc("ai", index) ? (
												<CalcCell label={text.calculating} />
											) : (
												<span
													className={row.aiValue ? undefined : "text-muted-foreground"}
												>
													{row.aiValue ?? text.empty}
												</span>
											)}
										</div>
									</td>
									<td className={cn(cell(), "border-border border-b px-2")} />
								</tr>
							);
						})}
					</tbody>
					<tfoot>
						<tr>
							<td
								style={pinStyle("company")}
								className={cn(footerCell, pinClass("company"))}
							>
								{text.count(rows.length)}
							</td>
							<td
								style={pinStyle("categories")}
								className={cn(cell(), "border-border border-r", pinClass("categories"))}
							/>
							<td style={pinStyle("last")} className={cn(footerCell, pinClass("last"))}>
								{text.empty}
							</td>
							<td
								style={pinStyle("strength")}
								className={cn(footerCell, "tabular-nums", pinClass("strength"))}
							>
								{rows.length
									? text.average(
											Math.round(
												(rows.reduce((sum, row) => sum + strengthRank(row.strength), 0) /
													rows.length /
													3) *
													100,
											),
										)
									: text.empty}
							</td>
							<td style={pinStyle("links")} className={cn(footerCell, pinClass("links"))}>
								{text.linkCount(rows.filter((row) => row.website).length)}
							</td>
							<td
								style={pinStyle("ai")}
								{...aiProps("ai")}
								className={cn(footerCell, pinClass("ai"), aiCell())}
							>
								<div className={aiInner()}>
									{text.filled(rows.filter((row) => row.aiValue).length)}
								</div>
							</td>
							<td className={cn(cell(), "px-2")} />
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	);
}
