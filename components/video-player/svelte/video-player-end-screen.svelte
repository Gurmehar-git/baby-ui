<script lang="ts">
import { untrack } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/svelte/cn";
import { getVideoPlayer } from "./context";
import { screenOpen, type VideoPlayerScreenTrigger } from "./types";
import { videoPlayer } from "./variants";

let {
	when = "ended",
	open: openProp,
	onOpenChange,
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & {
	/** Opens on its own after the video ends, before the first play, or whenever paused. */
	when?: VideoPlayerScreenTrigger;
	/** Forces the screen open or shut, overriding `when`. */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
} = $props();

const player = getVideoPlayer();
const s = $derived(videoPlayer({ variant: player.variant }));
const open = $derived(
	openProp ??
		screenOpen(when, {
			playing: player.playing,
			ended: player.ended,
			started: player.started,
		}),
);
let first = true;

$effect(() => {
	const next = open;
	if (first) {
		first = false;
		return;
	}
	untrack(() => onOpenChange?.(next));
});
</script>

<div
	data-slot="video-player-end-screen"
	data-open={open}
	aria-hidden={!open}
	inert={!open}
	class={cn(s.endScreen(), classProp)}
	{...rest}
>
	<div class={s.endScreenBody()}>
		{@render children?.()}
	</div>
</div>
