import { getContext, setContext } from "svelte";
import type { LiveFrame } from "./live";

export interface LiveContextValue {
	readonly frame: LiveFrame;
	/** Whether the scroll loop is running: false when paused and settled, offscreen or hidden. */
	readonly running: boolean;
	readonly paused: boolean;
	/** Ms between the live tip and the queued point the stroke fades into. */
	readonly queueMs: number;
	readonly formatTime: (ms: number) => string;
	readonly scrubbing: boolean;
}

const LIVE = Symbol("chart-live");

export function setLive(value: LiveContextValue) {
	setContext(LIVE, value);
}

export function useLive(): LiveContextValue {
	const context = getContext<LiveContextValue | undefined>(LIVE);
	if (!context)
		throw new Error("Live chart parts must be rendered inside <LiveLineChart />");
	return context;
}

const timeFormat = new Intl.DateTimeFormat(undefined, {
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
});

export const defaultFormatTime = (ms: number) => timeFormat.format(ms);
