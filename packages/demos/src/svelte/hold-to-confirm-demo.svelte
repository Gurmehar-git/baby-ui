<script lang="ts">
import { HoldToConfirm } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof HoldToConfirm>>(props));
let confirmed = $state(false);
let hint = $state("");
</script>

<div class="flex flex-col items-center gap-3">
	<HoldToConfirm
		label={p.label || "Hold to delete project"}
		confirmedLabel={p.confirmedLabel || "Deleted"}
		variant={p.variant ?? "destructive"}
		size={p.size ?? "default"}
		duration={p.duration ?? 1200}
		bind:confirmed
		onConfirm={() => {}}
		onHoldChange={(holding) => (hint = holding ? "Keep holding…" : "")}
	/>
	<p class="h-4 text-muted-foreground text-xs">
		{#if confirmed}
			<button type="button" class="underline underline-offset-4" onclick={() => (confirmed = false)}>Undo</button>
		{:else}
			<span aria-hidden="true">{hint}</span>
		{/if}
	</p>
</div>
