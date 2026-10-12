<script lang="ts">
import { DateRangePicker } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof DateRangePicker>>(props));

// A report filter: empty until the reader picks a range or a preset.
let range = $state<ComponentProps<typeof DateRangePicker>["value"]>();
</script>

<DateRangePicker
	bind:value={range}
	aria-label="Report period"
	confirm={p.confirm ?? false}
	locale={p.locale || undefined}
	invalid={p.invalid ?? false}
	size={p.size ?? "default"}
/>
