import { getContext, setContext } from "svelte";
import type { Point, RadarMetric, RadarSeries } from "./geometry";
import type { RadarGridShape, RadarVariant } from "./variants";

export interface RadarContextValue {
	readonly data: RadarSeries[];
	readonly metrics: RadarMetric[];
	readonly radius: number;
	readonly levels: number;
	readonly max: number;
	readonly grid: RadarGridShape;
	readonly variant: RadarVariant;
	readonly animate: boolean;
	readonly center: Point;
	readonly frame: { width: number; height: number; el: HTMLDivElement | null };
	setActive: (index: number | null, fromKeyboard: boolean) => void;
}

const RADAR = Symbol("radar");

export function setRadar(value: RadarContextValue) {
	setContext(RADAR, value);
}

export function useRadar(): RadarContextValue {
	const context = getContext<RadarContextValue | undefined>(RADAR);
	if (!context) throw new Error("Radar parts must be rendered inside <RadarChart />");
	return context;
}
