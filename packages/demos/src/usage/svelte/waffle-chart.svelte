<script lang="ts">
import { ChartContainer, WaffleChart } from "@baby-ui/svelte";

const data = [
	{ name: "done", value: 62 },
	{ name: "todo", value: 38 },
];
const config = {
	done: { label: "Done", color: "var(--chart-1)" },
	todo: { label: "To do", color: "var(--chart-2)" },
};
</script>

<ChartContainer {config} title="Sprint progress" aspect="square">
	<WaffleChart {data} />
</ChartContainer>
