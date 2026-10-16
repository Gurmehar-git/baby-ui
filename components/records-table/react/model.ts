import type {
	ColumnKey,
	Glyph,
	RecordRow,
	RecordSort,
	RecordsColumnConfig,
	RecordsColumnMeta,
	RecordsColumnSettings,
	RecordsColumnType,
	RecordsTableConfig,
	RecordsTableLabels,
	ResolvedColumn,
} from "./types";
import type { RecordsDensity } from "./variants";

export const COLUMN_ORDER: ColumnKey[] = [
	"company",
	"categories",
	"last",
	"strength",
	"links",
	"ai",
];
export const INPUT_COLUMNS: ColumnKey[] = [
	"company",
	"categories",
	"last",
	"strength",
	"links",
];
export const ACTIONS_WIDTH = 56;

export const COLUMN_WIDTHS: Record<RecordsDensity, Record<ColumnKey, number>> = {
	comfortable: {
		company: 270,
		categories: 275,
		last: 190,
		strength: 210,
		links: 175,
		ai: 240,
	},
	compact: {
		company: 220,
		categories: 220,
		last: 155,
		strength: 180,
		links: 160,
		ai: 200,
	},
};

export const NEW_PROPERTY_TYPES: RecordsColumnType[] = [
	"Text",
	"File",
	"Collection",
	"Single select",
	"Multi select",
	"URL",
	"Reference",
	"JSON",
	"File splitter",
];

export const RECORDS_TABLE_LABELS: RecordsTableLabels = {
	company: "Company",
	categories: "Categories",
	last: "Last interaction",
	strength: "Connection strength",
	links: "Links",
	ai: "AI column",
	strengthStrong: "Very strong",
	strengthWeak: "Weak",
	strengthVeryWeak: "Very weak",
	strengthNone: "No communication",
	calculating: "Calculating",
	empty: "-",
	newProperty: "New property",
	tableOptions: "Table options",
	addProperty: "Add property",
	compactColumns: "Compact columns",
	resetWidths: "Reset column widths",
	clearSelection: "Clear selection",
	selectAll: "Select all rows",
	selectRow: (name) => `Select ${name}`,
	sortBy: (column) => `Sort by ${column}`,
	resize: (column) => `Resize ${column} column`,
	configure: (column) => `Configure ${column}`,
	count: (n) => `${n} count`,
	average: (percent) => `${percent}% average`,
	linkCount: (n) => `${n} links`,
	filled: (n) => `${n} filled`,
	type: "Type",
	tool: "Tool",
	grounding: "Grounding",
	groundingHelp:
		"Grounding lets the model verify generated values against connected sources.",
	aboutGrounding: "About grounding",
	inputs: "Inputs",
	selectInputs: "Select inputs",
	useValuesFrom: "Use values from",
	calculate: "Go calculate",
	pin: "Pin",
	unpin: "Unpin",
	moreSettings: "More settings",
	hide: "Hide from view",
	behavior: "Behavior",
	required: "Required value",
	allowEmpty: "Allow empty results",
	confidence: "Show confidence",
};

const DEFAULT_META: Record<ColumnKey, RecordsColumnMeta> = {
	company: { type: "Text", tool: "User input", toolKind: "user" },
	categories: {
		type: "Multi select",
		tool: "User input",
		toolKind: "user",
		inputs: "company",
		prompt: {
			before: "Tag each ",
			chip: "company",
			after: " with its market categories.",
		},
	},
	last: { type: "Date", tool: "User input", toolKind: "user" },
	strength: {
		type: "Single select",
		tool: "User input",
		toolKind: "user",
		inputs: "last",
		prompt: { before: "Score the relationship from ", chip: "last", after: "." },
	},
	links: {
		type: "URL",
		tool: "Web search",
		toolKind: "web",
		inputs: "company",
		prompt: { before: "Find the website for ", chip: "company", after: "." },
	},
	ai: { type: "Text", tool: "Web search", toolKind: "web", inputs: "company" },
};

const DEFAULT_SETTINGS: RecordsColumnSettings = {
	grounding: false,
	required: false,
	allowEmpty: true,
	confidence: false,
};

