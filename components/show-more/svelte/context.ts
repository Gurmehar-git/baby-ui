import { getContext, setContext } from "svelte";

/** What ShowMore shares with its parts; read through getters so they stay reactive. */
export interface ShowMoreState {
	readonly lines: number;
	readonly label: string;
	readonly regionId: string;
	readonly open: boolean;
	readonly expandable: boolean;
	readonly scrollable: boolean;
	readonly height?: number;
	region?: HTMLDivElement;
	setMetrics(lineHeight: number, fullHeight: number): void;
	toggle(): void;
}

const KEY = Symbol("show-more");

export const setShowMore = (state: ShowMoreState) => setContext(KEY, state);
export function showMoreState(): ShowMoreState {
	const state = getContext<ShowMoreState | undefined>(KEY);
	if (!state) throw new Error("ShowMore parts must be rendered inside a ShowMore.");
	return state;
}
