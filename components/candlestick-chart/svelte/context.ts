import { getContext, setContext } from "svelte";

export interface CandleRootValue {
	advance: (event: "done") => void;
}

export interface CandlestickLabels {
	open: string;
	high: string;
	low: string;
	close: string;
}

export const DEFAULT_LABELS: CandlestickLabels = {
	open: "Open",
	high: "High",
	low: "Low",
	close: "Close",
};

const KEY = Symbol("candlestick-root");

export function setCandleRoot(value: CandleRootValue) {
	setContext(KEY, value);
}

export function useCandleRoot(): CandleRootValue {
	return getContext<CandleRootValue | undefined>(KEY) ?? { advance: () => {} };
}
