<script lang="ts">
import { MediaController } from "media-chrome";
import { untrack } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cardFrame } from "../../card/svelte/variants";
import { cn } from "../../lib/svelte/cn";
import { setVideoPlayer } from "./context";
import {
	clampVolume,
	mediaErrorKind,
	routesToHotkeys,
	VIDEO_HOTKEY_SCROLL_KEYS,
	VIDEO_QUALITY_AUTO,
	VIDEO_SEEK_TOLERANCE,
	type VideoPlayerErrorKind,
	type VideoPlayerRendition,
	volumeLevel,
} from "./types";
import { VIDEO_PLAYER_CARD, type VideoPlayerVariant, videoPlayer } from "./variants";

let {
	variant = "default",
	playing = $bindable(false),
	onPlayingChange,
	currentTime = $bindable(0),
	onCurrentTimeChange,
	volume = $bindable(1),
	onVolumeChange,
	muted = $bindable(false),
	onMutedChange,
	loop = $bindable(false),
	onLoopChange,
	playbackRate = $bindable(1),
	onPlaybackRateChange,
	quality = $bindable(VIDEO_QUALITY_AUTO),
	onQualityChange,
	onError,
	label = "Video player",
	onkeydown,
	onkeyup,
	ref = $bindable(null),
	class: classProp,
	children,
	...rest
}: Omit<HTMLAttributes<HTMLElement>, "onerror"> & {
	variant?: VideoPlayerVariant;
	playing?: boolean;
	onPlayingChange?: (playing: boolean) => void;
	/** Playhead in seconds. */
	currentTime?: number;
	onCurrentTimeChange?: (seconds: number) => void;
	/** 0 to 1. */
	volume?: number;
	onVolumeChange?: (volume: number) => void;
	muted?: boolean;
	onMutedChange?: (muted: boolean) => void;
	loop?: boolean;
	onLoopChange?: (loop: boolean) => void;
	playbackRate?: number;
	onPlaybackRateChange?: (rate: number) => void;
	/** HLS rendition index, or `-1` for automatic. */
	quality?: number;
	onQualityChange?: (quality: number) => void;
	/** Fires when playback fails; `VideoPlayerError` shows the matching message. */
	onError?: (error: VideoPlayerErrorKind) => void;
	/** Accessible name of the player region. */
	label?: string;
	ref?: HTMLElement | null;
} = $props();

let controller = $state<HTMLElement | null>(null);
let video = $state<HTMLVideoElement | null>(null);
let duration = $state(0);
let ended = $state(false);
let started = $state(false);
let pip = $state(false);
let fullscreen = $state(false);
let qualities = $state<VideoPlayerRendition[]>([]);
let activeQuality = $state(VIDEO_QUALITY_AUTO);
let error = $state<VideoPlayerErrorKind | null>(null);
let attempt = $state(0);
let menus = $state(0);

function setPlaying(next: boolean) {
	if (next === playing) return;
	playing = next;
	onPlayingChange?.(next);
}
function setCurrentTime(next: number) {
	if (next === currentTime) return;
	currentTime = next;
	onCurrentTimeChange?.(next);
}
function setVolume(next: number) {
	if (next === volume) return;
	volume = next;
	onVolumeChange?.(next);
}
function setMuted(next: boolean) {
	if (next === muted) return;
	muted = next;
	onMutedChange?.(next);
}
function setLoop(next: boolean) {
	if (next === loop) return;
	loop = next;
	onLoopChange?.(next);
}
function setPlaybackRate(next: number) {
	if (next === playbackRate) return;
	playbackRate = next;
	onPlaybackRateChange?.(next);
}
function setQuality(next: number) {
	if (next === quality) return;
	quality = next;
	onQualityChange?.(next);
}
function setError(next: VideoPlayerErrorKind | null) {
	error = next;
	if (next) onError?.(next);
}

