<script lang="ts">
import { StatsBand } from "@baby-ui/svelte";
</script>

<StatsBand
	variant="divided"
	stats={[
		{ value: 12_400, notation: "compact", label: "Teams", suffix: "+" },
		{ value: 99.99, decimals: 2, suffix: "%", label: "Uptime" },
		{ value: 38, suffix: "ms", label: "Median latency", detail: "At the edge" },
	]}
/>
