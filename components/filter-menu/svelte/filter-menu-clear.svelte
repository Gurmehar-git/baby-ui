<script lang="ts">
import type { Snippet } from "svelte";
import Button from "../../button/svelte/button.svelte";
import { filterChips } from "../filters";
import { filterMenuState } from "./context";

let { class: classProp, children }: { class?: string; children?: Snippet } = $props();
const ctx = filterMenuState("FilterMenuClear");
const any = $derived(filterChips(ctx.groups, ctx.value).length > 0);
</script>

<!-- Clears every pick; disabled while nothing is picked. -->
<Button data-slot="filter-menu-clear" variant="ghost" size="sm" disabled={!any} class={classProp} onclick={() => ctx.setValue({})}>
	{#if children}{@render children()}{:else}Clear all{/if}
</Button>
