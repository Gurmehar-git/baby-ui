<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { ctaSectionState } from "./context";

let { class: classProp, children }: { class?: string; children?: Snippet } = $props();
const cta = ctaSectionState();
</script>

{#if cta.variant === "banner"}
	<span data-slot="cta-section-description" class={cn(cta.styles.bannerDescription(), classProp)}>
		{@render children?.()}
	</span>
{:else}
	<p data-slot="cta-section-description" class={cn(cta.styles.description(), classProp)}>
		{@render children?.()}
	</p>
{/if}
