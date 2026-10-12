<script lang="ts">
import { DateField, Field, FieldDescription, FieldLabel } from "@baby-ui/svelte";
import { type DateValue, getLocalTimeZone, today } from "@internationalized/date";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof DateField>>(props));

// A sign-up form: a birthday is known, so it is typed, never picked.
let birthday = $state<DateValue | undefined>();
</script>

<Field class="w-fit">
	<FieldLabel>Date of birth</FieldLabel>
	<DateField
		bind:value={birthday}
		max={today(getLocalTimeZone())}
		locale={p.locale || undefined}
		invalid={p.invalid ?? false}
		size={p.size ?? "default"}
		aria-label="Date of birth"
		aria-describedby="demo-birthday-hint"
	/>
	<FieldDescription id="demo-birthday-hint">Type it, or use the arrow keys.</FieldDescription>
</Field>
