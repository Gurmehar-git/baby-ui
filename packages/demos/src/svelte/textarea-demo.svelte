<script lang="ts">
import { Textarea } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Textarea>>(props));

let value = $state(
	"Same field tokens as Input, so labels and focus rings stay consistent.",
);
</script>

<div class="w-full max-w-md">
	<Textarea
		bind:value
		label={p.label ?? "Message"}
		description={p.description}
		size={p.size ?? "default"}
		variant={p.variant ?? "outline"}
		rows={p.rows ?? 4}
		autoGrow={p.autoGrow ?? false}
		maxRows={p.maxRows ?? 10}
		showCount={p.showCount ?? false}
		invalid={p.invalid ?? false}
		disabled={p.disabled ?? false}
	/>
</div>
