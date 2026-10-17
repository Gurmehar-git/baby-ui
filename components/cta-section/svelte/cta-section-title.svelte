<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { ctaSectionState } from "./context";

let { class: classProp, children }: { class?: string; children?: Snippet } = $props();
const cta = ctaSectionState();
</script>

<!-- The heading that names the section; inline in the banner. -->
{#if cta.variant === "banner"}
	<strong data-slot="cta-section-title" id={cta.titleId} class={cn(cta.styles.bannerTitle(), classProp)}>
		{@render children?.()}
	</strong>
{:else}
	<h2 data-slot="cta-section-title" id={cta.titleId} class={cn(cta.styles.title(), classProp)}>
		{@render children?.()}
	</h2>
{/if}
