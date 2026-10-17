<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { button } from "../../button/variants";
import { cn } from "../../lib/cn";
import { videoPlayer } from "../variants";
import { getVideoPlayer } from "./context";

let {
	seekOffset = 10,
	ref = $bindable(null),
	class: classProp,
	...rest
}: HTMLAttributes<HTMLElement> & {
	/** Seconds to jump ahead. */
	seekOffset?: number;
	ref?: HTMLElement | null;
} = $props();

const player = getVideoPlayer();
const s = $derived(videoPlayer({ variant: player.variant }));
</script>

<media-seek-forward-button
	bind:this={ref}
	notooltip
	seekoffset={seekOffset}
	data-slot="video-player-seek-forward-button"
	class={cn(button({ variant: "ghost", size: "icon-sm" }), s.button(), s.seekButton(), classProp)}
	{...rest}
>
	<span slot="icon" data-direction="forward" class={s.seekIcon()}>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M19.95 11a8 8 0 1 0 -.5 4m.5 5v-5h-5" />
		</svg>
	</span>
</media-seek-forward-button>
