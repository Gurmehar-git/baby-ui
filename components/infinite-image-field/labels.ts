import type { InfiniteImageFieldVariant } from "./variants";

/** Every visible or announced string, overridable for other languages. */
export type InfiniteImageFieldLabels = { label: string; hint: string; loading: string };

const SHARED = { hint: "Drag to explore", loading: "Loading gallery" };

export const INFINITE_IMAGE_FIELD_LABELS: Record<
	InfiniteImageFieldVariant,
	InfiniteImageFieldLabels
> = {
	drift: {
		...SHARED,
		label: "Image field. Point away from the centre, or hold the arrow keys, to drift.",
	},
	fisheye: {
		...SHARED,
		label: "Image grid. Drag, or use the arrow keys, to explore. Home recentres.",
	},
	gallery: { ...SHARED, label: "Gallery. Drag, or use the arrow keys, to explore." },
};
