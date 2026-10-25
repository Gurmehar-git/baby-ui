<script lang="ts">
import type { Snippet } from "svelte";
import Button from "../../button/svelte/button.svelte";

let {
	href,
	external = false,
	onclick,
	class: classProp,
	children,
}: {
	href?: string;
	external?: boolean;
	onclick?: () => void;
	class?: string;
	children?: Snippet;
} = $props();
</script>

<!-- A link or button for the notice; `external` opens a link in a new tab with an arrow. -->
{#if href}
	<Button
		{href}
		variant="outline"
		size="sm"
		class={classProp}
		{onclick}
		target={external ? "_blank" : undefined}
		rel={external ? "noreferrer" : undefined}
	>
		{@render children?.()}
		{#if external}
			<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M5 11 11 5M6 5h5v5" />
			</svg>
		{/if}
	</Button>
{:else}
	<Button variant="outline" size="sm" class={classProp} {onclick}>
		{@render children?.()}
	</Button>
{/if}
