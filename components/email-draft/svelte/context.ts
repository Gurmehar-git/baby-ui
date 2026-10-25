import { getContext, hasContext, setContext } from "svelte";
import type { EmailDraftStatus, emailDraft } from "../variants";

export interface EmailDraftContext {
	readonly status: EmailDraftStatus;
	readonly editing: boolean;
	readonly styles: ReturnType<typeof emailDraft>;
	/** Where focus goes once the status flips, so it never falls to the page. */
	readonly pendingFocus: { current: "receipt" | "send" | null };
	setEditing(editing: boolean): void;
	send(): void;
	discard(): void;
	undo(): void;
}

const KEY = Symbol("email-draft");

/** The root's state behind getters, so every part reads the latest value. */
export const setEmailDraft = (state: EmailDraftContext) => setContext(KEY, state);
export function emailDraftState(part: string): EmailDraftContext {
	if (!hasContext(KEY)) throw new Error(`${part} must be used inside <EmailDraft>`);
	return getContext<EmailDraftContext>(KEY);
}

export const isFolded = (status: EmailDraftStatus) =>
	status === "sent" || status === "discarded";
