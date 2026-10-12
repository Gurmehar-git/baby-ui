<script lang="ts">
import { ActionButton } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ActionButton>>(props));
const request = () => new Promise<void>((resolve) => setTimeout(resolve, 900));
</script>

<ActionButton
	label={p.label || "Publish"}
	successLabel={p.successLabel || "Published"}
	pendingLabel="Publishing"
	variant={p.variant}
	size={p.size}
	onAction={request}
/>
