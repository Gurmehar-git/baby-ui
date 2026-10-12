<script lang="ts">
import { FloatingButtonGroup } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof FloatingButtonGroup>>(props));
let copied = $state(false);
let presenting = $state(false);
$effect(() => {
	if (!copied) return;
	const timer = setTimeout(() => (copied = false), 1500);
	return () => clearTimeout(timer);
});
</script>

{#snippet glyph(d: string)}
	<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
		<path {d} />
	</svg>
{/snippet}
{#snippet undo()}{@render glyph("M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3")}{/snippet}
{#snippet redo()}{@render glyph("m15 14 5-5-5-5M20 9H9a5 5 0 0 0 0 10h3")}{/snippet}
{#snippet link()}{@render glyph("M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7")}{/snippet}
{#snippet screen()}{@render glyph("M3 4h18v12H3zM8 20h8M12 16v4")}{/snippet}

<FloatingButtonGroup
	label="Board actions"
	variant={p.variant}
	size={p.size}
	orientation={p.orientation}
	iconOnly={p.iconOnly}
	items={[
		{ id: "undo", label: "Undo", shortcut: "⌘Z", iconOnly: true, icon: undo },
		{ id: "redo", label: "Redo", shortcut: "⇧⌘Z", iconOnly: true, icon: redo },
		{ type: "separator" },
		{
			id: "share",
			label: copied ? "Copied" : "Share",
			reserveLabels: ["Share", "Copied"],
			icon: link,
			onSelect: () => (copied = true),
		},
		{ id: "present", label: "Present", pressed: presenting, icon: screen, onSelect: () => (presenting = !presenting) },
	]}
/>