setVideoPlayer({
	get variant() {
		return variant;
	},
	get root() {
		return ref;
	},
	get fullscreen() {
		return fullscreen;
	},
	get playing() {
		return playing;
	},
	get ended() {
		return ended;
	},
	get started() {
		return started;
	},
	get pip() {
		return pip;
	},
	get currentTime() {
		return currentTime;
	},
	get duration() {
		return duration;
	},
	get volume() {
		return volume;
	},
	get muted() {
		return muted;
	},
	get level() {
		return volumeLevel(volume, muted);
	},
	get loop() {
		return loop;
	},
	get playbackRate() {
		return playbackRate;
	},
	get quality() {
		return quality;
	},
	get activeQuality() {
		return activeQuality;
	},
	get error() {
		return error;
	},
	get attempt() {
		return attempt;
	},
	get menuOpen() {
		return menus > 0;
	},
	get qualities() {
		return qualities;
	},
	set qualities(next) {
		qualities = next;
	},
	setVolume,
	setMuted,
	setLoop,
	setPlaybackRate,
	setQuality,
	setActiveQuality: (index) => {
		activeQuality = index;
	},
	setError,
	retry: () => {
		error = null;
		attempt += 1;
	},
	// Untracked: menus call this from their own effects, which must not subscribe to the count.
	holdControls: (open) => {
		menus = Math.max(0, untrack(() => menus) + (open ? 1 : -1));
	},
	get controller() {
		return controller;
	},
	set controller(next) {
		controller = next;
	},
	get video() {
		return video;
	},
	set video(next) {
		video = next;
	},
});

$effect(() => {
	const el = video;
	if (!el) return;
	const readDuration = () => {
		duration = Number.isFinite(el.duration) ? el.duration : 0;
	};
	const readTime = () => setCurrentTime(el.currentTime);
	const listeners: [string, () => void][] = [
		[
			"play",
			() => {
				setPlaying(true);
				ended = false;
				started = true;
			},
		],
		["pause", () => setPlaying(false)],
		[
			"ended",
			() => {
				ended = true;
			},
		],
		[
			"seeking",
			() => {
				ended = false;
			},
		],
		["timeupdate", readTime],
		["seeked", readTime],
		["durationchange", readDuration],
		["loadedmetadata", readDuration],
		[
			"emptied",
			() => {
				readDuration();
				started = false;
				ended = false;
			},
		],
		[
			"volumechange",
			() => {
				setVolume(el.volume);
				setMuted(el.muted);
			},
		],
		["ratechange", () => setPlaybackRate(el.playbackRate)],
		[
			"enterpictureinpicture",
			() => {
				pip = true;
			},
		],
		[
			"leavepictureinpicture",
			() => {
				pip = false;
			},
		],
		["error", () => setError(mediaErrorKind(el.error?.code))],
	];
	for (const [name, listener] of listeners) el.addEventListener(name, listener);
	readDuration();
	return () => {
		for (const [name, listener] of listeners) el.removeEventListener(name, listener);
	};
});

// Muted is applied before play, so a muted autoplay clears the browser's autoplay policy.
$effect(() => {
	if (video && video.muted !== muted) video.muted = muted;
});

$effect(() => {
	const next = clampVolume(volume);
	if (video && Math.abs(video.volume - next) > 0.001) video.volume = next;
});

$effect(() => {
	if (video) video.loop = loop;
});

$effect(() => {
	if (video && video.playbackRate !== playbackRate) video.playbackRate = playbackRate;
});

$effect(() => {
	if (video && Math.abs(video.currentTime - currentTime) > VIDEO_SEEK_TOLERANCE)
		video.currentTime = Math.max(0, currentTime);
});

$effect(() => {
	const el = video;
	if (!el) return;
	if (playing && el.paused) el.play().catch(() => setPlaying(false));
	else if (!playing && !el.paused) el.pause();
});

// Fullscreen takes the whole player, so a control row outside the video comes along.
$effect(() => {
	if (controller instanceof MediaController && ref) controller.fullscreenElement = ref;
});

$effect(() => {
	const read = () => {
		fullscreen = !!ref && document.fullscreenElement === ref;
	};
	document.addEventListener("fullscreenchange", read);
	return () => document.removeEventListener("fullscreenchange", read);
});
</script>

<!-- Media-chrome only hears hotkeys inside its controller; keys from the bar are handed to it. -->
<section
	bind:this={ref}
	aria-label={label}
	onkeydown={(event) => {
		onkeydown?.(event);
		if (controller instanceof MediaController && routesToHotkeys(event, controller))
			if (VIDEO_HOTKEY_SCROLL_KEYS.includes(event.key)) event.preventDefault();
	}}
	onkeyup={(event) => {
		onkeyup?.(event);
		if (controller instanceof MediaController && routesToHotkeys(event, controller))
			controller.keyboardShortcutHandler(event);
	}}
	data-slot="video-player"
	data-variant={variant}
	data-playing={playing}
	data-ended={ended}
	class={cn(
		cardFrame({ variant: VIDEO_PLAYER_CARD[variant] }).root(),
		videoPlayer({ variant }).root(),
		classProp,
	)}
	{...rest}
>
	{@render children?.()}
</section>
