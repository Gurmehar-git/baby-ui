"use client";

import type { ComponentProps } from "react";
import { useMemo, useState } from "react";
import { Badge } from "../badge/badge";
import type { BadgeVariant } from "../badge/variants";
import { cn } from "../lib/cn";

export type FilterRowStatus = "todo" | "progress" | "done";

export type FilterRow = {
	task: string;
	date: string;
	status: FilterRowStatus;
	owner: string;
};

export type FilterTableLabels = {
	columns: { task: string; date: string; status: string; owner: string };
};

const FILTERS: { key: "all" | FilterRowStatus; label: string; tone?: string }[] = [
	{ key: "all", label: "All" },
	{ key: "todo", label: "To do", tone: "bg-warning" },
	{ key: "progress", label: "In Progress", tone: "bg-info" },
	{ key: "done", label: "Completed", tone: "bg-success" },
];

const DEFAULT_LABELS: FilterTableLabels = {
	columns: { task: "Task name", date: "Date", status: "Status", owner: "Owner" },
};

const STATUS_LABEL: Record<FilterRowStatus, string> = {
	todo: "To do",
	progress: "In Progress",
	done: "Completed",
};

const STATUS_VARIANT: Record<FilterRowStatus, BadgeVariant> = {
	todo: "warning",
	progress: "info",
	done: "success",
};

const GRID_COLS =
	"grid-cols-[minmax(0,1.3fr)_minmax(0,0.6fr)_minmax(0,0.95fr)_minmax(0,0.9fr)]";

export interface FilterTableProps extends Omit<ComponentProps<"div">, "children"> {
	rows: FilterRow[];
	labels?: FilterTableLabels;
	/** Controlled active filter. Omit to let the table own it. */
	filter?: "all" | FilterRowStatus;
	defaultFilter?: "all" | FilterRowStatus;
	onFilterChange?: (filter: "all" | FilterRowStatus) => void;
}

/** Status chips directly filter the task table; a hidden row collapses via
 * grid-template-rows (1fr → 0fr) rather than unmounting, so the transition can animate. */
export function FilterTable({
	className,
	rows,
	labels = DEFAULT_LABELS,
	filter: filterProp,
	defaultFilter = "all",
	onFilterChange,
	...props
}: FilterTableProps) {
	const [internalFilter, setInternalFilter] = useState<"all" | FilterRowStatus>(
		defaultFilter,
	);
	const filter = filterProp ?? internalFilter;

	function setFilter(next: "all" | FilterRowStatus) {
		if (filterProp === undefined) setInternalFilter(next);
		onFilterChange?.(next);
	}

	const counts = useMemo(() => {
		const byStatus: Record<"all" | FilterRowStatus, number> = {
			all: rows.length,
			todo: 0,
			progress: 0,
			done: 0,
		};
		for (const row of rows) byStatus[row.status] += 1;
		return byStatus;
	}, [rows]);

	return (
		<div data-slot="filter-table" className={cn("w-full max-w-md", className)} {...props}>
			<div
				className="-mx-1 mb-1 flex items-center gap-1 overflow-x-auto px-1 py-1"
				style={{ scrollbarWidth: "none" }}
			>
				{FILTERS.map((f) => {
					const active = filter === f.key;
					return (
						<button
							key={f.key}
							type="button"
							aria-pressed={active}
							onClick={() => setFilter(f.key)}
							className={cn(
								"flex h-[26px] shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-[background-color,box-shadow,color] duration-(--duration-base)",
								active
									? "bg-card text-foreground shadow-sm"
									: "text-muted-foreground hover:bg-accent",
							)}
						>
							{f.tone ? <span className={cn("size-1.5 rounded-full", f.tone)} /> : null}
							{f.label}
							<span
								className={cn(
									"rounded-[4px] px-1 text-xs tabular-nums",
									active ? "bg-muted text-muted-foreground" : "text-muted-foreground",
								)}
							>
								{counts[f.key]}
							</span>
						</button>
					);
				})}
			</div>

			<section
				aria-label="Scrollable task table"
				className="overflow-x-auto rounded-2xl bg-card shadow-sm"
				// biome-ignore lint/a11y/noNoninteractiveTabindex: only keyboard entry to this horizontally-scrolling table
				tabIndex={0}
				style={{ scrollbarWidth: "none" }}
			>
				<div className="min-w-[420px]">
					<div
						className={cn(
							"grid border-border border-b text-xs font-medium text-muted-foreground",
							GRID_COLS,
						)}
					>
						<span className="border-border border-r px-3 py-2">
							{labels.columns.task}
						</span>
						<span className="border-border border-r px-3 py-2">
							{labels.columns.date}
						</span>
						<span className="border-border border-r px-3 py-2">
							{labels.columns.status}
						</span>
						<span className="px-3 py-2">{labels.columns.owner}</span>
					</div>
					{rows.map((row) => {
						const shown = filter === "all" || row.status === filter;
						return (
							<div
								key={row.task}
								className="grid transition-[grid-template-rows,opacity] duration-(--duration-slow) ease-[var(--ease-ui-out)]"
								style={{
									gridTemplateRows: shown ? "1fr" : "0fr",
									opacity: shown ? 1 : 0,
								}}
							>
								<div className="overflow-hidden">
									<div
										className={cn(
											"grid border-border border-b text-sm transition-colors duration-(--duration-instant) hover:bg-accent",
											GRID_COLS,
										)}
									>
										<span className="flex min-w-0 items-center border-border border-r px-3 py-2">
											<span className="truncate font-medium text-foreground">
												{row.task}
											</span>
										</span>
										<span className="flex items-center whitespace-nowrap border-border border-r px-3 py-2 text-muted-foreground tabular-nums">
											{row.date}
										</span>
										<span className="flex items-center border-border border-r px-3 py-2">
											<Badge variant={STATUS_VARIANT[row.status]}>
												{STATUS_LABEL[row.status]}
											</Badge>
										</span>
										<span className="flex min-w-0 items-center px-3 py-2 text-muted-foreground">
											<span className="truncate">{row.owner}</span>
										</span>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</section>
		</div>
	);
}
