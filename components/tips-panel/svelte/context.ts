import { getContext, hasContext, setContext } from "svelte";
import type { tipsPanel } from "../variants";

export interface TipsPanelState {
	readonly titleId: string;
	readonly done: string[];
	readonly tips: string[];
	readonly styles: ReturnType<typeof tipsPanel>;
	markDone(tip: string): void;
	register(tip: string): () => void;
}

const KEY = Symbol("tips-panel");
const TIP = Symbol("tips-panel-tip");

/** The root's state behind getters, so every part reads the latest value. */
export const setTipsPanel = (state: TipsPanelState) => setContext(KEY, state);
export function tipsPanelState(part: string): TipsPanelState {
	if (!hasContext(KEY)) throw new Error(`${part} must be used inside <TipsPanel>`);
	return getContext<TipsPanelState>(KEY);
}

export const setTip = (tip: { readonly value: string }) => setContext(TIP, tip);
export function tipState(part: string): { readonly value: string } {
	if (!hasContext(TIP)) throw new Error(`${part} must be used inside <TipsPanelTip>`);
	return getContext<{ readonly value: string }>(TIP);
}
