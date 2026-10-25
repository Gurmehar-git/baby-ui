<script lang="ts">
import {
	FilterMenu,
	FilterMenuChips,
	FilterMenuClear,
	FilterMenuGroups,
	FilterMenuHeader,
	FilterMenuTitle,
	type FilterValue,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { FILTER_MENU_GROUPS, FILTER_MENU_VALUE } from "../data/filter-menu";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof FilterMenu>>(props));
let filters = $state<FilterValue>({ ...FILTER_MENU_VALUE });
</script>

<FilterMenu groups={FILTER_MENU_GROUPS} variant={p.variant} bind:value={filters}>
	<FilterMenuHeader>
		<FilterMenuTitle>Filters</FilterMenuTitle>
		<FilterMenuClear />
	</FilterMenuHeader>
	<FilterMenuChips />
	<FilterMenuGroups />
</FilterMenu>
