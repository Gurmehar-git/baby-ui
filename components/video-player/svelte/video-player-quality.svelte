<script lang="ts">
import { button } from "../../button/svelte/variants";
import { cn } from "../../lib/svelte/cn";
import Popover from "../../popover/svelte/popover.svelte";
import PopoverContent from "../../popover/svelte/popover-content.svelte";
import PopoverTrigger from "../../popover/svelte/popover-trigger.svelte";
import RadioGroup from "../../radio-group/svelte/radio-group.svelte";
import RadioGroupItem from "../../radio-group/svelte/radio-group-item.svelte";
import { getVideoPlayer } from "./context";
import { formatQuality, VIDEO_QUALITY_AUTO, type VideoPlayerRendition } from "./types";
import { videoPlayer } from "./variants";

let {
	label = "Quality",
	autoLabel = "Auto",
	formatQuality: format = formatQuality,
	class: classProp,
}: {
	label?: string;
	autoLabel?: string;
	formatQuality?: (quality: VideoPlayerRendition) => string;
	class?: string;
} = $props();

const player = getVideoPlayer();
const s = $derived(videoPlayer({ variant: player.variant }));
const byHeight = $derived(
	[...player.qualities].sort((a, b) => b.height - a.height || b.bitrate - a.bitrate),
);
const active = $derived(player.qualities.find((q) => q.index === player.activeQuality));
const current = $derived(player.qualities.find((q) => q.index === player.quality));
const shown = $derived(current ? format(current) : autoLabel);
let open = $state(false);

// Keeps the bar visible while the popup, portalled out of the bar, is open.
$effect(() => {
	if (!open) return;
	player.holdControls(true);
	return () => player.holdControls(false);
});
</script>

{#if player.qualities.length > 1}
	<Popover bind:open>
		<PopoverTrigger
			aria-label={`${label}: ${shown}`}
			data-slot="video-player-quality"
			class={cn(button({ variant: "ghost", size: "sm" }), s.button(), s.menuTrigger(), classProp)}
		>
			{#key shown}
				<span class={s.menuValue()}>{shown}</span>
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
					() => String(player.quality),
					(next) => {
						player.setQuality(Number(next));
						open = false;
					}
				}
			>
				<RadioGroupItem value={String(VIDEO_QUALITY_AUTO)}>
					<span class="flex w-full items-center">
						{autoLabel}
						{#if active}
							<span class={s.menuHint()}>{format(active)}</span>
						{/if}
					</span>
				</RadioGroupItem>
				{#each byHeight as q (q.index)}
					<RadioGroupItem value={String(q.index)} label={format(q)} />
				{/each}
			</RadioGroup>
		</PopoverContent>
	</Popover>
{/if}
