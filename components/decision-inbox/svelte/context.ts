import { getContext, hasContext, setContext } from "svelte";
import type { decisionInbox } from "../variants";

export interface DecisionInboxState {
	readonly answers: Record<string, string>;
	readonly collapsed: string[];
	readonly items: string[];
	readonly styles: ReturnType<typeof decisionInbox>;
	answer(item: string, value: string): void;
	expand(item: string): void;
	register(item: string): () => void;
}

export interface DecisionInboxItemState {
	readonly value: string;
	readonly answer?: string;
	readonly collapsed: boolean;
}

const KEY = Symbol("decision-inbox");
const ITEM = Symbol("decision-inbox-item");

/** The root's state behind getters, so every part reads the latest value. */
export const setDecisionInbox = (state: DecisionInboxState) => setContext(KEY, state);
export function decisionInboxState(part: string): DecisionInboxState {
	if (!hasContext(KEY)) throw new Error(`${part} must be used inside <DecisionInbox>`);
	return getContext<DecisionInboxState>(KEY);
}

export const setDecisionInboxItem = (state: DecisionInboxItemState) =>
	setContext(ITEM, state);
export function decisionInboxItemState(part: string): DecisionInboxItemState {
	if (!hasContext(ITEM))
		throw new Error(`${part} must be used inside <DecisionInboxItem>`);
	return getContext<DecisionInboxItemState>(ITEM);
}
