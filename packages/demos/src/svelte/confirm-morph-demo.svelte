<script lang="ts">
import { ConfirmMorph } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ConfirmMorph>>(props));
const request = () => new Promise<void>((resolve) => setTimeout(resolve, 900));
</script>

<ConfirmMorph
	label={p.label || "Delete project"}
	prompt={p.prompt || undefined}
	variant={p.variant}
	size={p.size}
	mode={p.mode}
	onConfirm={request}
	onUndo={request}
/>
