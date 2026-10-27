import { createContext } from "svelte";
import type { TimelineOrientation, TimelineScaleVariant } from "../variants";

export type TimelineScaleEntry = {
	id: string;
	label: string;
	description?: string;
	element: HTMLButtonElement;
};

export type TimelineScaleContext = {
	readonly orientation: TimelineOrientation;
	readonly variant: TimelineScaleVariant;
	readonly active: string | undefined;
	readonly entries: TimelineScaleEntry[];
	register: (entry: TimelineScaleEntry) => () => void;
	select: (id: string, focus?: boolean) => void;
	move: (event: KeyboardEvent, id: string) => void;
	syncViewport: (viewport: HTMLElement) => void;
	release: () => void;
};

export const [getTimelineScale, setTimelineScale] = createContext<TimelineScaleContext>();
