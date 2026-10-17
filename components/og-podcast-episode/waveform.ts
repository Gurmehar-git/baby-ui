/** Default bar heights (0 to 1) for the decorative waveform when no `peaks` are passed. */
export const OG_PODCAST_WAVE: number[] = Array.from(
	{ length: 40 },
	(_, i) =>
		Math.round((0.22 + 0.78 * Math.abs(Math.sin(i * 0.61) * Math.cos(i * 0.19))) * 100) /
		100,
);

/** Clamps each peak to 0..1 and maps it to a bar height in px. */
export function waveBarHeights(peaks: number[], max = 72, min = 10): number[] {
	return peaks.map((p) => Math.round(min + Math.min(1, Math.max(0, p)) * (max - min)));
}
