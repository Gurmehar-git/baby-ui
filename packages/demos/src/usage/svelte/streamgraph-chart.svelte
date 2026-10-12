<script lang="ts">
import { ChartContainer, StreamgraphChart } from "@baby-ui/svelte";

const data = [
	{ month: "Jan", rock: 12, pop: 30, jazz: 8 },
	{ month: "Feb", rock: 15, pop: 26, jazz: 10 },
	{ month: "Mar", rock: 18, pop: 22, jazz: 14 },
	{ month: "Apr", rock: 14, pop: 28, jazz: 12 },
];
const config = {
	rock: { label: "Rock", color: "var(--chart-1)" },
	pop: { label: "Pop", color: "var(--chart-2)" },
	jazz: { label: "Jazz", color: "var(--chart-3)" },
};
</script>

<ChartContainer {config} title="Streams by genre">
	<StreamgraphChart {data} xKey="month" />
</ChartContainer>
