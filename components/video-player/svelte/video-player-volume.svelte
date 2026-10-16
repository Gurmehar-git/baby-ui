<script lang="ts">
import { MediaController } from "media-chrome";
import type { HTMLAttributes } from "svelte/elements";
import { button } from "../../button/svelte/variants";
import { cn } from "../../lib/svelte/cn";
import Popover from "../../popover/svelte/popover.svelte";
import PopoverContent from "../../popover/svelte/popover-content.svelte";
import PopoverTrigger from "../../popover/svelte/popover-trigger.svelte";
import { getVideoPlayer } from "./context";
import { clampVolume } from "./types";
import { videoPlayer } from "./variants";
import VideoPlayerSpeaker from "./video-player-speaker.svelte";

let {
	label = "Volume",
	openOnHover = true,
	openDelay = 0,
	closeDelay = 200,
	rangeProps,
	class: classProp,
}: {
	/** Names the trigger and the popup. */
	label?: string;
	/** Opens on hover as well as on click. */
	openOnHover?: boolean;
	openDelay?: number;
	closeDelay?: number;
	/** Forwarded to the media-chrome volume range inside the popup. */
	rangeProps?: HTMLAttributes<HTMLElement>;
	class?: string;
} = $props();

const player = getVideoPlayer();
const s = $derived(videoPlayer({ variant: player.variant }));
// The popup sits on the popover surface, so its controls take the light-surface look.
const surface = videoPlayer({ variant: "default" });
const ghost = button({ variant: "ghost", size: "icon-sm" });
const percent = $derived(player.muted ? 0 : Math.round(clampVolume(player.volume) * 100));
let open = $state(false);
let panel = $state<HTMLDivElement | null>(null);

// Keeps the bar visible while the popup, portalled out of the bar, is open.
$effect(() => {
	if (!open) return;
	player.holdControls(true);
	return () => player.holdControls(false);
});

// Portalled out of the bar, so the panel registers with the controller itself.
$effect(() => {
	const controller = player.controller;
	const el = panel;
	if (!(controller instanceof MediaController) || !el) return;
	controller.associateElement(el);
	return () => controller.unassociateElement(el);
});
</script>

<Popover bind:open>
	<PopoverTrigger
		{openOnHover}
		{openDelay}
		{closeDelay}
		aria-label={label}
		data-slot="video-player-volume"
		data-level={player.level}
		class={cn(ghost, s.button(), classProp)}
	>
		<span class={s.iconStack()}>
			<VideoPlayerSpeaker level={player.level} class={s.wave()} />
		</span>
	</PopoverTrigger>
	<PopoverContent
		side="top"
		sideOffset={8}
		aria-label={label}
		container={player.fullscreen ? player.root : null}
		class={s.volumeMenu()}
	>
		<div bind:this={panel} class={s.volumePanel()}>
			<media-mute-button
				notooltip
				data-level={player.level}
				class={cn(ghost, surface.button(), "size-7")}
			>
				<span slot="icon" class={s.iconStack()}>
					<VideoPlayerSpeaker level={player.level} class={s.wave()} />
				</span>
			</media-mute-button>
			<media-volume-range
				{...rangeProps}
				class={cn(surface.range(), s.volumeRange(), rangeProps?.class)}
			></media-volume-range>
			<span class={s.volumeValue()}>{percent}</span>
		</div>
	</PopoverContent>
</Popover>
