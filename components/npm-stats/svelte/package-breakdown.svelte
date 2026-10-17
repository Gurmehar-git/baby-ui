<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import {
	formatCompact,
	formatShare,
	NPM_STATS_LABELS,
	type NpmPackage,
	type NpmStatsLabels,
	rangeRows,
	rangeTrend,
} from "../core";
import {
	type NpmStatsRange,
	type NpmStatsVariant,
	npmStats,
	packageFill,
} from "../variants";
import NpmSparkline from "./npm-sparkline.svelte";
import TrendBadge from "./trend-badge.svelte";

let {
	packages,
	range = "30d",
	variant = "default",
	locale,
	labels: labelsProp,
	class: classProp,
	...rest
}: {
	packages: NpmPackage[];
	range?: NpmStatsRange;
	variant?: NpmStatsVariant;
	locale?: string;
	labels?: Partial<NpmStatsLabels>;
	class?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "class"> = $props();

const styles = $derived(npmStats({ variant }));
const labels = $derived({ ...NPM_STATS_LABELS, ...labelsProp });
const compare = $derived(range === "30d" ? labels.compare30 : labels.compare90);
const rows = $derived(
	packages.map((pkg, index) => {
		const values = rangeRows(pkg, range).map((row) => row.downloads);
		return {
			pkg,
			values,
			fill: packageFill(index, packages.length),
			total: values.reduce((a, b) => a + b, 0),
		};
	}),
);
const sum = $derived(rows.reduce((total, row) => total + row.total, 0));
</script>

<!-- Every package's share as one bar, then a row each in the order given, so a range switch never reshuffles rows. -->
<div {...rest} data-slot="npm-breakdown" class={cn("flex flex-col gap-4", classProp)}>
	<div class={styles.shareBar()} aria-hidden="true">
		{#each rows as { pkg, fill, total } (pkg.name)}
			{#if total > 0}
				<span class={styles.shareSegment()} style:flex-grow={total} style:background={fill}></span>
			{/if}
		{/each}
	</div>
	<ol class={styles.list()}>
		{#each rows as { pkg, values, fill, total } (pkg.name)}
			<li data-slot="npm-breakdown-row" class={styles.row()}>
				<p class={styles.rowName()} title={pkg.name}>
					<span aria-hidden="true" class={styles.rowSwatch()} style:background={fill}></span>
					<span class="truncate">{pkg.name}</span>
				</p>
				<p class={styles.rowShare()}>{formatShare(sum > 0 ? total / sum : 0, locale)}</p>
				<NpmSparkline {values} class={styles.spark()} />
				<p class={styles.rowTotal()}>{formatCompact(total, locale)}</p>
				<TrendBadge
					change={rangeTrend(values, range)}
					srCompare={compare}
					{locale}
					newLabel={labels.newLabel}
					class={styles.rowTrend()}
				/>
			</li>
		{/each}
	</ol>
</div>
