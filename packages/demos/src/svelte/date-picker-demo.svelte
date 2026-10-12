<script lang="ts">
import { DatePicker, Field, FieldDescription, FieldLabel } from "@baby-ui/svelte";
import { type DateValue, getLocalTimeZone, today } from "@internationalized/date";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof DatePicker>>(props));

// A booking form: nothing earlier than today can be picked or typed.
const now = today(getLocalTimeZone());
let checkIn = $state<DateValue | undefined>();
</script>

<Field class="w-full max-w-64">
	<FieldLabel for="demo-check-in">Check-in</FieldLabel>
	<DatePicker
		id="demo-check-in"
		bind:value={checkIn}
		min={now}
		max={now.add({ months: 6 })}
		locale={p.locale || undefined}
		captionLayout={p.captionLayout ?? "dropdown"}
		invalid={p.invalid ?? false}
		size={p.size ?? "default"}
		aria-describedby="demo-check-in-hint"
	/>
	<FieldDescription id="demo-check-in-hint">Type a date or pick one. Up to six months ahead.</FieldDescription>
</Field>
