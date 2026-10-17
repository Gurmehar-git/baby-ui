<script lang="ts">
import type { Snippet } from "svelte";
import { toDate } from "../../chart/core";
import { cn } from "../../lib/cn";
import RollingDigits from "../../rolling-digits/svelte/rolling-digits.svelte";
import { overviewCardState } from "./context";

let { class: classProp, children }: { class?: string; children?: Snippet } = $props();
const card = overviewCardState();

const datum = $derived(
	card.activeIndex !== null ? card.data[card.activeIndex] : undefined,
);
const shown = $derived.by(() => {
	const hovered = datum?.[card.dataKey];
	return typeof hovered === "number" ? hovered : card.value;
});
</script>

<!-- The headline and its caption, the resting value or the hovered point's; OverviewCardTrend goes inside. -->
<div data-slot="overview-card-value" class={cn(card.styles.headline(), classProp)}>
	<RollingDigits
		variant="count"
		value={shown}
		format={card.number}
		size="lg"
		durationMs={400}
		startOnView={false}
		class="font-bold text-foreground"
	/>
	<span class={card.styles.label()}>
		{datum ? card.formatLabel(toDate(datum[card.xKey])) : card.label}
	</span>
	{@render children?.()}
</div>
