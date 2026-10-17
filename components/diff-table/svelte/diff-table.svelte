<script lang="ts">
import Badge from "../../badge/svelte/badge.svelte";
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/cn";
import { type DiffRowChange, diffRow } from "../variants";
import type { DiffRow } from "./types";

const NEUTRAL = {
	row: "",
	label: "text-foreground",
	detail: "text-muted-foreground",
	mark: "bg-muted text-muted-foreground shadow-xs",
};

function rowClasses(change: DiffRowChange, included: boolean) {
	if (!included) return NEUTRAL;
	const c = diffRow({ change });
	return { row: c.row(), label: c.label(), detail: c.detail(), mark: c.mark() };
}

let {
	title = "Proposed changes",
	rows,
	included = $bindable(),
	onIncludedChange,
	accepted = $bindable(false),
	onAcceptedChange,
	onApply,
	class: classProp,
}: {
	title?: string;
	rows: DiffRow[];
	included?: Record<string, boolean>;
	onIncludedChange?: (included: Record<string, boolean>) => void;
	accepted?: boolean;
	onAcceptedChange?: (accepted: boolean) => void;
	onApply?: (includedKeys: string[]) => void;
	class?: string;
} = $props();

if (included === undefined) {
	// svelte-ignore state_referenced_locally -- intentional one-time seed, matching React's useState(initialValue)
	included = Object.fromEntries(rows.map((row) => [row.key, row.included ?? true]));
}

function isIncluded(row: DiffRow) {
	return included?.[row.key] ?? row.included ?? true;
}

const includedKeys = $derived(rows.filter(isIncluded).map((row) => row.key));
const removals = $derived(
	rows.filter((row) => row.change === "removed" && isIncluded(row)).length,
);
const additions = $derived(
	rows.filter((row) => row.change === "added" && isIncluded(row)).length,
);
const total = $derived(removals + additions);

function toggle(key: string) {
	const next = { ...included, [key]: !(included?.[key] ?? true) };
	included = next;
	onIncludedChange?.(next);
}

function apply() {
	accepted = true;
	onAcceptedChange?.(true);
	onApply?.(includedKeys);
}
</script>

{#snippet checkMark(isIncluded: boolean, markClass: string)}
	<span
		aria-hidden="true"
		class={cn(
			"flex size-4.5 shrink-0 items-center justify-center rounded-[5px] transition-[background-color,transform] duration-(--duration-fast)",
			markClass,
		)}
		style:transform={isIncluded ? "scale(1)" : "scale(0.92)"}
	>
		{#if isIncluded}
			<svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<path
					d="M20 6 9 17l-5-5"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		{/if}
	</span>
{/snippet}

<div data-slot="diff-table" class={cn("w-full", classProp)}>
	<div class="relative overflow-hidden rounded-2xl bg-card shadow-sm">
		<div class="flex items-center justify-between border-border border-b px-3 py-2">
			<span class="font-medium text-xs text-foreground">{title}</span>
			{#if !accepted}
				<span class="text-xs text-muted-foreground">Click rows to toggle</span>
			{/if}
		</div>

		<table class="w-full table-fixed border-collapse text-left">
			<colgroup>
				<col class="w-[34%]" />
				<col class="w-[30%]" />
				<col class="w-[36%]" />
			</colgroup>
			<thead>
				<tr class="border-border border-b">
					{#each ["Field", "Category", "Detail"] as heading (heading)}
						<th class="px-3 py-1.5 font-medium text-xs text-muted-foreground">{heading}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each rows as row, index (row.key)}
					{@const rowIncluded = isIncluded(row)}
					{@const interactive = !accepted}
					{@const classes = rowClasses(row.change, rowIncluded)}
					<tr
						role="checkbox"
						aria-checked={rowIncluded}
						tabindex={interactive ? 0 : undefined}
						onclick={interactive ? () => toggle(row.key) : undefined}
						onkeydown={interactive
							? (event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										toggle(row.key);
									}
								}
							: undefined}
						class={cn(
							"card-fade-up border-border border-b transition-colors duration-(--duration-fast) last:border-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset",
							interactive && "cursor-pointer hover:brightness-[0.985]",
							classes.row,
						)}
						style="animation-delay: calc(var(--stagger-step) * {index});"
					>
						<td class={cn("px-3 py-2 text-sm", classes.label)}>{row.label}</td>
						<td class="px-3 py-2">
							<Badge variant="secondary" size="sm" dot>{row.category}</Badge>
						</td>
						<td class={cn("px-3 py-2 text-xs", classes.detail)}>
							<span class="flex items-center justify-between gap-2">
								<span class="min-w-0 truncate">{row.detail}</span>
								{@render checkMark(rowIncluded, classes.mark)}
							</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<div class="flex min-h-11 items-center justify-between border-border border-t px-3 py-2">
			{#if accepted}
				<span
					class="pop-in inline-flex items-center gap-1.5 rounded-full bg-success/10 py-1 pr-2.5 pl-1 font-medium text-xs text-success-strong"
				>
					<span class="flex size-4.5 items-center justify-center rounded-full bg-success text-success-foreground">
						<svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<path
								d="M20 6 9 17l-5-5"
								stroke="currentColor"
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</span>
					{total} {total === 1 ? "edit" : "edits"} applied
				</span>
			{:else}
				<span class="text-xs text-muted-foreground tabular-nums">
					{removals} {removals === 1 ? "removal" : "removals"} · {additions}
					{additions === 1 ? "addition" : "additions"}
				</span>
				<Button variant="default" size="sm" disabled={total === 0} onclick={apply}>
					Apply {total} {total === 1 ? "change" : "changes"}
				</Button>
			{/if}
		</div>
	</div>
</div>
