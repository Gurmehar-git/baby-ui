<script lang="ts">
import { type ColorFormat, ColorPicker } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ColorPicker>>(props));

let value = $state("#7dd3fc");
let format = $state<ColorFormat>("hsv");
// Recents live in the parent; the popover adds the colour it closed on.
let recent = $state<string[]>([]);

$effect(() => {
	if (p.value) value = p.value;
});
$effect(() => {
	format = p.format ?? "hsv";
});
</script>

<ColorPicker
	bind:value
	bind:format
	variant={p.variant ?? "field"}
	class={p.variant === "row" ? "max-w-64" : undefined}
	size={p.size ?? "default"}
	invalid={p.invalid ?? false}
	{recent}
	onOpenChange={(open) => {
		if (!open) recent = [value, ...recent.filter((c) => c !== value)].slice(0, 6);
	}}
	label={p.label || "Accent"}
/>
