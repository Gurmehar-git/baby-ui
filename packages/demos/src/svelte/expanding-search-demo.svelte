<script lang="ts">
import { ExpandingSearch } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { WORKSPACE_ITEMS, WORKSPACE_RECENT } from "../data/expanding-search";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ExpandingSearch>>(props));
let picked = $state("");
</script>

<div class="flex w-full max-w-md flex-col gap-3">
	<ExpandingSearch
		label="Search projects and docs"
		items={WORKSPACE_ITEMS}
		suggestions={WORKSPACE_RECENT}
		variant={p.variant}
		size={p.size}
		anchor={p.anchor}
		onSelect={(item) => (picked = item.title)}
	/>
	<p class="h-4 text-muted-foreground text-xs">{picked && `Opened ${picked}`}</p>
</div>
