<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { button } from "../../button/variants";
import { cn } from "../../lib/cn";
import { videoPlayer } from "../variants";
import { getVideoPlayer } from "./context";

let {
	ref = $bindable(null),
	class: classProp,
	...rest
}: HTMLAttributes<HTMLElement> & { ref?: HTMLElement | null } = $props();

const player = getVideoPlayer();
const s = $derived(videoPlayer({ variant: player.variant }));
</script>

<media-pip-button
	bind:this={ref}
	notooltip
	data-slot="video-player-pip-button"
	data-pip={player.pip}
	class={cn(
		button({ variant: "ghost", size: "icon-sm" }),
		s.button(),
		"[&[mediapipunavailable]]:hidden",
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
			data-shown={!player.pip}
			class={s.swapIcon()}
		>
			<path d="M11 19h-6a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4" />
			<path
				d="M14 14m0 1a1 1 0 0 1 1 -1h5a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1z"
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
			data-shown={player.pip}
			class={s.swapIcon()}
		>
			<path d="M11 19h-6a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4" />
			<path d="M7 9l4 4m-4 -1v-3h3" />
		</svg>
	</span>
</media-pip-button>
