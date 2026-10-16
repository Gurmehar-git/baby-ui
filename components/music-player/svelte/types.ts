export type MusicPlayerLabels = {
	play: string;
	pause: string;
	previous: string;
	next: string;
	seek: string;
	volume: string;
	mute: string;
	unmute: string;
};

export const MUSIC_PLAYER_LABELS: MusicPlayerLabels = {
	play: "Play",
	pause: "Pause",
	previous: "Previous track",
	next: "Next track",
	seek: "Seek",
	volume: "Volume",
	mute: "Mute",
	unmute: "Unmute",
};

/** Seconds as m:ss (or h:mm:ss past an hour). */
export function formatTime(seconds: number): string {
	const total = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
	const h = Math.floor(total / 3600);
	const m = Math.floor((total % 3600) / 60);
	const s = String(total % 60).padStart(2, "0");
	return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

export function clampUnit(value: number): number {
	return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

/** Audio drift beyond this many seconds from `position` counts as a seek. */
export const SEEK_TOLERANCE = 0.75;
