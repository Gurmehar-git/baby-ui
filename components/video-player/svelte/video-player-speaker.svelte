<script lang="ts">
import type { VideoPlayerVolumeLevel } from "./types";

let { level, class: classProp }: { level: VideoPlayerVolumeLevel; class: string } =
	$props();
</script>

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
	<path data-shown={level !== "off"} class={classProp} d="M15 8a5 5 0 0 1 0 8" />
	<path data-shown={level === "high"} class={classProp} d="M17.7 5a9 9 0 0 1 0 14" />
	<path data-shown={level === "off"} class={classProp} d="M16 10l4 4m0 -4l-4 4" />
</svg>
