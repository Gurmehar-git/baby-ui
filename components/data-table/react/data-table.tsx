"use client";

import type { RowData } from "@tanstack/table-core";
import {
	type ComponentProps,
	createContext,
	createElement,
	type KeyboardEvent,
	type PointerEvent,
	type ReactNode,
	useContext,
	useEffect,
	useLayoutEffect,
	useReducer,
	useRef,
	useState,
} from "react";
import { Button } from "../../button/react/button";
import { button } from "../../button/react/variants";
import { Checkbox } from "../../checkbox/react/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../../dropdown-menu/react/dropdown-menu";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "../../empty/react/empty";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "../../input-group/react/input-group";
import { cn } from "../../lib/react/cn";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../select/react/select";
import { Skeleton } from "../../skeleton/react/skeleton";
import { Spinner } from "../../spinner/react/spinner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../table/react/table";
import type { TableVariant } from "../../table/react/variants";
import {
	ariaSort,
	type ColumnDrop,
	canReorderColumn,
	columnDropAt,
	columnLabel,
	constructDataTable,
	createRowVirtualizer,
	DATA_TABLE_ICONS,
	DATA_TABLE_LABELS,
	type DataTableCellContext,
	type DataTableColumn,
	type DataTableColumnDef,
	type DataTableHeaderContext,
	type DataTableInstance,
	type DataTableLabels,
	type DataTableOptions,
	type DataTableRow,
	debounce,
	hasError,
	isDataTablePending,
	moveColumn,
	moveColumnBy,
	observeNearEnd,
	pinnedOffset,
	rangeLabel,
	SELECT_COLUMN,
	scrollRootFor,
	setDataTableOptions,
	statusMessage,
	subscribeDataTable,
	virtualPadding,
} from "./core";
import {
	DATA_TABLE_ALIGN,
	DATA_TABLE_ROW_ESTIMATE,
	type DataTableDensity,
	dataTable,
} from "./variants";

type DataTableStatus = {
	loading: boolean;
	fetching: boolean;
	error: unknown;
	onRetry?: () => void;
	hasMore: boolean;
	onLoadMore?: () => void;
	variant: TableVariant;
	density: DataTableDensity;
	labels: DataTableLabels;
};

const StatusCtx = createContext<DataTableStatus>({
	loading: false,
	fetching: false,
	error: undefined,
	hasMore: false,
	variant: "default",
	density: "comfortable",
	labels: DATA_TABLE_LABELS,
});

const useLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * A TanStack Table instance that re-renders the calling component on state changes.
 * Pass any TanStack option; `paginate: false` keeps every row for scroll tables.
 */
export function useDataTable<TData extends RowData>(
	options: DataTableOptions<TData>,
): DataTableInstance<TData> {
	const [table] = useState(() => constructDataTable(options));
	const [, rerender] = useReducer((n: number) => n + 1, 0);
	// Options apply during render so rows match props; controlled state publishes after commit.
	setDataTableOptions(table, options, false);
	useLayout(() => setDataTableOptions(table, options));
	useEffect(() => subscribeDataTable(table, rerender), [table]);
	return table;
}

/** Renders a column's header, cell or footer template; functions render as components. */
export function flexRender<TProps extends object>(
	template: string | ((props: TProps) => ReactNode) | undefined,
	props: TProps,
): ReactNode {
	if (template === undefined) return null;
	if (typeof template === "string") return template;
	return createElement(template, props);
}

function Icon({ d, className }: { d: string; className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.75"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
			className={className}
		>
			<path d={d} />
		</svg>
	);
}

export interface DataTableProps extends ComponentProps<"div"> {
	/** First load with no rows yet: the body shows skeleton rows. */
	loading?: boolean;
	/** A refetch or next page with rows on screen: a top progress bar, dimmed rows. */
	fetching?: boolean;
	/** Any truthy value shows the error state; an Error or string supplies its message. */
	error?: unknown;
	onRetry?: () => void;
	/** Infinite loading: `onLoadMore` fires as the last row nears view while `hasMore`. */
	hasMore?: boolean;
	onLoadMore?: () => void;
	variant?: TableVariant;
	density?: DataTableDensity;
	labels?: Partial<DataTableLabels>;
}

