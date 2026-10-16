<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { button } from "../../button/svelte/variants";
import { cn } from "../../lib/svelte/cn";
import { getVideoPlayer } from "./context";
import { videoPlayer } from "./variants";

let {
	ref = $bindable(null),
	class: classProp,
	...rest
}: HTMLAttributes<HTMLElement> & { ref?: HTMLElement | null } = $props();

const player = getVideoPlayer();
const s = $derived(videoPlayer({ variant: player.variant }));
</script>

<media-fullscreen-button
	bind:this={ref}
	notooltip
	data-slot="video-player-fullscreen-button"
	data-fullscreen={player.fullscreen}
	class={cn(
		button({ variant: "ghost", size: "icon-sm" }),
		s.button(),
		"[&[mediafullscreenunavailable]]:hidden",
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
			data-shown={!player.fullscreen}
			class={s.swapIcon()}
		>
			<path
				d="M4 8v-2a2 2 0 0 1 2 -2h2M4 16v2a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v2M16 20h2a2 2 0 0 0 2 -2v-2"
			/>
		</svg>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			data-shown={player.fullscreen}
			class={s.swapIcon()}
		>
			<path
				d="M15 19v-2a2 2 0 0 1 2 -2h2M15 5v2a2 2 0 0 0 2 2h2M5 15h2a2 2 0 0 1 2 2v2M5 9h2a2 2 0 0 0 2 -2v-2"
			/>
		</svg>
	</span>
</media-fullscreen-button>
