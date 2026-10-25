import { getContext, hasContext, setContext } from "svelte";
import type { wallHero } from "../variants";

export interface WallHeroContext {
	readonly styles: ReturnType<typeof wallHero>;
}

const KEY = Symbol("wall-hero");

/** The root's state behind getters, so every part reads the latest value. */
export const setWallHero = (state: WallHeroContext) => setContext(KEY, state);
export function wallHeroState(part: string): WallHeroContext {
	if (!hasContext(KEY)) throw new Error(`${part} must be used inside <WallHero>`);
	return getContext<WallHeroContext>(KEY);
}
