export interface GradientHero01Action {
	label: string;
	/** Renders a link; otherwise a button calling `onClick`. */
	href?: string;
	onClick?: () => void;
}
