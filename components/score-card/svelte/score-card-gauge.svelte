<script lang="ts">
import type { ComponentProps } from "svelte";
import GaugeChart from "../../gauge-chart/svelte/gauge-chart.svelte";
import { cn } from "../../lib/cn";
import { scoreCardState } from "./context";

let { class: classProp, ...rest }: ComponentProps<typeof GaugeChart> = $props();
const card = scoreCardState();
</script>

<!-- The dial; takes every GaugeChart prop and sizes itself from ScoreCard's `size`. -->
<div data-slot="score-card-gauge" class={cn(card.styles.gauge(), classProp)}>
	<GaugeChart {...rest} />
</div>
