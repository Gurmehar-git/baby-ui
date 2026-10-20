/** `true` renders a check, `false` a cross, a string renders as text (e.g. "5 seats"). */
export type ComparisonValue = boolean | string;

export interface ComparisonPlan {
	id: string;
	name: string;
	highlighted?: boolean;
}

export interface ComparisonRow {
	feature: string;
	hint?: string;
	/** Keyed by plan id; a missing plan reads as not included. */
	values: Record<string, ComparisonValue | undefined>;
}

export interface ComparisonGroup {
	label: string;
	rows: ComparisonRow[];
}

export interface PricingComparisonLabels {
	caption: string;
	feature: string;
	included: string;
	notIncluded: string;
	differencesOnly: string;
	choosePlan: string;
	noDifferences: string;
}

export const PRICING_COMPARISON_LABELS: PricingComparisonLabels = {
	caption: "Plan comparison",
	feature: "Feature",
	included: "Included",
	notIncluded: "Not included",
	differencesOnly: "Show differences only",
	choosePlan: "Choose a plan",
	noDifferences: "Every listed feature is the same on these plans.",
};

export function comparisonValue(row: ComparisonRow, planId: string): ComparisonValue {
	return row.values[planId] ?? false;
}

export function rowDiffers(row: ComparisonRow, planIds: string[]): boolean {
	const [first, ...others] = planIds.map((planId) => comparisonValue(row, planId));
	return others.some((value) => value !== first);
}

export function groupDiffers(group: ComparisonGroup, planIds: string[]): boolean {
	return group.rows.some((row) => rowDiffers(row, planIds));
}

/** Text a screen reader hears for a cell. */
export function comparisonValueText(
	value: ComparisonValue,
	labels: Pick<PricingComparisonLabels, "included" | "notIncluded">,
): string {
	if (value === true) return labels.included;
	if (value === false) return labels.notIncluded;
	return value;
}
