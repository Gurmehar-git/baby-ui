<script lang="ts">
import { ExpandingButtonGroup } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ExpandingButtonGroup>>(props));
const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 600));
</script>

{#snippet glyph(d: string)}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
		<path {d} />
	</svg>
{/snippet}
{#snippet reply()}{@render glyph("M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11")}{/snippet}
{#snippet archive()}{@render glyph("M3 4h18v4H3zM5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4")}{/snippet}
{#snippet pin()}{@render glyph("M12 17v5M9 3h6l-1 7 4 3H6l4-3z")}{/snippet}
{#snippet trash()}{@render glyph("M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14")}{/snippet}

<ExpandingButtonGroup
	label="Message actions"
	variant={p.variant}
	size={p.size}
	items={[
		{ id: "reply", label: "Reply", icon: reply },
		{ id: "archive", label: "Archive", doneLabel: "Archived", onSelect: wait, icon: archive },
		{ id: "pin", label: "Pin", doneLabel: "Pinned", icon: pin },
		{ id: "delete", label: "Delete", doneLabel: "Deleted", variant: "destructive", icon: trash },
	]}
/>
