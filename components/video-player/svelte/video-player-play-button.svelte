<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { button } from "../../button/svelte/variants";
import { cn } from "../../lib/svelte/cn";
import { getVideoPlayer } from "./context";
import { type VideoPlayerButtonSize, videoPlayer, videoPlayerButton } from "./variants";

let {
	size = "default",
	ref = $bindable(null),
	class: classProp,
	...rest
}: HTMLAttributes<HTMLElement> & {
	/** `lg` is a round control centred over the video, for use inside the viewport. */
	size?: VideoPlayerButtonSize;
	ref?: HTMLElement | null;
} = $props();

const player = getVideoPlayer();
const s = $derived(videoPlayer({ variant: player.variant }));
</script>

<media-play-button
	bind:this={ref}
	notooltip
	data-slot="video-player-play-button"
	data-size={size}
	data-playing={player.playing}
	class={cn(
		button({ variant: "ghost", size: "icon-sm" }),
		s.button(),
		videoPlayerButton({ size, variant: player.variant }),
		classProp,
	)}
	{...rest}
>
	<span slot="icon" class={s.iconStack()}>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			data-shown={!player.playing && !player.ended}
			data-glyph="fill"
			class={s.swapIcon()}
		>
			<path d="M7 4v16l13 -8z" />
		</svg>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			data-shown={player.playing}
			data-glyph="fill"
			class={s.swapIcon()}
		>
			<path d="M6 5h3v14h-3z" />
			<path d="M15 5h3v14h-3z" />
		</svg>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			data-shown={!player.playing && player.ended}
			class={s.swapIcon()}
		>
			<path d="M19.95 11a8 8 0 1 0 -.5 4m.5 5v-5h-5" />
		</svg>
	</span>
</media-play-button>
