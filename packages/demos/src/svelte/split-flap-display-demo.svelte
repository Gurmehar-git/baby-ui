<script lang="ts">
import { SplitFlapDisplay } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { departuresBoard, departuresLine } from "../data/departures";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof SplitFlapDisplay>>(props));

let tick = $state(0);
const columns = $derived(Number(props.columns ?? 24));

$effect(() => {
	const id = setInterval(() => (tick += 1), 6000);
	return () => clearInterval(id);
});
</script>

<div class="w-full">
	<SplitFlapDisplay
		value={props.layout === "line" ? departuresLine(tick) : departuresBoard(tick, columns)}
		{columns}
		variant={p.variant ?? "solid"}
		size={p.size ?? "default"}
		indicator={p.indicator ?? "success"}
		stepMs={Number(props.stepMs ?? 60)}
		staggerMs={Number(props.staggerMs ?? 30)}
	/>
</div>
