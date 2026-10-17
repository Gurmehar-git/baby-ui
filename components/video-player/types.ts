/** Seconds as m:ss (or h:mm:ss past an hour). */
export function formatVideoTime(seconds: number): string {
	const total = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
	const h = Math.floor(total / 3600);
	const m = Math.floor((total % 3600) / 60);
	const s = String(total % 60).padStart(2, "0");
	return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

export function clampVolume(value: number): number {
	return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

export type VideoPlayerVolumeLevel = "off" | "low" | "high";

export function volumeLevel(volume: number, muted: boolean): VideoPlayerVolumeLevel {
	if (muted || volume === 0) return "off";
	return volume < 0.5 ? "low" : "high";
}

/** A controlled `currentTime` further than this from the element's counts as a seek. */
export const VIDEO_SEEK_TOLERANCE = 0.5;

export const VIDEO_PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export function formatPlaybackRate(rate: number): string {
	return `${Number(rate.toFixed(2))}x`;
}

/** One HLS rendition; `index` is its position in the stream's level list. */
export type VideoPlayerRendition = { index: number; height: number; bitrate: number };

/** `-1` lets the stream pick a rendition from the measured bandwidth. */
export const VIDEO_QUALITY_AUTO = -1;

export function formatQuality(quality: VideoPlayerRendition | undefined): string {
	return quality ? `${quality.height}p` : "";
}

export function isHlsSource(src: string | undefined): boolean {
	return typeof src === "string" && /\.m3u8($|[?#])/i.test(src);
}

export type VideoPlayerErrorKind = "network" | "decode" | "source" | "unknown";

export const VIDEO_ERROR_MESSAGES: Record<VideoPlayerErrorKind, string> = {
	network: "The connection dropped while loading this video.",
	decode: "This video can't be played on this device.",
	source: "This video is unavailable right now.",
	unknown: "Playback stopped unexpectedly.",
};

/** Maps a `MediaError.code` to the kind shown in the error overlay. */
export function mediaErrorKind(code: number | undefined): VideoPlayerErrorKind {
	if (code === 2) return "network";
	if (code === 3) return "decode";
	if (code === 4) return "source";
	return "unknown";
}

/** When an end screen opens on its own: after the video ends, before first play, or whenever paused. */
export type VideoPlayerScreenTrigger = "ended" | "idle" | "paused";

export function screenOpen(
	when: VideoPlayerScreenTrigger,
	state: { playing: boolean; ended: boolean; started: boolean },
): boolean {
	if (when === "idle") return !state.started;
	if (when === "paused") return !state.playing;
	return state.ended && !state.playing;
}

/** Keys the page would scroll on; held back when they go to the player instead. */
export const VIDEO_HOTKEY_SCROLL_KEYS = [
	" ",
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"ArrowDown",
];

/** Whether a key pressed on a control outside the viewport belongs to the player's hotkeys. */
export function routesToHotkeys(event: KeyboardEvent, controller: Element): boolean {
	if (event.defaultPrevented || event.metaKey || event.altKey || event.ctrlKey)
		return false;
	const target = event.target;
	if (!(target instanceof HTMLElement) || controller.contains(target)) return false;
	if (/^(input|textarea|select)$/i.test(target.tagName) || target.isContentEditable)
		return false;
	const activates = event.key === " " || event.key === "Enter";
	if (activates && target.closest("button, a, [role=button], [role=radio]")) return false;
	const steps = event.key.startsWith("Arrow");
	return !(
		steps && target.closest("[role=slider], media-time-range, media-volume-range")
	);
}
