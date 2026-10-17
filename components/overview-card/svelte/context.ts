import { getContext, setContext } from "svelte";
import type { ChartStatus, Datum } from "../../chart/core";
import type { OverviewCardChartKind, overviewCard } from "../variants";

/** What OverviewCard shares with its parts; read through getters so they stay reactive. */
export interface OverviewCardState {
	readonly name: string;
	readonly data: Datum[];
	readonly dataKey: string;
	readonly xKey: string;
	readonly value: number;
	readonly label: string;
	readonly trend: number;
	readonly chart: OverviewCardChartKind;
	readonly color: string;
	readonly locale?: string;
	readonly status: ChartStatus;
	readonly activeIndex: number | null;
	readonly number: (value: number) => string;
	readonly formatLabel: (date: Date) => string;
	readonly styles: ReturnType<typeof overviewCard>;
	setActive(index: number | null): void;
}

const KEY = Symbol("overview-card");

export const setOverviewCard = (state: OverviewCardState) => setContext(KEY, state);
export function overviewCardState(): OverviewCardState {
	const state = getContext<OverviewCardState | undefined>(KEY);
	if (!state)
		throw new Error("OverviewCard parts must be rendered inside an OverviewCard.");
	return state;
}
