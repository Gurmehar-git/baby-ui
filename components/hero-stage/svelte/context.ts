import { createContext } from "svelte";
import type { HeroStageMotion } from "./variants";

export const [getHeroStageMotion, setHeroStageMotion] =
	createContext<() => HeroStageMotion>();
