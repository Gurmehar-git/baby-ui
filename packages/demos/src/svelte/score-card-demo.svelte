<script lang="ts">
import { ScoreCard } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ScoreCard>>(props));
</script>

<div class="w-full max-w-xs">
	<ScoreCard
		title="Performance"
		description="Lighthouse, last deploy"
		value={87}
		min={Number(props.min ?? 0)}
		max={Number(props.max ?? 100)}
		trend={4}
		tone={p.tone ?? "primary"}
		layout={p.layout ?? "arc"}
		size={p.size ?? "default"}
	/>
</div>
