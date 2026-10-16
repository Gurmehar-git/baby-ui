import type { ContextChunkTone } from "./variants";

export type { ContextChunkTone } from "./variants";

export type ContextChunk = {
	title: string;
	chars: string;
	body: string;
	source: string;
	badge: string;
	tone: ContextChunkTone;
};
