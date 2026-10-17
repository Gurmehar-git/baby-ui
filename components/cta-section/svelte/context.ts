import { getContext, setContext } from "svelte";
import type { CtaSectionVariant, ctaSection } from "../variants";

/** What CtaSection shares with its parts; read through getters so they stay reactive. */
export interface CtaSectionState {
	readonly variant: CtaSectionVariant;
	readonly titleId: string;
	readonly styles: ReturnType<typeof ctaSection>;
	close(): void;
}

const KEY = Symbol("cta-section");

export const setCtaSection = (state: CtaSectionState) => setContext(KEY, state);
export function ctaSectionState(): CtaSectionState {
	const state = getContext<CtaSectionState | undefined>(KEY);
	if (!state) throw new Error("CtaSection parts must be rendered inside a CtaSection.");
	return state;
}
