<script lang="ts">
import Badge from "../../badge/svelte/badge.svelte";
import { overviewCardState } from "./context";

let { class: classProp }: { class?: string } = $props();
const card = overviewCardState();

const percent = $derived(
	new Intl.NumberFormat(card.locale, {
		style: "percent",
		maximumFractionDigits: 1,
		signDisplay: "exceptZero",
	}),
);
const up = $derived(card.trend >= 0);
</script>

<!-- A signed badge for the change over the whole period. -->
<Badge variant={up ? "success" : "destructive"} size="sm" class={classProp}>
	<svg aria-hidden="true" viewBox="0 0 12 12" class="size-3" fill="none">
		<path
			d={up ? "M3 9 9 3M4.5 3H9v4.5" : "M3 3l6 6M9 4.5V9H4.5"}
			stroke="currentColor"
			stroke-width={1.5}
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
	{percent.format(card.trend / 100)}
</Badge>
