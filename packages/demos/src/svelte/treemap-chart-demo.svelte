<script lang="ts">
import { ChartContainer, TreemapChart } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { REVENUE_TREE } from "../data/revenue-regions";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof TreemapChart>>(props));
</script>

<div class="w-full max-w-3xl">
	<ChartContainer config={{}} title="Revenue by region" aspect="video">
		<TreemapChart
			data={REVENUE_TREE}
			colorLabel="Growth"
			formatColor={(value) => `${value > 0 ? "+" : ""}${value.toFixed(1)}%`}
			variant={p.variant}
		/>
	</ChartContainer>
</div>
