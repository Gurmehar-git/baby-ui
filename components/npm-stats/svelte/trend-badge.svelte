<script lang="ts">
import Badge from "../../badge/svelte/badge.svelte";
import { cn } from "../../lib/svelte/cn";
import { formatChange, NPM_STATS_LABELS, type PeriodChange } from "./core";
import { npmStats } from "./variants";

let {
	change,
	srCompare,
	locale,
	newLabel = NPM_STATS_LABELS.newLabel,
	class: classProp,
}: {
	change: PeriodChange;
	/** Read out after the value when no visible label says what it's measured against. */
	srCompare?: string;
	locale?: string;
	/** Text when the prior period was empty. */
	newLabel?: string;
	class?: string;
} = $props();

const styles = npmStats();
const direction = $derived(
	change.ratio === null || change.ratio === 0 ? "flat" : change.ratio > 0 ? "up" : "down",
);
</script>

<!-- Signed percent with an arrow, so direction never reads from colour alone. -->
<Badge
	size="sm"
	variant={direction === "up" ? "success" : direction === "down" ? "destructive" : "secondary"}
	class={cn(styles.trend(), classProp)}
>
	<svg
		viewBox="0 0 12 12"
		fill="none"
		stroke="currentColor"
		stroke-width="1.75"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path
			d={direction === "up"
				? "M6 9.5v-7M3 5.5l3-3 3 3"
				: direction === "down"
					? "M6 2.5v7M3 6.5l3 3 3-3"
					: "M2.5 6h7"}
		/>
	</svg>
	{change.ratio === null ? newLabel : formatChange(change.ratio, locale)}
	{#if srCompare}<span class="sr-only"> {srCompare}</span>{/if}
</Badge>
