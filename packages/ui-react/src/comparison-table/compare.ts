/** `true` is included, `false` is not, "partial" is limited, any other string prints as text. */
export type ComparisonValue =
	| boolean
	| string
	| { value: boolean | string; note?: string };

export type ComparisonBilling = "monthly" | "yearly";

export interface ComparisonColumn {
	id: string;
	name: string;
	/** A short line under the name. */
	caption?: string;
	/** Per seat per month; with both periods a billing switch appears. */
	price?: number | { monthly: number; yearly: number };
	/** Your plan or product: tinted, and kept beside the row labels when scrolling sideways. */
	highlight?: boolean;
	/** A button under the column header. */
	action?: { label: string; href?: string; onClick?: () => void };
}

export interface ComparisonRow {
	id: string;
	feature: string;
	/** Secondary text under the feature name. */
	hint?: string;
	values: Record<string, ComparisonValue>;
}

export interface ComparisonSection {
	id: string;
	title?: string;
	rows: ComparisonRow[];
}

export function comparisonCell(value: ComparisonValue | undefined) {
	if (value === undefined) return { value: false, note: undefined };
	if (typeof value === "object") return value;
	return { value, note: undefined };
}

/** Whether every column reads the same, so "differences only" can fold the row away. */
export function rowIsShared(row: ComparisonRow, columns: ComparisonColumn[]) {
	const keys = columns.map((column) =>
		String(comparisonCell(row.values[column.id]).value),
	);
	return keys.every((key) => key === keys[0]);
}

export function columnPrice(column: ComparisonColumn, billing: ComparisonBilling) {
	if (column.price === undefined) return undefined;
	return typeof column.price === "number" ? column.price : column.price[billing];
}

export const hasBilling = (columns: ComparisonColumn[]) =>
	columns.some((column) => typeof column.price === "object");
