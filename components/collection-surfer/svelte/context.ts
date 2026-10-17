import { getContext, setContext } from "svelte";
import type { CollectionSurferItem } from "../types";
import type { collectionSurfer } from "../variants";

/** What CollectionSurfer shares with its parts; read through getters so they stay reactive. */
export interface CollectionSurferState {
	readonly items: CollectionSurferItem[];
	readonly styles: ReturnType<typeof collectionSurfer>;
}

const KEY = Symbol("collection-surfer");

export const setCollectionSurfer = (state: CollectionSurferState) =>
	setContext(KEY, state);
export function collectionSurferState(): CollectionSurferState {
	const state = getContext<CollectionSurferState | undefined>(KEY);
	if (!state)
		throw new Error("CollectionSurfer parts must be rendered inside a CollectionSurfer.");
	return state;
}
