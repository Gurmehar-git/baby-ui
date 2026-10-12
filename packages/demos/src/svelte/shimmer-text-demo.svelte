<script lang="ts">
import { ShimmerText } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ShimmerText>>(props));
</script>

<div class="text-lg">
	<ShimmerText
		text="Agent is thinking ..."
		durationMs={Number(props.durationMs ?? 2000)}
		spread={Number(props.spread ?? 2)}
		active={p.active ?? true}
		variant={p.variant}
		size={p.size ?? "inherit"}
		class="font-light tracking-tight"
	/>
</div>
