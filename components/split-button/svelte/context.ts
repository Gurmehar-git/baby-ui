import { getContext, setContext } from "svelte";
import type { SplitButtonSize, SplitButtonVariant, splitButton } from "../variants";

/** What SplitButton shares with its parts; read through getters so they stay reactive. */
export interface SplitButtonState {
	readonly variant: SplitButtonVariant;
	readonly size: SplitButtonSize;
	readonly disabled: boolean;
	readonly styles: ReturnType<typeof splitButton>;
}

const KEY = Symbol("split-button");

export const setSplitButton = (state: SplitButtonState) => setContext(KEY, state);
export function splitButtonState(): SplitButtonState {
	const state = getContext<SplitButtonState | undefined>(KEY);
	if (!state) throw new Error("SplitButton parts must be rendered inside a SplitButton.");
	return state;
}
