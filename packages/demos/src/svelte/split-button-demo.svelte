<script lang="ts">
import { SplitButton } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof SplitButton>>(props));
let last = $state("");
</script>

<div class="flex flex-col items-center gap-3">
	<SplitButton
		label={p.label || "Merge"}
		variant={p.variant}
		size={p.size}
		onclick={() => (last = "Merged")}
		actions={[
			{ label: "Squash and merge", onSelect: () => (last = "Squashed and merged") },
			{ label: "Rebase and merge", onSelect: () => (last = "Rebased and merged") },
			{ label: "Close pull request", destructive: true, onSelect: () => (last = "Closed") },
		]}
	/>
	<p class="h-4 text-muted-foreground text-xs">{last}</p>
</div>