export function DataTable({
	loading = false,
	fetching = false,
	error,
	onRetry,
	hasMore = false,
	onLoadMore,
	variant = "default",
	density = "comfortable",
	labels,
	className,
	...props
}: DataTableProps) {
	const status: DataTableStatus = {
		loading,
		fetching,
		error,
		onRetry,
		hasMore,
		onLoadMore,
		variant,
		density,
		labels: { ...DATA_TABLE_LABELS, ...labels },
	};
	return (
		<StatusCtx.Provider value={status}>
			<div
				data-slot="data-table"
				aria-busy={loading || fetching || undefined}
				className={cn(dataTable().root(), className)}
				{...props}
			/>
		</StatusCtx.Provider>
	);
}

export function DataTableToolbar({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="data-table-toolbar"
			className={cn(dataTable().toolbar(), className)}
			{...props}
		/>
	);
}

export interface DataTableSearchProps<TData extends RowData> {
	table: DataTableInstance<TData>;
	placeholder?: string;
	/** Typing settles this long before the filter runs, so 10K rows never filter per key. */
	debounceMs?: number;
	className?: string;
}

/** Drives the global filter; with `manualFiltering` your server reads `globalFilter`. */
export function DataTableSearch<TData extends RowData>({
	table,
	placeholder,
	debounceMs = 200,
	className,
}: DataTableSearchProps<TData>) {
	const { labels } = useContext(StatusCtx);
	const [value, setValue] = useState(() => String(table.store.get().globalFilter ?? ""));
	const [apply] = useState(() =>
		debounce((next: string) => table.setGlobalFilter(next), debounceMs),
	);
	useEffect(() => () => apply.cancel(), [apply]);
	return (
		<InputGroup
			data-slot="data-table-search"
			className={cn(dataTable().search(), className)}
		>
			<InputGroupAddon>
				<Icon d={DATA_TABLE_ICONS.search} />
			</InputGroupAddon>
			<InputGroupInput
				type="search"
				aria-label={labels.search}
				placeholder={placeholder ?? `${labels.search}…`}
				value={value}
				onChange={(event) => {
					setValue(event.target.value);
					apply.call(event.target.value);
				}}
			/>
		</InputGroup>
	);
}

export interface DataTableViewOptionsProps<TData extends RowData> {
	table: DataTableInstance<TData>;
	className?: string;
}

