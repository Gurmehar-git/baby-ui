<script lang="ts">
import { SearchInput } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof SearchInput>>(props));
const FRUITS = [
	"Apple",
	"Apricot",
	"Banana",
	"Blueberry",
	"Cherry",
	"Grape",
	"Mango",
	"Peach",
];
let query = $state("");
const hits = $derived(
	FRUITS.filter((fruit) => fruit.toLowerCase().includes(query.trim().toLowerCase())),
);
</script>

<div class="flex w-full max-w-xs flex-col gap-3">
	<SearchInput
		label={p.label || "Search fruit"}
		shortcut={p.shortcut || "/"}
		variant={p.variant}
		size={p.size}
		bind:value={query}
	/>
	<p class="text-muted-foreground text-sm">{hits.length ? hits.join(", ") : "No matches"}</p>
</div>
