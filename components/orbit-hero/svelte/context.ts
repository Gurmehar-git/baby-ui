import { getContext, setContext } from "svelte";
import type { orbitHero } from "../variants";

/** What OrbitHero shares with its copy parts; a getter so it stays reactive. */
export interface OrbitHeroState {
	readonly styles: ReturnType<typeof orbitHero>;
}

const KEY = Symbol("orbit-hero");

export const setOrbitHero = (state: OrbitHeroState) => setContext(KEY, state);
export function orbitHeroState(): OrbitHeroState {
	const state = getContext<OrbitHeroState | undefined>(KEY);
	if (!state) throw new Error("OrbitHero parts must be rendered inside an OrbitHero.");
	return state;
}
