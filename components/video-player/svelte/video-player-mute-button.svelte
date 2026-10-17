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

<media-mute-button
	bind:this={ref}
	notooltip
	data-slot="video-player-mute-button"
	data-level={player.level}
	class={cn(button({ variant: "ghost", size: "icon-sm" }), s.button(), classProp)}
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
		>
			<path
				d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5"
			/>
			<path data-shown={player.level !== "off"} class={s.wave()} d="M15 8a5 5 0 0 1 0 8" />
			<path data-shown={player.level === "high"} class={s.wave()} d="M17.7 5a9 9 0 0 1 0 14" />
			<path data-shown={player.level === "off"} class={s.wave()} d="M16 10l4 4m0 -4l-4 4" />
		</svg>
	</span>
</media-mute-button>
