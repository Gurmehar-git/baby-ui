import { getContext, hasContext, setContext } from "svelte";
import type { ReactionBarVariant } from "../variants";

export interface ReactionBarState {
	readonly pressed: string[];
	readonly variant: ReactionBarVariant;
	readonly locale?: string;
	toggle(value: string): void;
}

export interface ReactionBarItemState {
	readonly pressed: boolean;
	readonly total: number;
}

const KEY = Symbol("reaction-bar");
const ITEM = Symbol("reaction-bar-item");

/** The root's state behind getters, so every part reads the latest value. */
export const setReactionBar = (state: ReactionBarState) => setContext(KEY, state);
export function reactionBarState(part: string): ReactionBarState {
	if (!hasContext(KEY)) throw new Error(`${part} must be used inside <ReactionBar>`);
	return getContext<ReactionBarState>(KEY);
}

export const setReactionBarItem = (state: ReactionBarItemState) =>
	setContext(ITEM, state);
export function reactionBarItemState(part: string): ReactionBarItemState {
	if (!hasContext(ITEM)) throw new Error(`${part} must be used inside <ReactionBarItem>`);
	return getContext<ReactionBarItemState>(ITEM);
}
