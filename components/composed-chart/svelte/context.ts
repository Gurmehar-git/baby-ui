import { getContext, setContext } from "svelte";

export interface BarLayoutValue {
	readonly keys: string[];
	register: (key: string) => () => void;
	readonly size: number | undefined;
	readonly maxSize: number | undefined;
	readonly gap: number;
	readonly stacked: boolean;
}

const LAYOUT = Symbol("chart-bar-layout");

export function setBarLayout(value: BarLayoutValue) {
	setContext(LAYOUT, value);
}

export function useBarLayout(): BarLayoutValue {
	return (
		getContext<BarLayoutValue | undefined>(LAYOUT) ?? {
			keys: [],
			register: () => () => {},
			size: undefined,
			maxSize: undefined,
			gap: 4,
			stacked: false,
		}
	);
}
