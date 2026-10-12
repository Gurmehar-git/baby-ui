<script lang="ts">
import { Button, Sparkline } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import {
	formatThousands,
	SPARK_DAYS,
	SPARK_REVENUE,
	SPARK_REVENUE_NEXT,
} from "../data/sparkline";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Sparkline>>(props));
let next = $state(false);
const data = $derived(next ? SPARK_REVENUE_NEXT : SPARK_REVENUE);
</script>

<div class="grid w-full max-w-xs gap-4">
	<Sparkline
		label="Revenue"
		{data}
		labels={SPARK_DAYS}
		value={formatThousands(data[data.length - 1] ?? 0)}
		change={next ? "+68.1%" : "+73.2%"}
		formatValue={formatThousands}
		area={p.area}
		interactive={p.interactive}
		variant={p.variant}
	/>
	<Button variant="outline" size="sm" class="justify-self-start" onclick={() => (next = !next)}>Swap data</Button>
</div>
