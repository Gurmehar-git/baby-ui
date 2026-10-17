<script lang="ts">
import Badge from "../../badge/svelte/badge.svelte";
import CardAction from "../../card/svelte/card-action.svelte";

let {
	value,
	class: classProp,
}: {
	/** Change since the last reading, in points. */
	value: number;
	class?: string;
} = $props();

const up = $derived(value >= 0);
</script>

<!-- A signed badge for the change since the last reading. -->
<CardAction class={classProp}>
	<Badge variant={up ? "success" : "destructive"} size="sm">
		<svg aria-hidden="true" viewBox="0 0 12 12" class="size-3" fill="none">
			<path
				d={up ? "M3 9 9 3M4.5 3H9v4.5" : "M3 3l6 6M9 4.5V9H4.5"}
				stroke="currentColor"
				stroke-width={1.5}
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		{up ? "+" : ""}{value}
	</Badge>
</CardAction>
