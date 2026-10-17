<script lang="ts">
import {
	Field,
	FieldDescription,
	FieldLabel,
	Textarea,
	TextareaCount,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Textarea>>(props));

const id = $props.id();
let value = $state(
	"Same field tokens as Input, so labels and focus rings stay consistent.",
);
</script>

<Field class="w-full max-w-md">
	<FieldLabel for={id}>Message</FieldLabel>
	<Textarea
		{id}
		bind:value
		aria-describedby="{id}-description"
		size={p.size ?? "default"}
		variant={p.variant ?? "outline"}
		rows={p.rows ?? 4}
		autoGrow={p.autoGrow ?? false}
		maxRows={p.maxRows ?? 10}
		maxlength={280}
		invalid={p.invalid ?? false}
		disabled={p.disabled ?? false}
	/>
	<div class="flex items-start justify-between gap-3">
		<FieldDescription id="{id}-description">Markdown is supported.</FieldDescription>
		<TextareaCount value={value.length} max={280} />
	</div>
</Field>
