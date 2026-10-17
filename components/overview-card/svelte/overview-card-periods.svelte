<script lang="ts">
import type { Snippet } from "svelte";
import CardAction from "../../card/svelte/card-action.svelte";
import ToggleGroup from "../../toggle-group/svelte/toggle-group.svelte";
import { overviewCardState } from "./context";

let {
	value = $bindable(""),
	onValueChange,
	label,
	class: classProp,
	children,
}: {
	/** Bindable. */
	value?: string;
	onValueChange?: (value: string) => void;
	/** Accessible name; defaults to "<name> period". */
	label?: string;
	class?: string;
	children?: Snippet;
} = $props();
const card = overviewCardState();

function select(next: string | string[]) {
	if (typeof next !== "string") return;
	value = next;
	onValueChange?.(next);
}
</script>

<!-- The period switcher in the header; holds OverviewCardPeriod items. -->
<CardAction class={classProp}>
	<ToggleGroup
		type="single"
		size="sm"
		bind:value={() => value, select}
		label={label ?? `${card.name} period`}
	>
		{@render children?.()}
	</ToggleGroup>
</CardAction>
