<script lang="ts">
import type { HTMLButtonAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { showMore } from "../variants";
import { showMoreState } from "./context";

let {
	moreLabel = "Show more",
	lessLabel = "Show less",
	class: classProp,
	...rest
}: Omit<HTMLButtonAttributes, "children" | "onclick"> & {
	moreLabel?: string;
	lessLabel?: string;
} = $props();
const clamp = showMoreState();
const styles = showMore();
</script>

<!-- The expander; renders nothing while the content fits. -->
{#if clamp.expandable}
	<button
		data-slot="show-more-trigger"
		type="button"
		{...rest}
		onclick={clamp.toggle}
		aria-expanded={clamp.open}
		aria-controls={clamp.regionId}
		class={cn(styles.trigger(), classProp)}
	>
		{clamp.open ? lessLabel : moreLabel}
		<svg viewBox="0 0 12 12" fill="none" aria-hidden="true" data-on={clamp.open} class={styles.chevron()}>
			<path d="m2.5 4.25 3.5 3.5 3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	</button>
{/if}
