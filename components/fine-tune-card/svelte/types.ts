import type { PropertySchema } from "../../property-panel/svelte/schema";

/** A tunable number; its `key` doubles as the row label ("cornerRadius" reads "Corner radius"). */
export type FineTuneField = {
	key: string;
	value: number;
	min: number;
	max: number;
	step?: number;
};

export type FineTuneCardLabels = {
	title?: string;
	adjust?: string;
	edited?: string;
};

export type FineTuneState = {
	layout: string;
	values: Record<string, number>;
	type: string;
};

export const FINE_TUNE_LAYOUTS = ["row", "column", "grid"] as const;

export function fineTuneInitial(fields: FineTuneField[]): FineTuneState {
	return {
		layout: FINE_TUNE_LAYOUTS[0],
		values: Object.fromEntries(fields.map((f) => [f.key, f.value])),
		type: "",
	};
}

// `type` marks a control inside a schema, so the Type select lives under `variant`.
export function fineTuneSchema(
	fields: FineTuneField[],
	options: string[],
): PropertySchema {
	return {
		layout: { type: "segmented" as const, options: FINE_TUNE_LAYOUTS },
		...Object.fromEntries(
			fields.map((f) => [f.key, [f.value, f.min, f.max, f.step ?? 1] as const]),
		),
		...(options.length ? { variant: { type: "select" as const, options } } : {}),
	};
}
