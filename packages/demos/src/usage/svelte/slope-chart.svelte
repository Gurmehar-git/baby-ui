<script lang="ts">
import { ChartContainer, SlopeChart } from "@baby-ui/svelte";

const data = [
	{ name: "web", start: 42, end: 51 },
	{ name: "ios", start: 38, end: 33 },
	{ name: "android", start: 29, end: 36 },
];
const config = {
	web: { label: "Web" },
	ios: { label: "iOS" },
	android: { label: "Android" },
};
</script>

<ChartContainer {config} title="Weekly active users, thousands">
	<SlopeChart {data} startLabel="2025" endLabel="2026" />
</ChartContainer>
