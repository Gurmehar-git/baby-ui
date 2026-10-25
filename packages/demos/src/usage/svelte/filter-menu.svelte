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

const groups = [
	{
		id: "status",
		label: "Status",
		options: [
			{ id: "open", label: "Open" },
			{ id: "closed", label: "Closed" },
		],
	},
	{
		id: "owner",
		label: "Owner",
		options: [
			{ id: "me", label: "Me" },
			{ id: "team", label: "My team" },
		],
	},
];
let filters = $state<FilterValue>({});
</script>

<FilterMenu {groups} bind:value={filters}>
	<FilterMenuHeader>
		<FilterMenuTitle>Filters</FilterMenuTitle>
		<FilterMenuClear />
	</FilterMenuHeader>
	<FilterMenuChips />
	<FilterMenuGroups />
</FilterMenu>
