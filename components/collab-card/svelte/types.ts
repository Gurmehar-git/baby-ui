export type CollabCardCollaborator = {
	name: string;
	/** Tailwind background class for the name pill. */
	pill: string;
	/** Tailwind text class for the pill label. */
	pillText?: string;
	/** Tailwind text color class for the cursor (sets `color`, read by the SVG's `fill`). */
	cursor: string;
};
