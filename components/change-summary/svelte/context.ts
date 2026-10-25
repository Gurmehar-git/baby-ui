import { getContext, hasContext, setContext } from "svelte";
import type {
	ChangeSummaryDirection,
	ChangeSummaryTone,
	changeSummary,
} from "../variants";

export interface ChangeSummaryState {
	readonly titleId: string;
	readonly styles: ReturnType<typeof changeSummary>;
}

export interface ChangeSummaryTrend {
	readonly tone: ChangeSummaryTone;
	readonly direction: ChangeSummaryDirection;
}

const KEY = Symbol("change-summary");
const ITEM = Symbol("change-summary-item");

/** The root's state behind getters, so every part reads the latest value. */
export const setChangeSummary = (state: ChangeSummaryState) => setContext(KEY, state);
export function changeSummaryState(part: string): ChangeSummaryState {
	if (!hasContext(KEY)) throw new Error(`${part} must be used inside <ChangeSummary>`);
	return getContext<ChangeSummaryState>(KEY);
}

export const setChangeSummaryTrend = (trend: ChangeSummaryTrend) =>
	setContext(ITEM, trend);
export function changeSummaryTrendState(): ChangeSummaryTrend {
	return hasContext(ITEM)
		? getContext<ChangeSummaryTrend>(ITEM)
		: { tone: "neutral", direction: "up" };
}
