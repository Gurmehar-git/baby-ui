<script lang="ts">
import { cn } from "../../lib/cn";
import { magicLinkLoginState } from "./context";

let {
	headingLevel = 2,
	class: classProp,
}: { headingLevel?: 1 | 2 | 3 | 4 | 5 | 6; class?: string } = $props();

const ctx = magicLinkLoginState("MagicLinkLoginSentHeader");
let heading = $state<HTMLElement>();

$effect(() => {
	ctx.setSentHeading(heading);
	return () => ctx.setSentHeading(undefined);
});
</script>

<!-- The mail mark, "Check your inbox" and the address it went to; takes focus when shown. -->
<div class={ctx.styles.sentIcon()}>
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.75"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<rect x="3" y="5" width="18" height="14" rx="2" />
		<path d="m3.5 6.5 8.5 6 8.5-6" />
	</svg>
</div>
<div class={cn(ctx.styles.header(), classProp)}>
	<svelte:element
		this={`h${headingLevel}`}
		bind:this={heading}
		tabindex={-1}
		class={ctx.styles.title()}
	>
		{ctx.labels.sentTitle}
	</svelte:element>
	<p class={ctx.styles.description()}>
		{ctx.labels.sentTo} <span class={ctx.styles.address()}>{ctx.address}</span>.
		{ctx.labels.sentBody}
	</p>
</div>
