<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { loadingStateState } from "./context";
import LoadingStateIndicator from "./loading-state-indicator.svelte";

let {
	src,
	children,
	class: classProp,
}: {
	/** A looping video URL; without one, or if it fails, the fallback shows. */
	src?: string;
	/** Replaces the default "Video unavailable" placeholder. */
	children?: Snippet;
	class?: string;
} = $props();
const loader = loadingStateState();
let failed = $state(false);
</script>

<!-- A looping video card under the row, for a "look away while this runs" long task. -->
<div data-slot="loading-state-preview" class={cn(loader.styles.preview(), classProp)}>
	<div class={loader.styles.frame()}>
		{#if src && !failed}
			<!-- svelte-ignore a11y_media_has_caption -- decorative loading-state loop, no meaningful audio -->
			<video
				{src}
				autoplay
				muted
				loop
				playsinline
				onerror={() => (failed = true)}
				class={loader.styles.video()}
			></video>
		{:else if children}
			{@render children()}
		{:else}
			<div class={loader.styles.fallback()}>
				<LoadingStateIndicator />
				<span class={loader.styles.fallbackText()}>Video unavailable</span>
			</div>
		{/if}
	</div>
</div>
