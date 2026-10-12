<script lang="ts">
import { Field, FieldDescription, FieldLabel, TimePicker } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof TimePicker>>(props));

let time = $state<string | null>("09:30");
const cycle = $derived(
	props.hourCycle === "24" ? 24 : props.hourCycle === "12" ? 12 : undefined,
);
</script>

<Field class="w-fit">
	<FieldLabel>Meeting starts</FieldLabel>
	<TimePicker
		bind:value={time}
		aria-label="Meeting starts"
		hourCycle={cycle}
		step={p.step ?? 15}
		min="08:00"
		max="18:00"
		clearable={p.clearable ?? false}
		showNow={p.showNow ?? false}
		invalid={p.invalid ?? false}
		size={p.size ?? "default"}
	/>
	<FieldDescription>
		Type it, or use the arrow keys. Clear and Now sit at the end.
	</FieldDescription>
	<p class="text-muted-foreground text-xs tabular-nums">Saved as {time ?? "no time"}</p>
</Field>