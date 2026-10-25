<script lang="ts">
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const pValue = $derived(controlProps<ComponentProps<typeof SelectValue>>(props));
const pContent = $derived(controlProps<ComponentProps<typeof SelectContent>>(props));
const pTrigger = $derived(controlProps<ComponentProps<typeof SelectTrigger>>(props));

let value = $state("edge");

const RUNTIMES = [
	{ value: "edge", label: "Edge runtime" },
	{ value: "node", label: "Node runtime" },
	{ value: "static", label: "Static export" },
	{ value: "hybrid", label: "Hybrid", disabled: true },
];
</script>

<div class="w-64">
	<Select bind:value items={RUNTIMES} size={pTrigger.size}>
		<SelectTrigger aria-label="Runtime" variant={pTrigger.variant} size={pTrigger.size}>
			<SelectValue placeholder={pValue.placeholder || "Select an option"} />
		</SelectTrigger>
		<SelectContent side={pContent.side ?? "bottom"}>
			<SelectItem value="edge" label="Edge runtime">Edge runtime</SelectItem>
			<SelectItem value="node" label="Node runtime">Node runtime</SelectItem>
			<SelectItem value="static" label="Static export">Static export</SelectItem>
			<SelectItem value="hybrid" label="Hybrid" disabled>Hybrid</SelectItem>
		</SelectContent>
	</Select>
</div>
