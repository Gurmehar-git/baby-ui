import { getContext, setContext } from "svelte";
import type { gradientHero01 } from "../variants";

/** What GradientHero01 shares with its parts; a getter so it stays reactive. */
export interface GradientHero01State {
	readonly styles: ReturnType<typeof gradientHero01>;
}

const KEY = Symbol("gradient-hero-01");

export const setGradientHero01 = (state: GradientHero01State) => setContext(KEY, state);
export function gradientHero01State(): GradientHero01State {
	const state = getContext<GradientHero01State | undefined>(KEY);
	if (!state)
		throw new Error("GradientHero01 parts must be rendered inside a GradientHero01.");
	return state;
}
