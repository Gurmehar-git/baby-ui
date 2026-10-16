import { getContext, setContext } from "svelte";
import type { ScatterShape } from "./variants";

export interface ScatterRootValue {
	/** Series under the pointer; null when the keyboard selects a whole row. */
	readonly activeKey: string | null;
	shapeFor: (key: string) => ScatterShape;
	registerEnter: (id: string, el: SVGGElement, delay: number) => () => void;
}

const KEY = Symbol("scatter-root");

export function setScatterRoot(value: ScatterRootValue) {
	setContext(KEY, value);
}

export function useScatterRoot(): ScatterRootValue {
	return (
		getContext<ScatterRootValue | undefined>(KEY) ?? {
			activeKey: null,
			shapeFor: () => "circle",
			registerEnter: () => () => {},
		}
	);
}
