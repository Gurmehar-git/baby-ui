import { createContext } from "svelte";
import type { SwipeGroup } from "./swipe";
import type { SwipeActionsSize } from "./variants";

export type SwipeListContext = {
	readonly group: SwipeGroup | null;
	readonly size: SwipeActionsSize;
};

export const [getSwipeList, setSwipeList] = createContext<SwipeListContext>();
