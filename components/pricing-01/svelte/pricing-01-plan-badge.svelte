<script lang="ts">
import type { Snippet } from "svelte";
import Badge from "../../badge/svelte/badge.svelte";
import CardAction from "../../card/svelte/card-action.svelte";
import { pricing01Plan } from "./context";

let { class: classProp, children }: { class?: string; children?: Snippet } = $props();
const plan = pricing01Plan();
</script>

<!-- A pill beside the name, e.g. "Popular"; filled on a featured plan. -->
<CardAction>
	<Badge variant={plan.featured ? "default" : "outline"} size="sm" class={classProp}>
		{@render children?.()}
	</Badge>
</CardAction>