/** A menu of every hideable column, each a checkbox for its visibility. */
export function DataTableViewOptions<TData extends RowData>({
	table,
	className,
}: DataTableViewOptionsProps<TData>) {
	const { labels } = useContext(StatusCtx);
	const styles = dataTable();
	const columns = table.getAllLeafColumns().filter((column) => column.getCanHide());
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className={cn(
					button({ variant: "outline", size: "sm" }),
					styles.viewTrigger(),
					className,
				)}
			>
				<Icon d={DATA_TABLE_ICONS.columns} />
				{labels.columns}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>{labels.toggleColumns}</DropdownMenuLabel>
				{columns.map((column) => (
					<DropdownMenuCheckboxItem
						key={column.id}
						checked={column.getIsVisible()}
						onCheckedChange={(checked) => column.toggleVisibility(checked)}
					>
						{columnLabel(column)}
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export interface DataTableColumnHeaderProps<TData extends RowData, TValue = unknown> {
	column: DataTableColumn<TData, TValue>;
	/** Defaults to `meta.label`, then the column id. */
	title?: string;
	className?: string;
}

/** A header that opens a menu to sort, pin or hide its column. */
export function DataTableColumnHeader<TData extends RowData, TValue>({
	column,
	title,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
	const { labels } = useContext(StatusCtx);
	const styles = dataTable();
	const label = title ?? columnLabel(column);
	const canSort = column.getCanSort();
	const canPin = column.getCanPin();
	const canHide = column.getCanHide();
	if (!canSort && !canPin && !canHide) {
		return <span className={cn(styles.sortLabel(), className)}>{label}</span>;
	}
	const sorted = column.getIsSorted();
	const pinned = column.getIsPinned();
	const sortIcon =
		sorted === "asc"
			? DATA_TABLE_ICONS.sortAsc
			: sorted === "desc"
				? DATA_TABLE_ICONS.sortDesc
				: DATA_TABLE_ICONS.unsorted;
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className={cn(
					button({ variant: "ghost", size: "xs" }),
					styles.sortTrigger(),
					className,
				)}
			>
				<span className={styles.sortLabel()}>{label}</span>
				{canSort && (
					<Icon d={sortIcon} className={cn(styles.icon(), !sorted && "opacity-50")} />
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				{canSort && (
					<>
						<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
							{labels.sortAscending}
							<Icon d={DATA_TABLE_ICONS.sortAsc} className={styles.icon()} />
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
							{labels.sortDescending}
							<Icon d={DATA_TABLE_ICONS.sortDesc} className={styles.icon()} />
						</DropdownMenuItem>
						{sorted && (
							<DropdownMenuItem onClick={() => column.clearSorting()}>
								{labels.clearSort}
							</DropdownMenuItem>
						)}
					</>
				)}
				{canSort && (canPin || canHide) && <DropdownMenuSeparator />}
				{canPin && (
					<DropdownMenuItem onClick={() => column.pin(pinned ? false : "start")}>
						{pinned ? labels.unpin : labels.pin}
						<Icon d={DATA_TABLE_ICONS.pin} className={styles.icon()} />
					</DropdownMenuItem>
				)}
				{canHide && (
					<DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
						{labels.hide}
						<Icon d={DATA_TABLE_ICONS.hide} className={styles.icon()} />
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function SelectAllHeader<TData extends RowData>({
	table,
}: DataTableHeaderContext<TData>) {
	const { labels } = useContext(StatusCtx);
	return (
		<Checkbox
			size="sm"
			aria-label={labels.selectAll}
			checked={table.getIsAllPageRowsSelected()}
			indeterminate={table.getIsSomePageRowsSelected()}
			onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
		/>
	);
}

function SelectRowCell<TData extends RowData>({ row }: DataTableCellContext<TData>) {
	const { labels } = useContext(StatusCtx);
	return (
		<Checkbox
			size="sm"
			aria-label={labels.selectRow}
			checked={row.getIsSelected()}
			disabled={!row.getCanSelect()}
			onCheckedChange={(checked) => row.toggleSelected(checked)}
		/>
	);
}

/** A leading checkbox column: select a row, or every row on the page from the header. */
export function dataTableSelectColumn<
	TData extends RowData,
>(): DataTableColumnDef<TData> {
	return { ...SELECT_COLUMN, header: SelectAllHeader, cell: SelectRowCell };
}

export interface DataTableContentProps<TData extends RowData>
	extends Omit<ComponentProps<"table">, "children"> {
	table: DataTableInstance<TData>;
	/** Render only the rows in view; pair with `paginate: false` and a max height. */
	virtualize?: boolean;
	overscan?: number;
	/** First guess at a row's height in px; rows are measured once rendered. */
	estimateRowHeight?: number;
	/** The scroll container: set a max height here to scroll rows under a sticky header. */
	containerClassName?: string;
	rowClassName?: string | ((row: DataTableRow<TData>) => string | undefined);
	skeletonRows?: number;
	/** Replaces the default empty state. */
	empty?: ReactNode;
	/** Drag a header's grip, or press its arrows, to move unpinned columns. */
	reorderable?: boolean;
}

export function DataTableContent<TData extends RowData>({
	table,
	virtualize = false,
	overscan = 8,
	estimateRowHeight,
	containerClassName,
	rowClassName,
	skeletonRows = 8,
	empty,
	reorderable = true,
	className,
	style,
	...props
}: DataTableContentProps<TData>) {
	const status = useContext(StatusCtx);
	const { labels } = status;
	const styles = dataTable({ density: status.density });
	const tableRef = useRef<HTMLTableElement>(null);
	const headerRef = useRef<HTMLTableSectionElement>(null);
	const sentinelRef = useRef<HTMLTableRowElement>(null);
	const [, rerender] = useReducer((n: number) => n + 1, 0);

	const rows = table.getRowModel().rows;
	const columns = table.getVisibleLeafColumns();
	const estimate = estimateRowHeight ?? DATA_TABLE_ROW_ESTIMATE[status.density];
	const failed = hasError(status.error);
	const showSkeleton = status.loading && rows.length === 0 && !failed;
	const showEmpty = !status.loading && !failed && rows.length === 0;
	const canLoadMore = Boolean(status.onLoadMore) && !failed && rows.length > 0;
	// A worker-backed sort or filter in flight shows the same bar as a refetch.
	const busy =
		(status.fetching || status.loading || isDataTablePending(table)) && rows.length > 0;

	const windowOptions = {
		count: rows.length,
		estimateSize: estimate,
		overscan,
		scrollMargin: headerRef.current?.offsetHeight ?? 0,
	};
	// Built before the first render, so even that render holds a window, never every row.
	const [virtual] = useState(() =>
		createRowVirtualizer(
			// Table's own container is the scroll element.
			() => tableRef.current?.closest<HTMLElement>("[data-slot=table-container]") ?? null,
			windowOptions,
			rerender,
		),
	);
	virtual.setOptions(windowOptions);
	useLayout(() => (virtualize ? virtual.attach() : undefined), [virtualize, virtual]);
	useLayout(() => {
		if (virtualize) virtual.sync();
	});

	const onLoadMore = useRef(status.onLoadMore);
	onLoadMore.current = status.onLoadMore;
	const loadMoreArmed =
		canLoadMore && status.hasMore && !status.fetching && !status.loading;
	// Re-armed after every page, so a page too short to fill the view loads the next at once.
	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: rows.length.
	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!loadMoreArmed || !sentinel) return;
		const root = scrollRootFor(
			tableRef.current?.closest<HTMLElement>("[data-slot=table-container]"),
		);
		return observeNearEnd(root, sentinel, () => onLoadMore.current?.());
	}, [loadMoreArmed, rows.length]);

	const handle = virtualize ? virtual : null;
	const items = handle ? handle.virtualizer.getVirtualItems() : null;
	const padding = handle ? virtualPadding(handle) : { top: 0, bottom: 0 };
	const visible = items ? items.flatMap((item) => rows[item.index] ?? []) : rows;

	const rowClass = (row: DataTableRow<TData>) =>
		typeof rowClassName === "function" ? rowClassName(row) : rowClassName;

	const [drag, setDrag] = useState<{ id: string; drop: ColumnDrop | null } | null>(null);

	const dragTo = (event: PointerEvent<HTMLButtonElement>) => {
		const header = headerRef.current;
		if (!drag || !header) return;
		setDrag({ id: drag.id, drop: columnDropAt(header, event.clientX, drag.id) });
	};

	const dragEnd = (commit: boolean) => {
		if (commit && drag?.drop) moveColumn(table, drag.id, drag.drop);
		setDrag(null);
	};

	const moveByKey = (column: DataTableColumn<TData>, event: KeyboardEvent) => {
		if (event.key === "Escape" && drag) return dragEnd(false);
		const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
		const forward = rtl ? "ArrowLeft" : "ArrowRight";
		const back = rtl ? "ArrowRight" : "ArrowLeft";
		if (event.key !== forward && event.key !== back) return;
		event.preventDefault();
		moveColumnBy(table, column.id, event.key === forward ? 1 : -1);
	};

	const resizeByKey = (column: DataTableColumn<TData>, event: KeyboardEvent) => {
		const step = event.key === "ArrowRight" ? 16 : event.key === "ArrowLeft" ? -16 : 0;
		if (!step) return;
		event.preventDefault();
		table.setColumnSizing((sizing) => ({
			...sizing,
			[column.id]: Math.max(column.columnDef.minSize ?? 40, column.getSize() + step),
		}));
	};

	return (
		<div data-slot="data-table-content" data-fetching={busy} className={styles.frame()}>
			{busy && (
				<span aria-hidden className={styles.progress()}>
					<span className={styles.progressBar()} />
				</span>
			)}
			<Table
				ref={tableRef}
				variant={status.variant}
				density={status.density}
				containerClassName={cn(styles.viewport(), containerClassName)}
				className={cn(styles.table(), className)}
				style={{ width: table.getTotalSize(), minWidth: "100%", ...style }}
				{...props}
			>
				<TableHeader ref={headerRef} className={styles.header()}>
					{table.getHeaderGroups().map((group) => (
						<TableRow key={group.id} className="hover:bg-transparent">
							{group.headers.map((header) => {
								const column = header.column;
								const meta = column.columnDef.meta;
								const pinned = column.getIsPinned();
								const movable =
									reorderable && !header.isPlaceholder && canReorderColumn(column);
								const dragging = drag?.id === column.id;
								return (
									<TableHead
										key={header.id}
										colSpan={header.colSpan}
										aria-sort={ariaSort(column)}
										data-column-id={column.id}
										data-reorderable={movable || undefined}
										data-pinned={pinned || undefined}
										data-dragging={dragging || undefined}
										data-drop={drag?.drop?.id === column.id ? drag.drop.side : undefined}
										style={{ width: header.getSize(), ...pinnedOffset(column) }}
										className={cn(
											styles.head(),
											pinned && styles.pinnedHead(),
											DATA_TABLE_ALIGN[meta?.align ?? "start"],
											meta?.headClassName,
										)}
									>
										<div className={styles.headInner()}>
											{movable && (
												<button
													type="button"
													aria-label={`${labels.moveColumn}: ${columnLabel(column)}`}
													data-dragging={dragging || undefined}
													onPointerDown={(event) => {
														event.currentTarget.setPointerCapture(event.pointerId);
														setDrag({ id: column.id, drop: null });
													}}
													onPointerMove={dragTo}
													onPointerUp={() => dragEnd(true)}
													onPointerCancel={() => dragEnd(false)}
													onKeyDown={(event) => moveByKey(column, event)}
													className={styles.grip()}
												>
													<Icon d={DATA_TABLE_ICONS.grip} className={styles.icon()} />
												</button>
											)}
											{header.isPlaceholder
												? null
												: flexRender(column.columnDef.header, header.getContext())}
										</div>
										{column.getCanResize() && (
											// biome-ignore lint/a11y/useSemanticElements: a focusable separator is the ARIA window-splitter pattern; <hr> can't take focus or pointer drags
											<div
												role="separator"
												aria-orientation="vertical"
												aria-label={`Resize ${columnLabel(column)}`}
												aria-valuenow={column.getSize()}
												tabIndex={0}
												data-resizing={column.getIsResizing()}
												// table-core drags on mouse or touch events, not pointer events.
												onMouseDown={header.getResizeHandler()}
												onTouchStart={header.getResizeHandler()}
												onDoubleClick={() => column.resetSize()}
												onKeyDown={(event) => resizeByKey(column, event)}
												className={styles.resizer()}
											/>
										)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{padding.top > 0 && (
						<tr aria-hidden>
							<td
								colSpan={columns.length}
								className={styles.spacer()}
								style={{ height: padding.top }}
							/>
						</tr>
					)}
					{visible.map((row, i) => (
						<TableRow
							key={row.id}
							data-index={items?.[i]?.index}
							ref={handle ? handle.virtualizer.measureElement : undefined}
							data-state={row.getIsSelected() ? "selected" : undefined}
							className={cn(styles.row(), rowClass(row))}
						>
							{row.getVisibleCells().map((cell) => {
								const meta = cell.column.columnDef.meta;
								const pinned = cell.column.getIsPinned();
								return (
									<TableCell
										key={cell.id}
										data-pinned={pinned || undefined}
										style={pinnedOffset(cell.column)}
										className={cn(
											styles.cell(),
											pinned && styles.pinnedCell(),
											DATA_TABLE_ALIGN[meta?.align ?? "start"],
											meta?.cellClassName,
										)}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								);
							})}
						</TableRow>
					))}
					{padding.bottom > 0 && (
						<tr aria-hidden>
							<td
								colSpan={columns.length}
								className={styles.spacer()}
								style={{ height: padding.bottom }}
							/>
						</tr>
					)}
					{showSkeleton &&
						Array.from({ length: skeletonRows }, (_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: generated from a count, so position is the identity.
							<TableRow key={i} aria-hidden className="hover:bg-transparent">
								{columns.map((column) => (
									<TableCell key={column.id}>
										<Skeleton className={styles.skeleton()} />
									</TableCell>
								))}
							</TableRow>
						))}
					{(failed || showEmpty) && (
						<TableRow className={styles.status()}>
							<TableCell colSpan={columns.length} className={styles.status()}>
								{failed ? (
									<Empty role="alert" variant="default" size="sm">
										<EmptyHeader>
											<EmptyMedia variant="icon" tone="destructive">
												<Icon d={DATA_TABLE_ICONS.alert} />
											</EmptyMedia>
											<EmptyTitle>{labels.errorTitle}</EmptyTitle>
											{statusMessage(status.error) && (
												<EmptyDescription>{statusMessage(status.error)}</EmptyDescription>
											)}
										</EmptyHeader>
										{status.onRetry && (
											<EmptyContent>
												<Button size="sm" variant="outline" onClick={status.onRetry}>
													{labels.retry}
												</Button>
											</EmptyContent>
										)}
									</Empty>
								) : (
									(empty ?? (
										<Empty variant="default" size="sm">
											<EmptyHeader>
												<EmptyMedia variant="icon">
													<Icon d={DATA_TABLE_ICONS.inbox} />
												</EmptyMedia>
												<EmptyTitle>{labels.emptyTitle}</EmptyTitle>
												<EmptyDescription>{labels.emptyDescription}</EmptyDescription>
											</EmptyHeader>
										</Empty>
									))
								)}
							</TableCell>
						</TableRow>
					)}
					{canLoadMore && (status.hasMore || status.fetching) && (
						<TableRow ref={sentinelRef} className={styles.loadMore()}>
							<TableCell colSpan={columns.length} className={styles.loadMore()}>
								{status.fetching && (
									<span role="status" className={styles.loadMoreInner()}>
										<Spinner size="sm" label={labels.loadingMore} />
										{labels.loadingMore}
									</span>
								)}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export interface DataTablePaginationProps<TData extends RowData>
	extends ComponentProps<"div"> {
	table: DataTableInstance<TData>;
	pageSizes?: readonly number[];
	/** Show "N of M selected" when rows are selectable. */
	showSelection?: boolean;
}

export function DataTablePagination<TData extends RowData>({
	table,
	pageSizes = [10, 20, 50, 100],
	showSelection = true,
	className,
	...props
}: DataTablePaginationProps<TData>) {
	const { labels, loading } = useContext(StatusCtx);
	const styles = dataTable();
	const { pageIndex, pageSize } = table.store.get().pagination;
	const total = table.getRowCount();
	const selected = Object.keys(table.store.get().rowSelection).length;
	const pageCount = Math.max(1, table.getPageCount());
	const sizes = pageSizes.map((size) => ({ value: String(size), label: String(size) }));
	const nav = [
		{
			label: labels.firstPage,
			icon: DATA_TABLE_ICONS.chevronsLeft,
			on: () => table.firstPage(),
			can: table.getCanPreviousPage(),
		},
		{
			label: labels.previousPage,
			icon: DATA_TABLE_ICONS.chevronLeft,
			on: () => table.previousPage(),
			can: table.getCanPreviousPage(),
		},
		{
			label: labels.nextPage,
			icon: DATA_TABLE_ICONS.chevronRight,
			on: () => table.nextPage(),
			can: table.getCanNextPage(),
		},
		{
			label: labels.lastPage,
			icon: DATA_TABLE_ICONS.chevronsRight,
			on: () => table.lastPage(),
			can: table.getCanNextPage(),
		},
	];
	return (
		<div
			data-slot="data-table-pagination"
			className={cn(styles.footer(), className)}
			{...props}
		>
			<span className={styles.selection()}>
				{showSelection && selected > 0
					? `${selected.toLocaleString()} of ${total.toLocaleString()} selected`
					: rangeLabel(pageIndex, pageSize, total)}
			</span>
			<div className="flex flex-wrap items-center gap-x-6 gap-y-3">
				<div className={styles.pageSize()}>
					<span>{labels.rowsPerPage}</span>
					<Select
						value={String(pageSize)}
						onValueChange={(next) => table.setPageSize(Number(next))}
						items={sizes}
					>
						<SelectTrigger
							aria-label={labels.rowsPerPage}
							className={styles.pageSizeTrigger()}
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{sizes.map((size) => (
								<SelectItem key={size.value} value={size.value}>
									{size.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<span className={styles.pageInfo()}>
					Page {Math.min(pageIndex + 1, pageCount)} of {pageCount.toLocaleString()}
				</span>
				<div className={styles.pageNav()}>
					{nav.map((item) => (
						<Button
							key={item.label}
							variant="outline"
							size="icon-sm"
							aria-label={item.label}
							disabled={!item.can || loading}
							onClick={item.on}
						>
							<Icon d={item.icon} />
						</Button>
					))}
				</div>
			</div>
		</div>
	);
}
