import type { Snippet } from "svelte";
import type { ButtonVariant } from "../../button/variants";

export type RecommendationOption = {
	key: string;
	body: Snippet;
	short: string;
	/** 0-3 confidence bars filled. */
	signal: number;
	/** CSS colour for the filled bars, e.g. `"var(--success)"`. */
	tone: string;
	label: string;
	cta: string;
	ctaVariant: ButtonVariant;
};

export type RecommendationLabels = {
	alternatives: string;
	otherOptions: string;
	accepted: string;
};
