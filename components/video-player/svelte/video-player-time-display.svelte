<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { formatVideoTime } from "../types";
import { videoPlayer } from "../variants";
import { getVideoPlayer } from "./context";

let {
	showDuration = true,
	remaining = false,
	formatTime = formatVideoTime,
	class: classProp,
	...rest
}: HTMLAttributes<HTMLSpanElement> & {
	/** Appends the total length, as in `0:12 / 1:30`. */
	showDuration?: boolean;
	/** Shows time left (`-1:18`) instead of time elapsed. */
	remaining?: boolean;
	formatTime?: (seconds: number) => string;
} = $props();

const player = getVideoPlayer();
const s = $derived(videoPlayer({ variant: player.variant }));
const shown = $derived(
	remaining
		? `-${formatTime(Math.max(0, player.duration - Math.floor(player.currentTime)))}`
		: formatTime(Math.floor(player.currentTime)),
);
const total = $derived(formatTime(player.duration));

// Keyed from the right, so a changed character remounts and ticks in while the rest stay put.
function cells(text: string) {
	const chars = [...text];
	return chars.map((char, i) => ({ char, key: `${chars.length - i}:${char}` }));
}
</script>

<span data-slot="video-player-time-display" class={cn(s.time(), classProp)} {...rest}>
	<span class={s.timeValue()}>
		{#each cells(shown) as cell (cell.key)}<span class={s.timeChar()}>{cell.char}</span>{/each}
	</span>
	{#if showDuration}
		<span aria-hidden="true" class={s.separator()}>/</span>
		<span class={s.timeValue()}>
			{#each cells(total) as cell (cell.key)}<span class={s.timeChar()}>{cell.char}</span>{/each}
		</span>
	{/if}
</span>
