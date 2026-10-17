export interface CaseStudyFlipItem {
	eyebrow: string;
	title: string;
	description: string;
	image: string;
	imageAlt: string;
	/** Defaults to the 1-based position, zero padded. */
	number?: string;
}

/** Per-card offsets: how far each card sits in the pile before its turn, and after it flies off. */
export function flipCardOffsets(index: number, total: number) {
	return {
		stack: index * Math.min(24, 72 / Math.max(total - 1, 1)),
		restY: Math.min(index * 12, 34),
		restS: 1 - Math.min(index * 0.012, 0.035),
	};
}

/** The card facing the reader at `progress` (0 to 1). */
export function activeFlipCard(progress: number, total: number) {
	return Math.max(0, Math.min(total - 1, Math.floor(progress * total + 0.001)));
}
