<script lang="ts">
import { Calendar } from "@baby-ui/svelte";
import { type DateValue, getLocalTimeZone, today } from "@internationalized/date";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Calendar>>(props));

let value = $state<DateValue | undefined>(today(getLocalTimeZone()));
</script>

<Calendar
	type="single"
	bind:value
	captionLayout={p.captionLayout ?? "dropdown"}
	size={p.size ?? "default"}
	class="rounded-lg border border-border"
/>
