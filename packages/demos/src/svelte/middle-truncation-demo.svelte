<script lang="ts">
import {
	MiddleTruncation,
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof MiddleTruncation>>(props));
const values = [
	{ text: "/workspace/products/checkout/components/payment-method.tsx", end: 4 },
	{ text: "FY26_Q1_Consolidated_Financial_Statements.pdf", end: 4 },
	{ text: "sha256:8f9ce71d07ad44b60a4c62b814c903d783f33128", minEnd: 12 },
];
</script>

<div class="h-56 w-full max-w-xl">
	<ResizablePanelGroup aria-label="Resize truncation examples" variant="bordered">
		<ResizablePanel id="examples" label="Examples" defaultSize={72} minSize={140}>
			<div class="grid h-full content-center gap-5 p-5">
				{#each values as value (value.text)}
					{#if "end" in value}
						<MiddleTruncation text={p.text ?? value.text} end={value.end} variant={p.variant ?? "code"} />
					{:else}
						<MiddleTruncation text={p.text ?? value.text} minEnd={value.minEnd} variant={p.variant ?? "code"} />
					{/if}
				{/each}
			</div>
		</ResizablePanel>
		<ResizableHandle />
		<ResizablePanel id="space" label="Available space" defaultSize={28} minSize={0} />
	</ResizablePanelGroup>
</div>
