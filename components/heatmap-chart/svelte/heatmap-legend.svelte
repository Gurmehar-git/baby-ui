<script lang="ts">
import { useChart } from "../../chart/svelte/context";
import { cn } from "../../lib/cn";
import {
	HEATMAP_LEVELS,
	HEATMAP_TIMING,
	heatmapLevelKey,
	LEVEL_PATTERN,
} from "../calendar";
import {
	type HeatmapLegendAlign,
	type HeatmapShape,
	heatmapChart,
	levelFill,
	SHAPE_RADIUS,
} from "../variants";
import PatternDefs from "./pattern-defs.svelte";

let {
	lessLabel = "Less",
	moreLabel = "More",
	align = "end",
	shape = "rounded",
	patterns = false,
	levelLabel = (level: number) => `Level ${level + 1} of 5`,
	class: className,
}: {
	/** Caption before the lowest level. */
	lessLabel?: string;
	/** Caption after the highest level. */
	moreLabel?: string;
	align?: HeatmapLegendAlign;
	shape?: HeatmapShape;
	patterns?: boolean;
	/** Accessible name of each level swatch. */
	levelLabel?: (level: number) => string;
	class?: string;
} = $props();

const chart = useChart();
const uid = $props.id();
const styles = $derived(heatmapChart({ shape, align }));
let pinned = $state<string | null>(null);
const preview = (key: string | null) => {
	chart.highlighted = key ?? pinned;
};
</script>

<div data-slot="heatmap-legend" class={cn(styles.legend(), className)}>
	<span>{lessLabel}</span>
	<svg width={0} height={0} aria-hidden="true" class="absolute">
		{#if patterns}
			<PatternDefs {uid} size={12} />
		{/if}
	</svg>
	{#each HEATMAP_LEVELS as level (level)}
		{@const key = heatmapLevelKey(level)}
		{@const pattern = LEVEL_PATTERN[level]}
		{@const dim = chart.highlighted?.startsWith("heatmap-level-") && chart.highlighted !== key}
		<button
			type="button"
			aria-label={levelLabel(level)}
			aria-pressed={pinned === key}
			data-level={level}
			class={styles.swatch()}
			style:opacity={dim ? HEATMAP_TIMING.faded : 1}
			onclick={() => {
				pinned = pinned === key ? null : key;
				chart.highlighted = pinned ?? key;
			}}
			onpointerenter={() => preview(key)}
			onpointerleave={() => preview(null)}
			onfocus={() => preview(key)}
			onblur={() => preview(null)}
		>
			<svg viewBox="0 0 12 12" class="size-full overflow-visible" aria-hidden="true">
				<rect width={12} height={12} rx={12 * SHAPE_RADIUS[shape]} fill={levelFill(level)} />
				{#if patterns && pattern !== "none" && pattern !== "solid"}
					<rect
						width={12}
						height={12}
						rx={12 * SHAPE_RADIUS[shape]}
						fill="url(#{uid}-{pattern})"
					/>
				{/if}
			</svg>
		</button>
	{/each}
	<span>{moreLabel}</span>
</div>
