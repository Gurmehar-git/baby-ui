import { getContext, setContext } from "svelte";
import type { scoreCard } from "../variants";

/** What ScoreCard shares with its parts; a getter so it stays reactive. */
export interface ScoreCardState {
	readonly styles: ReturnType<typeof scoreCard>;
}

const KEY = Symbol("score-card");

export const setScoreCard = (state: ScoreCardState) => setContext(KEY, state);
export function scoreCardState(): ScoreCardState {
	const state = getContext<ScoreCardState | undefined>(KEY);
	if (!state) throw new Error("ScoreCard parts must be rendered inside a ScoreCard.");
	return state;
}
