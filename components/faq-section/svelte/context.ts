import { getContext, setContext } from "svelte";
import type { FaqItem } from "../faq";
import type { FaqSectionVariant, faqSection } from "../variants";

/** What FaqSection shares with its parts; read through getters so they stay reactive. */
export interface FaqSectionState {
	readonly items: FaqItem[];
	readonly variant: FaqSectionVariant;
	readonly type: "single" | "multiple";
	readonly titleId: string;
	readonly categories: string[];
	readonly open: string[];
	readonly topic: string;
	readonly text: string;
	readonly shown: FaqItem[];
	readonly styles: ReturnType<typeof faqSection>;
	setOpen(next: string | string[]): void;
	setTopic(next: string | string[]): void;
	setText(next: string): void;
}

const KEY = Symbol("faq-section");

export const setFaqSection = (state: FaqSectionState) => setContext(KEY, state);
export function faqSectionState(): FaqSectionState {
	const state = getContext<FaqSectionState | undefined>(KEY);
	if (!state) throw new Error("FaqSection parts must be rendered inside a FaqSection.");
	return state;
}
