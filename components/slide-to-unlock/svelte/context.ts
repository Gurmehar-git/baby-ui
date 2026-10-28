import { createContext } from "svelte";
import type { SlideToUnlockSize, SlideToUnlockVariant } from "../variants";

export type SlideToUnlockContext = {
	readonly value: number;
	readonly variant: SlideToUnlockVariant;
	readonly size: SlideToUnlockSize;
	readonly label: string;
	readonly loading: boolean;
	readonly handle: string | undefined;
};

export const [getSlideToUnlock, setSlideToUnlock] = createContext<SlideToUnlockContext>();
