export interface OrbitHeroAction {
	label: string;
	/** Renders a link; otherwise a button calling `onClick`. */
	href?: string;
	/** Link target; `_blank` also sets `rel="noopener noreferrer"`. */
	target?: "_blank" | "_self";
	onClick?: () => void;
}

/** One set of items for the two rings; the centre's top half cycles through groups. */
export interface OrbitHeroGroup<T> {
	label: string;
	/** Shown in the readout; defaults to the number of items in both rings. */
	count?: number;
	outer: T[];
	inner: T[];
}

/** A colour the items take; the centre's bottom half cycles through tones. */
export interface OrbitHeroTone {
	label: string;
	/** Any CSS colour, e.g. `var(--chart-2)`. */
	color: string;
}

export interface OrbitHeroLabels {
	/** Accessible name prefix for the group button; the current group follows. */
	group: string;
	tone: string;
}
