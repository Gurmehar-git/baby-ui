<script lang="ts">
import { ExpandingSearch, type ExpandingSearchItem } from "@baby-ui/svelte";

let {
	items,
	open,
}: { items: ExpandingSearchItem[]; open: (item: ExpandingSearchItem) => void } = $props();
</script>

<ExpandingSearch label="Search projects and docs" {items} onSelect={open} />
