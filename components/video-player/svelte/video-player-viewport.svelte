<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/svelte/cn";
import { getVideoPlayer } from "./context";
import { videoPlayer } from "./variants";

let {
	ref = $bindable(null),
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLElement> & { ref?: HTMLElement | null } = $props();

const player = getVideoPlayer();

$effect(() => {
	player.controller = ref;
	return () => {
		player.controller = null;
	};
});
</script>

<media-controller
	bind:this={ref}
	data-slot="video-player-viewport"
	class={cn(videoPlayer({ variant: player.variant }).viewport(), classProp)}
	{...rest}
>
	{@render children?.()}
</media-controller>
