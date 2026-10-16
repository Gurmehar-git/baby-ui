<script lang="ts">
import type { default as Hls, HlsConfig } from "hls.js";
import type { HTMLVideoAttributes } from "svelte/elements";
import { cn } from "../../lib/svelte/cn";
import { getVideoPlayer } from "./context";
import { isHlsSource, VIDEO_QUALITY_AUTO } from "./types";
import { videoPlayer } from "./variants";

let {
	src,
	hlsConfig,
	hls = $bindable(null),
	ref = $bindable(null),
	class: classProp,
	children,
	...rest
}: HTMLVideoAttributes & {
	/** Passed to hls.js when an `.m3u8` source starts; read once per source. */
	hlsConfig?: Partial<HlsConfig>;
	/** Bindable: the hls.js instance, or null when the source is not HLS. */
	hls?: Hls | null;
	ref?: HTMLVideoElement | null;
} = $props();

const player = getVideoPlayer();
// Svelte rejects a literal slot attribute outside a custom element in the same file; a spread still renders it.
const mediaSlot = { slot: "media" };
const hlsSrc = $derived(typeof src === "string" && isHlsSource(src) ? src : undefined);

$effect(() => {
	player.video = ref;
	return () => {
		player.video = null;
	};
});

$effect(() => {
	const element = ref;
	const source = hlsSrc;
	// Read so a retry re-runs this effect.
	player.attempt;
	if (!element || !source) return;
	let instance: Hls | null = null;
	let cancelled = false;
	// Safari plays HLS natively; everything with Media Source Extensions goes through hls.js.
	if (!("MediaSource" in window || "ManagedMediaSource" in window)) {
		element.src = source;
		return;
	}
	import("hls.js").then(({ default: HlsEngine }) => {
		if (cancelled) return;
		if (!HlsEngine.isSupported()) {
			element.src = source;
			return;
		}
		const engine = new HlsEngine(hlsConfig);
		instance = engine;
		let recovered = false;
		engine.on(HlsEngine.Events.MANIFEST_PARSED, () => {
			player.qualities = engine.levels.map((level, index) => ({
				index,
				height: level.height,
				bitrate: level.bitrate,
			}));
		});
		engine.on(HlsEngine.Events.LEVEL_SWITCHED, (_, data) =>
			player.setActiveQuality(data.level),
		);
		engine.on(HlsEngine.Events.ERROR, (_, data) => {
			if (!data.fatal) return;
			if (data.type === HlsEngine.ErrorTypes.MEDIA_ERROR && !recovered) {
				recovered = true;
				engine.recoverMediaError();
				return;
			}
			player.setError(
				data.type === HlsEngine.ErrorTypes.NETWORK_ERROR ? "network" : "decode",
			);
		});
		engine.loadSource(source);
		engine.attachMedia(element);
		hls = engine;
	});
	return () => {
		cancelled = true;
		instance?.destroy();
		hls = null;
		player.qualities = [];
		player.setActiveQuality(VIDEO_QUALITY_AUTO);
	};
});

$effect(() => {
	if (hls && hls.currentLevel !== player.quality) hls.currentLevel = player.quality;
});

$effect(() => {
	if (ref && !hlsSrc && player.attempt > 0) ref.load();
});
</script>

<video
	bind:this={ref}
	{...mediaSlot}
	data-slot="video-player-content"
	playsinline
	preload="metadata"
	src={hlsSrc ? undefined : src}
	class={cn(videoPlayer({ variant: player.variant }).content(), classProp)}
	{...rest}
>
	{@render children?.()}
</video>
