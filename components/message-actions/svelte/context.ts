import { getContext, hasContext, setContext } from "svelte";
import type { MessageFeedback, messageActions } from "../variants";

export interface MessageActionsState {
	readonly feedback: MessageFeedback | null;
	readonly styles: ReturnType<typeof messageActions>;
	setFeedback(next: MessageFeedback | null): void;
	announce(message: string): void;
}

const KEY = Symbol("message-actions");

/** The root's state behind getters, so every part reads the latest value. */
export const setMessageActions = (state: MessageActionsState) => setContext(KEY, state);
export function messageActionsState(part: string): MessageActionsState {
	if (!hasContext(KEY)) throw new Error(`${part} must be used inside <MessageActions>`);
	return getContext<MessageActionsState>(KEY);
}
