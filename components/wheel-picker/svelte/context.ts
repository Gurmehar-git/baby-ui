import { getContext, setContext } from "svelte";
import type { WheelPickerRows } from "./variants";

export type WheelContext = { itemHeight: number; rows: WheelPickerRows; lens: boolean };

const KEY = Symbol("wheel-picker");

export function setWheelContext(value: WheelContext) {
	setContext(KEY, value);
}

export function useWheel(): WheelContext {
	return (
		getContext<WheelContext | undefined>(KEY) ?? { itemHeight: 44, rows: "5", lens: true }
	);
}
