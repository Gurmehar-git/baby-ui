<script lang="ts">
import { OverviewCard } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { REVENUE_BY_PERIOD, REVENUE_PERIODS } from "../data/overview";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof OverviewCard>>(props));

let period = $state("30d");
const reading = $derived(REVENUE_BY_PERIOD[period as keyof typeof REVENUE_BY_PERIOD]);

const currency = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
}).format;
</script>

<div class="w-full max-w-lg">
	<OverviewCard
		title="Total revenue"
		data={reading.data}
		dataKey="revenue"
		value={reading.total}
		label={REVENUE_PERIODS.find((p) => p.value === period)?.label ?? ""}
		trend={reading.trend}
		periods={REVENUE_PERIODS}
		{period}
		onPeriodChange={(v) => (period = v)}
		chart={p.chart ?? "area"}
		size={p.size ?? "default"}
		formatValue={currency}
	/>
</div>
