import { getContext, hasContext, setContext } from "svelte";
import type { SwappableVariant } from "./variants";

type Shared = { variant: SwappableVariant; hintId: string };

const SHARED = Symbol("swappable");
export const setSwappable = (get: () => Shared) => setContext(SHARED, get);
/** The root's variant and hint id, read lazily so changes reach every item. */
export const getSwappable = (): Shared =>
	hasContext(SHARED)
		? getContext<() => Shared>(SHARED)()
		: { variant: "card", hintId: "" };
