import type { Snippet } from "svelte";
import { Spring, type SpringConfig } from "../../chart/svelte/motion";
import type { ChartMarkerBase } from "./geometry";

export interface ChartMarker extends ChartMarkerBase {
	icon?: Snippet;
	onclick?: () => void;
}

export const actionable = (marker: ChartMarker) => Boolean(marker.onclick || marker.href);

export function assign(el: HTMLElement | null, style: Partial<CSSStyleDeclaration>) {
	if (el) Object.assign(el.style, style);
}

/** A spring whose ticks call `apply`; stop it in the owning component's teardown. */
export const spring = (config: SpringConfig, apply: (value: number) => void) =>
	new Spring(0, config, apply);
