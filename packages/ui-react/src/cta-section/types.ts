export interface CtaAction {
	label: string;
	/** Renders a link. */
	href?: string;
	onClick?: () => void;
}
