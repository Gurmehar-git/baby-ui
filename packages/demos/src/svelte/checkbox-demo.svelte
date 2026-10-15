<script lang="ts">
import { Checkbox } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Checkbox>>(props));

const SCOPES = ["Read repositories", "Write issues", "Manage webhooks"];

let checked = $state(false);
let scopes = $state([true, false, false]);

$effect(() => {
	checked = p.checked ?? false;
});

const granted = $derived(scopes.filter(Boolean).length);
const variant = $derived(p.variant ?? "default");
</script>

<div class="flex w-full max-w-72 flex-col gap-3">
	<Checkbox
		bind:checked={
			() => granted === SCOPES.length, (next) => (scopes = SCOPES.map(() => next))
		}
		indeterminate={granted > 0 && granted < SCOPES.length}
		{variant}
		label="All permissions"
	/>
	<div class={variant === "card" ? "flex flex-col gap-2" : "flex flex-col gap-3 border-border border-l pl-4"}>
		{#each SCOPES as scope, i (scope)}
			<Checkbox bind:checked={scopes[i]} {variant} label={scope} />
		{/each}
	</div>
	<Checkbox
		bind:checked
		{variant}
		disabled={p.disabled ?? false}
		indeterminate={p.indeterminate ?? false}
		size={p.size ?? "default"}
		label={p.label || "Remember this grant"}
		description={p.description || "Skips the prompt for the next 30 days."}
	/>
</div>
