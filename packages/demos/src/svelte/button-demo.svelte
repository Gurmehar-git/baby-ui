<script lang="ts">
import { Button } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Button>>(props));

const variant = $derived(p.variant ?? "default");
const size = $derived(p.size ?? "default");
const href = $derived(p.href || undefined);
const loading = $derived(p.loading ?? false);
const loadingLabel = $derived(p.loadingLabel || "Loading…");
const disabled = $derived(p.disabled ?? false);
</script>

<Button {variant} {size} {href} {loading} {loadingLabel} {disabled}>
	{size.startsWith("icon") ? "" : "Deploy project"}
	{#if size.startsWith("icon")}
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path
				d="M8 3.5v9M3.5 8h9"
				stroke="currentColor"
				stroke-width="1.6"
				stroke-linecap="round"
			/>
		</svg>
	{/if}
</Button>
