<script lang="ts">
import { Input, Label } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Input>>(props));

let value = $state("");
</script>

<div class="flex w-full max-w-72 flex-col gap-1.5">
	<Label for="demo-input" required>Workspace name</Label>
	<Input
		id="demo-input"
		bind:value
		size={p.size ?? "default"}
		variant={p.variant ?? "outline"}
		invalid={p.invalid ?? false}
		disabled={p.disabled ?? false}
		placeholder={p.placeholder || "Enter a value"}
	/>
	{#if props.invalid}
		<p class="text-destructive-strong text-xs">That name is already taken.</p>
	{/if}
</div>
