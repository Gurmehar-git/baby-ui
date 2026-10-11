<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import Badge from "../badge/badge.svelte";
import type { BadgeVariant } from "../badge/variants";
import { cn } from "../lib/cn";
import type { FilterRow, FilterRowStatus, FilterTableLabels } from "./types";

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

let {
	class: classProp,
	rows,
	labels = DEFAULT_LABELS,
	filter = $bindable("all"),
	onFilterChange,
	...rest
}: {
	rows: FilterRow[];
	labels?: FilterTableLabels;
	filter?: "all" | FilterRowStatus;
	onFilterChange?: (filter: "all" | FilterRowStatus) => void;
} & HTMLAttributes<HTMLDivElement> = $props();

function setFilter(next: "all" | FilterRowStatus) {
	filter = next;
	onFilterChange?.(next);
}

const counts = $derived.by(() => {
	const byStatus: Record<"all" | FilterRowStatus, number> = {
		all: rows.length,
		todo: 0,
		progress: 0,
		done: 0,
	};
	for (const row of rows) byStatus[row.status] += 1;
	return byStatus;
});
</script>

<div data-slot="filter-table" class={cn("w-full max-w-md", classProp)} {...rest}>
	<div class="-mx-1 mb-1 flex items-center gap-1 overflow-x-auto px-1 py-1" style="scrollbar-width: none">
		{#each FILTERS as f (f.key)}
			{@const active = filter === f.key}
			<button
				type="button"
				aria-pressed={active}
				onclick={() => setFilter(f.key)}
				class={cn(
					"flex h-[26px] shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-[background-color,box-shadow,color] duration-(--duration-base)",
					active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:bg-accent",
				)}
			>
				{#if f.tone}
					<span class={cn("size-1.5 rounded-full", f.tone)}></span>
				{/if}
				{f.label}
				<span
					class={cn(
						"rounded-[4px] px-1 text-xs tabular-nums",
						active ? "bg-input text-muted-foreground" : "text-muted-foreground",
					)}
				>
					{counts[f.key]}
				</span>
			</button>
		{/each}
	</div>

	<!-- svelte-ignore a11y_no_noninteractive_tabindex -- only keyboard entry to this horizontally-scrolling table -->
	<div
		aria-label="Scrollable task table"
		class="overflow-x-auto rounded-2xl bg-card shadow-sm"
		role="region"
		tabindex="0"
		style="scrollbar-width: none"
	>
		<div class="min-w-[420px]">
			<div class={cn("grid border-border border-b text-xs font-medium text-muted-foreground", GRID_COLS)}>
				<span class="border-border border-r px-3 py-2">{labels.columns.task}</span>
				<span class="border-border border-r px-3 py-2">{labels.columns.date}</span>
				<span class="border-border border-r px-3 py-2">{labels.columns.status}</span>
				<span class="px-3 py-2">{labels.columns.owner}</span>
			</div>
			{#each rows as row (row.task)}
				{@const shown = filter === "all" || row.status === filter}
				<div
					class="grid transition-[grid-template-rows,opacity] duration-(--duration-slow) ease-[var(--ease-ui-out)]"
					style={`grid-template-rows: ${shown ? "1fr" : "0fr"}; opacity: ${shown ? 1 : 0}`}
				>
					<div class="overflow-hidden">
						<div
							class={cn(
								"grid border-border border-b text-sm transition-colors duration-(--duration-instant) hover:bg-accent",
								GRID_COLS,
							)}
						>
							<span class="flex min-w-0 items-center border-border border-r px-3 py-2">
								<span class="truncate font-medium text-foreground">{row.task}</span>
							</span>
							<span class="flex items-center whitespace-nowrap border-border border-r px-3 py-2 text-muted-foreground tabular-nums">
								{row.date}
							</span>
							<span class="flex items-center border-border border-r px-3 py-2">
								<Badge variant={STATUS_VARIANT[row.status]}>
									{STATUS_LABEL[row.status]}
								</Badge>
							</span>
							<span class="flex min-w-0 items-center px-3 py-2 text-muted-foreground">
								<span class="truncate">{row.owner}</span>
							</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
