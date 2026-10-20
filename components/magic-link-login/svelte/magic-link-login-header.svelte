<script lang="ts">
import { cn } from "../../lib/cn";
import { magicLinkLoginState } from "./context";

let {
	headingLevel = 2,
	class: classProp,
}: { headingLevel?: 1 | 2 | 3 | 4 | 5 | 6; class?: string } = $props();

const ctx = magicLinkLoginState("MagicLinkLoginHeader");
</script>

<!-- Title and description of the form view; `headingLevel` matches the page outline. -->
<div class={cn(ctx.styles.header(), classProp)}>
	<svelte:element this={`h${headingLevel}`} class={ctx.styles.title()}>
		{ctx.labels.title}
	</svelte:element>
	<p class={ctx.styles.description()}>{ctx.labels.description}</p>
</div>
