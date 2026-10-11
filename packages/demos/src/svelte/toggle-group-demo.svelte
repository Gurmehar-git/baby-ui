<script lang="ts">
import { ToggleGroup, ToggleGroupItem } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { ALIGNMENTS, TEXT_MARKS } from "../data/toggle";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ToggleGroup>>(props));

// One choice suits alignment; formatting marks combine.
const multiple = $derived(p.type === "multiple");
const glyphs = $derived(multiple ? TEXT_MARKS : ALIGNMENTS);

let value = $state<string | string[]>("left");

$effect(() => {
	value = multiple ? ["bold"] : "left";
});
</script>

<ToggleGroup
	bind:value
	type={p.type ?? "single"}
	variant={p.variant ?? "default"}
	size={p.size ?? "default"}
	disabled={p.disabled ?? false}
	label={multiple ? "Text formatting" : "Text alignment"}
>
	{#each glyphs as glyph (glyph.value)}
		<ToggleGroupItem value={glyph.value} aria-label={glyph.label} class="aspect-square px-0">
			<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
				<path
					d={glyph.path}
					stroke="currentColor"
					stroke-width="1.4"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</ToggleGroupItem>
	{/each}
</ToggleGroup>
