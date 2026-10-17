<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { ctaSectionState } from "./context";

let { class: classProp, children }: { class?: string; children?: Snippet } = $props();
const cta = ctaSectionState();
</script>

<!-- The copy column; one line of text in the banner. -->
{#if cta.variant === "banner"}
	<p data-slot="cta-section-content" class={cn(cta.styles.bannerText(), classProp)}>
		{@render children?.()}
	</p>
{:else}
	<div data-slot="cta-section-content" class={cn(cta.styles.copy(), classProp)}>
		{@render children?.()}
	</div>
{/if}
