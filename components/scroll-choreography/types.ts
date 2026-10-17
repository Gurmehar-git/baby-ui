export interface ScrollChoreographyImage {
	src: string;
	alt: string;
}

export interface ScrollChoreographyImages {
	topLeft: ScrollChoreographyImage;
	topRight: ScrollChoreographyImage;
	bottomLeft: ScrollChoreographyImage;
	bottomRight: ScrollChoreographyImage;
}

/** Start offsets from centre in container units; `dy` is the diagonal swap distance. */
export const CHOREOGRAPHY_SLOTS = [
	{ key: "topLeft", x: -20, y: -14, dy: 28, z: 10 },
	{ key: "bottomRight", x: 20, y: 14, dy: -28, z: 20 },
	{ key: "bottomLeft", x: -20, y: 14, dy: 0, z: 30 },
	{ key: "topRight", x: 20, y: -14, dy: 0, z: 40 },
] as const;
