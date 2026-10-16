import { createContext } from "svelte";

export type ConversationContext = {
	follow: boolean;
	atBottom: boolean;
	readonly threshold: number;
	viewport: HTMLDivElement | null;
	scrollingToBottom: boolean;
	scrollToBottom(behavior?: ScrollBehavior): void;
};

export const [getConversation, setConversation] = createContext<ConversationContext>();
