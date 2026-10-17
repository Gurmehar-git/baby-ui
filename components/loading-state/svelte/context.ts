import { getContext, setContext } from "svelte";
import type { LoadingStateVariant, loadingState } from "../variants";

/** What LoadingState shares with its parts; read through getters so they stay reactive. */
export interface LoadingStateState {
	readonly variant: LoadingStateVariant;
	readonly styles: ReturnType<typeof loadingState>;
}

const KEY = Symbol("loading-state");

export const setLoadingState = (state: LoadingStateState) => setContext(KEY, state);
export function loadingStateState(): LoadingStateState {
	const state = getContext<LoadingStateState | undefined>(KEY);
	if (!state)
		throw new Error("LoadingState parts must be rendered inside a LoadingState.");
	return state;
}
