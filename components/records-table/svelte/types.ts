import type { RecordStrength } from "./variants";

export type { RecordStrength };

export type RecordSortKey = "name" | "last" | "strength";
export type RecordSort = { key: RecordSortKey; dir: 1 | -1 };
export type RecordsToolKind = "model" | "web" | "user";
export type ColumnKey = "company" | "categories" | "last" | "strength" | "links" | "ai";

export type RecordsColumnType =
	| "Text"
	| "File"
	| "Collection"
	| "Single select"
	| "Multi select"
	| "URL"
	| "Reference"
	| "JSON"
	| "File splitter"
	| "Date";

export type RecordsPrompt = { before: string; chip?: string; after?: string };

export type RecordsColumnMeta = {
	type: RecordsColumnType;
	tool: string;
	toolKind: RecordsToolKind;
	inputs?: string;
	prompt?: RecordsPrompt;
};

export type RecordsColumnSettings = {
	grounding: boolean;
	required: boolean;
	allowEmpty: boolean;
	confidence: boolean;
};

/** One column's overrides; `inputs` lists the column labels it reads from. */
export type RecordsColumnConfig = Partial<
	Omit<RecordsColumnMeta, "inputs"> & RecordsColumnSettings & { inputs: string[] }
>;

export type RecordsTableConfig = Partial<Record<ColumnKey, RecordsColumnConfig>>;

/** A column's defaults merged with the caller's config. */
export type ResolvedColumn = Omit<RecordsColumnMeta, "inputs"> &
	RecordsColumnSettings & { inputs: string[] };

export type RecordRow = {
	id: string;
	name: string;
	tags: string[];
	last: string;
	strength: RecordStrength;
	website?: string;
	/** Company logo URL; the name's first letter shows while it loads or if it fails. */
	logo?: string;
	/** Real, caller-supplied resolved value for the AI column; shown once "Go calculate" finishes. */
	aiValue?: string;
};

export type RecordsTableLabels = {
	company: string;
	categories: string;
	last: string;
	strength: string;
	links: string;
	ai: string;
	strengthStrong: string;
	strengthWeak: string;
	strengthVeryWeak: string;
	strengthNone: string;
	calculating: string;
	empty: string;
	newProperty: string;
	tableOptions: string;
	addProperty: string;
	compactColumns: string;
	resetWidths: string;
	clearSelection: string;
	selectAll: string;
	selectRow: (name: string) => string;
	sortBy: (column: string) => string;
	resize: (column: string) => string;
	configure: (column: string) => string;
	count: (n: number) => string;
	average: (percent: number) => string;
	linkCount: (n: number) => string;
	filled: (n: number) => string;
	type: string;
	tool: string;
	grounding: string;
	groundingHelp: string;
	aboutGrounding: string;
	inputs: string;
	selectInputs: string;
	useValuesFrom: string;
	calculate: string;
	pin: string;
	unpin: string;
	moreSettings: string;
	hide: string;
	behavior: string;
	required: string;
	allowEmpty: string;
	confidence: string;
};

export type Glyph =
	| { kind: "path"; d: string }
	| { kind: "circle"; cx: number; cy: number; r: number }
	| { kind: "ellipse"; cx: number; cy: number; rx: number; ry: number }
	| { kind: "rect"; x: number; y: number; width: number; height: number; rx?: number };
