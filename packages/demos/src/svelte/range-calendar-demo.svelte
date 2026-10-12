<script lang="ts">
import { RangeCalendar } from "@baby-ui/svelte";
import { getLocalTimeZone, today } from "@internationalized/date";
import type { ComponentProps } from "svelte";
import { MediaQuery } from "svelte/reactivity";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof RangeCalendar>>(props));

const start = today(getLocalTimeZone());
let value = $state({ start, end: start.add({ days: 5 }) });
// Two months side by side on wide screens, one on a phone.
const wide = new MediaQuery("min-width: 768px");
</script>

<RangeCalendar
	bind:value
	numberOfMonths={wide.current ? 2 : 1}
	size={p.size ?? "default"}
	class="rounded-lg border border-border"
/>
