export interface Pricing02Period {
	value: string;
	label: string;
	/** Shown after the price, e.g. "/ month". */
	cadence: string;
}

/** The last two characters trail the rest by 70ms each, like an odometer settling. */
export function digitDelay(index: number, length: number): string {
	return `${Math.max(0, index - (length - 3)) * 70}ms`;
}
