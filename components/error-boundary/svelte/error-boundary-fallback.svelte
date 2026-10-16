<script lang="ts">
import Button from "../../button/svelte/button.svelte";
import Empty from "../../empty/svelte/empty.svelte";
import EmptyContent from "../../empty/svelte/empty-content.svelte";
import EmptyDescription from "../../empty/svelte/empty-description.svelte";
import EmptyHeader from "../../empty/svelte/empty-header.svelte";
import EmptyMedia from "../../empty/svelte/empty-media.svelte";
import EmptyTitle from "../../empty/svelte/empty-title.svelte";
import type { EmptyLayout, EmptySize, EmptyVariant } from "../../empty/svelte/variants";
import { ERROR_BOUNDARY_LABELS, type ErrorBoundaryLabels, errorMessage } from "./core";

let {
	error,
	reset,
	labels: labelsProp,
	details = true,
	variant = "card",
	layout = "vertical",
	size = "default",
	class: classProp,
}: {
	error: unknown;
	reset: () => void;
	labels?: Partial<ErrorBoundaryLabels>;
	/** Show the thrown message in a collapsed details row. */
	details?: boolean;
	variant?: EmptyVariant;
	layout?: EmptyLayout;
	size?: EmptySize;
	class?: string;
} = $props();

const labels = $derived({ ...ERROR_BOUNDARY_LABELS, ...labelsProp });
</script>

<!-- The default fallback: an Empty with a destructive tile, a retry and the error, folded away. -->
<Empty role="alert" data-slot="error-boundary" {variant} {layout} {size} class={classProp}>
	<EmptyHeader>
		<EmptyMedia variant="icon" tone="destructive">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
			</svg>
		</EmptyMedia>
		<EmptyTitle>{labels.title}</EmptyTitle>
		<EmptyDescription>{labels.description}</EmptyDescription>
	</EmptyHeader>
	<EmptyContent>
		<Button size="sm" variant="outline" onclick={reset}>{labels.retry}</Button>
		{#if details}
			<details class="w-full text-left text-muted-foreground text-xs">
				<summary class="cursor-pointer select-none text-center">{labels.details}</summary>
				<code class="mt-2 block break-words rounded-md border border-border bg-background p-2 font-mono">
					{errorMessage(error)}
				</code>
			</details>
		{/if}
	</EmptyContent>
</Empty>
