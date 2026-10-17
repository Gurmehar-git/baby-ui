<script lang="ts">
import { MediaController } from "media-chrome";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { videoPlayer } from "../variants";
import { getVideoPlayer } from "./context";

let {
	ref = $bindable(null),
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLElement> & { ref?: HTMLElement | null } = $props();

const player = getVideoPlayer();

// Associated rather than nested, so the row can sit under the video or float over it.
$effect(() => {
	const controller = player.controller;
	const bar = ref;
	if (!(controller instanceof MediaController) || !bar) return;
	controller.associateElement(bar);
	return () => controller.unassociateElement(bar);
});
</script>

<media-control-bar
	bind:this={ref}
	data-slot="video-player-control-bar"
	data-menu-open={player.menuOpen}
	class={cn(videoPlayer({ variant: player.variant }).controlBar(), classProp)}
	{...rest}
>
	{@render children?.()}
</media-control-bar>
