<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/svelte/cn";
import { getVideoPlayer } from "./context";
import { videoPlayer } from "./variants";

let {
	loadingDelay = 500,
	ref = $bindable(null),
	class: classProp,
	...rest
}: HTMLAttributes<HTMLElement> & {
	/** Milliseconds of buffering before the spinner shows, so brief stalls never flash it. */
	loadingDelay?: number;
	ref?: HTMLElement | null;
} = $props();

const player = getVideoPlayer();
const s = $derived(videoPlayer({ variant: player.variant }));
</script>

<media-loading-indicator
	bind:this={ref}
	noautohide
	style:--media-loading-indicator-transition-delay="{loadingDelay}ms"
	data-slot="video-player-loading-indicator"
	class={cn(s.loading(), classProp)}
	{...rest}
>
	<span slot="icon" class={s.loadingIcon()}>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M12 3a9 9 0 1 0 9 9" />
		</svg>
	</span>
</media-loading-indicator>
