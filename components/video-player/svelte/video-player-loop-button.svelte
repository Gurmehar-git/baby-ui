<script lang="ts">
import type { HTMLButtonAttributes } from "svelte/elements";
import { button } from "../../button/variants";
import { cn } from "../../lib/cn";
import { videoPlayer } from "../variants";
import { getVideoPlayer } from "./context";

let {
	class: classProp,
	"aria-label": label = "Loop",
	...rest
}: Omit<HTMLButtonAttributes, "onclick" | "aria-pressed" | "children"> = $props();

const player = getVideoPlayer();
const s = $derived(videoPlayer({ variant: player.variant }));
</script>

<button
	type="button"
	data-slot="video-player-loop-button"
	aria-label={label}
	aria-pressed={player.loop}
	class={cn(button({ variant: "ghost", size: "icon-sm" }), s.button(), s.loopButton(), classProp)}
	onclick={() => player.setLoop(!player.loop)}
	{...rest}
>
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		class={s.loopIcon()}
	>
		<path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3" />
		<path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3" />
	</svg>
</button>
