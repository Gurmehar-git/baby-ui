/** One message in the thread. Assistant messages may carry an author and a short meta line. */
export type ChatMessage = {
	id: string;
	role: "user" | "assistant";
	body: string;
	/** Assistant name shown above the body, e.g. "Weather Agent". */
	author?: string;
	/** Muted detail after the author, e.g. "for 2 min". */
	meta?: string;
};

/** One switchable thread; the header toggles are these topics. */
export type ChatTopic = { key: string; label: string };

/** `streaming` dims the newest assistant message and holds the send button. */
export type ChatStatus = "idle" | "streaming";

export type ChatComposerLabels = {
	placeholder: string;
	prompt: string;
	send: string;
	topics: string;
	newConversation: string;
	history: string;
	recentPrompts: string;
	noHistory: string;
	more: string;
	copy: string;
	copied: string;
	copyFailed: string;
};

export const CHAT_COMPOSER_LABELS: ChatComposerLabels = {
	placeholder: "Send a message…",
	prompt: "Chat prompt",
	send: "Send",
	topics: "Topics",
	newConversation: "New conversation",
	history: "Prompt history",
	recentPrompts: "Recent prompts",
	noHistory: "Nothing sent yet",
	more: "More actions",
	copy: "Copy conversation",
	copied: "Copied",
	copyFailed: "Couldn't copy",
};

/** Newest-first unique user prompts, for the history menu. */
export function promptHistory(messages: ChatMessage[], limit = 8): string[] {
	const seen = new Set<string>();
	const out: string[] = [];
	for (let i = messages.length - 1; i >= 0 && out.length < limit; i--) {
		const m = messages[i];
		if (m?.role !== "user" || seen.has(m.body)) continue;
		seen.add(m.body);
		out.push(m.body);
	}
	return out;
}

/** Index of the assistant message that is still resolving while streaming, else -1. */
export function resolvingIndex(messages: ChatMessage[], status: ChatStatus): number {
	if (status !== "streaming") return -1;
	const last = messages.length - 1;
	return messages[last]?.role === "assistant" ? last : -1;
}
