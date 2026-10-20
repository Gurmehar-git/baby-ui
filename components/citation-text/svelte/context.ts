import { getContext, hasContext, setContext } from "svelte";
import type { CitationSegment, numberCitations } from "../citation-core";
import type { CitationChip, citationText } from "../variants";

export type CitationActive = { segment: number | null; source: string | null };

export type CitationTextState = {
	segments: CitationSegment[];
	numbered: ReturnType<typeof numberCitations>;
	chip: CitationChip;
	active: CitationActive;
	activate: (segment: number | null, source: string | null) => void;
	styles: ReturnType<typeof citationText>;
};

const KEY = Symbol("citation-text");

/** The root's state behind getters, so every part reads the latest value. */
export const setCitationText = (state: CitationTextState) => setContext(KEY, state);
export function citationTextState(part: string): CitationTextState {
	if (!hasContext(KEY)) throw new Error(`${part} must be used inside <CitationText>`);
	return getContext<CitationTextState>(KEY);
}