/** A column's defaults under the caller's config; default inputs and prompt chips name columns. */
export function resolveColumn(
	key: ColumnKey,
	config: RecordsTableConfig,
	labels: RecordsTableLabels,
): ResolvedColumn {
	const meta = DEFAULT_META[key];
	const label = (name?: string) =>
		name && name in labels ? String(labels[name as ColumnKey]) : (name ?? "");
	const prompt = meta.prompt && { ...meta.prompt, chip: label(meta.prompt.chip) };
	const base: ResolvedColumn = {
		...meta,
		...DEFAULT_SETTINGS,
		prompt,
		inputs: meta.inputs ? [label(meta.inputs)] : [],
	};
	return { ...base, ...config[key] } as ResolvedColumn;
}

export function updateColumn(
	config: RecordsTableConfig,
	key: ColumnKey,
	patch: RecordsColumnConfig,
): RecordsTableConfig {
	return { ...config, [key]: { ...config[key], ...patch } };
}

export function strengthRank(strength: RecordRow["strength"]): number {
	return strength === "strong"
		? 3
		: strength === "weak"
			? 2
			: strength === "veryweak"
				? 1
				: 0;
}

export function strengthLabel(
	strength: RecordRow["strength"],
	labels: RecordsTableLabels,
): string {
	return strength === "strong"
		? labels.strengthStrong
		: strength === "weak"
			? labels.strengthWeak
			: strength === "veryweak"
				? labels.strengthVeryWeak
				: labels.strengthNone;
}

export function sortRows(rows: RecordRow[], sort: RecordSort): RecordRow[] {
	return [...rows].sort((a, b) => {
		const value =
			sort.key === "name"
				? a.name.localeCompare(b.name)
				: sort.key === "last"
					? a.last.localeCompare(b.last)
					: strengthRank(a.strength) - strengthRank(b.strength);
		return value * sort.dir;
	});
}

export function nextSort(current: RecordSort, key: RecordSort["key"]): RecordSort {
	return current.key === key ? { key, dir: current.dir === 1 ? -1 : 1 } : { key, dir: 1 };
}

export function toggleIn<T>(list: T[], item: T): T[] {
	return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

/** Left offset of each pinned column, stacking pinned columns in table order. */
export function pinOffsets(
	pinned: ColumnKey[],
	visible: ColumnKey[],
	widths: Record<ColumnKey, number>,
): Partial<Record<ColumnKey, number>> {
	const out: Partial<Record<ColumnKey, number>> = {};
	let left = 0;
	for (const key of visible) {
		if (!pinned.includes(key)) continue;
		out[key] = left;
		left += widths[key];
	}
	return out;
}

const path = (d: string): Glyph => ({ kind: "path", d });

export const TYPE_GLYPHS: Record<RecordsColumnType, Glyph[]> = {
	Text: [path("M4 6h16M4 12h10M4 18h7")],
	File: [
		path("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"),
		path("M14 2v6h6"),
	],
	Collection: [
		{ kind: "ellipse", cx: 12, cy: 5, rx: 8, ry: 3 },
		path("M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"),
	],
	"Single select": [
		{ kind: "circle", cx: 12, cy: 12, r: 9 },
		path("m8.5 12 2.4 2.4 4.6-4.9"),
	],
	"Multi select": [
		path("M11 6h9M11 12h9M11 18h9"),
		path("M4 6l1.5 1.5L8 5M4 12l1.5 1.5L8 11M4 18l1.5 1.5L8 17"),
	],
	URL: [
		path("M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"),
		path("M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1"),
	],
	Reference: [path("M7 17 17 7M9 7h8v8")],
	JSON: [
		path("M8 4c-2 0-2 2-2 3s.5 3-2 3c2.5 0 2 2 2 3s0 3 2 3"),
		path("M16 4c2 0 2 2 2 3s-.5 3 2 3c-2.5 0-2 2-2 3s0 3-2 3"),
	],
	"File splitter": [
		{ kind: "rect", x: 8, y: 8, width: 12, height: 12, rx: 2 },
		path("M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"),
	],
	Date: [
		{ kind: "rect", x: 3, y: 5, width: 18, height: 16, rx: 2.5 },
		path("M8 3v4M16 3v4M3 10h18"),
	],
};
