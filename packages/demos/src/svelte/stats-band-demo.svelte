<script lang="ts">
import { StatsBand } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { STATS } from "../data/stats-band";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof StatsBand>>(props));
</script>

{#key p.variant}
	<StatsBand
		stats={STATS}
		variant={p.variant}
		title="Fast, steady and close to everyone"
		description="Measured across every region from October 2025 to September 2026."
		locale="en-US"
	/>
{/key}
