<script lang="ts">
import type { Snippet } from "svelte";
import type { EmptyLayout, EmptySize, EmptyVariant } from "../empty/variants";
import type { ErrorBoundaryLabels } from "./core";
import ErrorBoundaryFallback from "./error-boundary-fallback.svelte";

let {
	children,
	fallback,
	onerror,
	onreset,
	labels,
	details = true,
	variant = "card",
	layout = "vertical",
	size = "default",
	class: classProp,
}: {
	children?: Snippet;
	/** Replaces the default fallback; receives the error and a reset. */
	fallback?: Snippet<[{ error: unknown; reset: () => void }]>;
	onerror?: (error: unknown) => void;
	/** Runs before the children render again, e.g. to clear the state that threw. */
	onreset?: () => void;
	labels?: Partial<ErrorBoundaryLabels>;
	details?: boolean;
	variant?: EmptyVariant;
	layout?: EmptyLayout;
	size?: EmptySize;
	class?: string;
} = $props();
</script>

<!-- Svelte's own boundary: catches errors while its children render or run effects. -->
<svelte:boundary onerror={(error) => onerror?.(error)}>
	{@render children?.()}

	{#snippet failed(error, retry)}
		{@const reset = () => {
			onreset?.();
			retry();
		}}
		{#if fallback}
			{@render fallback({ error, reset })}
		{:else}
			<ErrorBoundaryFallback {error} {reset} {labels} {details} {variant} {layout} {size} class={classProp} />
		{/if}
	{/snippet}
</svelte:boundary>
