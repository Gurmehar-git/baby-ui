<script lang="ts">
import { button } from "../../button/svelte/variants";
import { cn } from "../../lib/svelte/cn";
import Popover from "../../popover/svelte/popover.svelte";
import PopoverContent from "../../popover/svelte/popover-content.svelte";
import PopoverTrigger from "../../popover/svelte/popover-trigger.svelte";
import RadioGroup from "../../radio-group/svelte/radio-group.svelte";
import RadioGroupItem from "../../radio-group/svelte/radio-group-item.svelte";
import { getVideoPlayer } from "./context";
import { formatPlaybackRate, VIDEO_PLAYBACK_RATES } from "./types";
import { videoPlayer } from "./variants";

let {
	rates = VIDEO_PLAYBACK_RATES,
	label = "Speed",
	formatRate = formatPlaybackRate,
	class: classProp,
}: {
	/** Speeds offered, as multipliers. */
	rates?: number[];
	label?: string;
	formatRate?: (rate: number) => string;
	class?: string;
} = $props();

const player = getVideoPlayer();
const s = $derived(videoPlayer({ variant: player.variant }));
let open = $state(false);

// Keeps the bar visible while the popup, portalled out of the bar, is open.
$effect(() => {
	if (!open) return;
	player.holdControls(true);
	return () => player.holdControls(false);
});
</script>

<Popover bind:open>
	<PopoverTrigger
		aria-label={`${label}: ${formatRate(player.playbackRate)}`}
		data-slot="video-player-playback-rate"
		class={cn(button({ variant: "ghost", size: "sm" }), s.button(), s.menuTrigger(), classProp)}
	>
		{#key player.playbackRate}
			<span class={s.menuValue()}>{formatRate(player.playbackRate)}</span>
		{/key}
	</PopoverTrigger>
	<PopoverContent
		side="top"
		sideOffset={8}
		aria-label={label}
		container={player.fullscreen ? player.root : null}
		class={s.menu()}
	>
		<p class={s.menuLabel()}>{label}</p>
		<RadioGroup
			variant="list"
			size="sm"
			bind:value={
				() => String(player.playbackRate),
				(next) => {
					player.setPlaybackRate(Number(next));
					open = false;
				}
			}
		>
			{#each rates as rate (rate)}
				<RadioGroupItem value={String(rate)} label={formatRate(rate)} />
			{/each}
		</RadioGroup>
	</PopoverContent>
</Popover>
