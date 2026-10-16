<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/svelte/cn";
import { getVideoPlayer } from "./context";
import { videoPlayer } from "./variants";

let {
	showPreview = true,
	ref = $bindable(null),
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLElement> & {
	/** Shows the time under the pointer while hovering the scrubber. */
	showPreview?: boolean;
	ref?: HTMLElement | null;
} = $props();

const player = getVideoPlayer();
const s = $derived(videoPlayer({ variant: player.variant }));
</script>

<media-time-range
	bind:this={ref}
	data-slot="video-player-time-range"
	class={cn(s.range(), s.timeRange(), classProp)}
	{...rest}
>
	{#if showPreview}
		<media-preview-time-display slot="preview" class={s.preview()}></media-preview-time-display>
	{/if}
	{@render children?.()}
</media-time-range>
