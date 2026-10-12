<script lang="ts">
import { GaugeChart } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof GaugeChart>>(props));

const layout = $derived(p.layout ?? "arc");
/** Demo bands: the state names itself as the value crosses each threshold. */
const BANDS = [
	{ from: 0, label: "Critical", tone: "negative" as const },
	{ from: 40, label: "Watch", tone: "highlight" as const },
	{ from: 70, label: "Healthy", tone: "primary" as const },
];
</script>

<div class={layout === "linear" ? "w-full max-w-md" : "w-full max-w-sm"}>
	<GaugeChart
		value={Number(props.value ?? 72)}
		{layout}
		tone={p.tone ?? "primary"}
		notches={Number(props.notches ?? 40)}
		spacing={Number(props.spacing ?? 25)}
		label={p.label || undefined}
		bands={props.banded ? BANDS : undefined}
		showValue={props.showValue !== false}
	/>
</div>
