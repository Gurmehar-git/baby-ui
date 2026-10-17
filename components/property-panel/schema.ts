/** A choice for `select`, `combobox` and `segmented`: a bare value doubles as its label. */
export type PropertyOption = string | { value: string; label: string };

/**
 * One entry of a DialKit-style config. Tuples are sliders, numbers scrub, booleans switch, hex
 * strings pick a colour, other strings are text; objects with a `type` are the rest.
 */
export type PropertyControl =
	| number
	| readonly [number, number, number]
	| readonly [number, number, number, number]
	| boolean
	| string
	| { type: "select"; options: readonly PropertyOption[]; default?: string }
	| {
			type: "combobox";
			options: readonly PropertyOption[];
			default?: string;
			placeholder?: string;
	  }
	| { type: "segmented"; options: readonly PropertyOption[]; default?: string }
	| { type: "action"; label?: string };

/** A config object; a nested plain object is a folder, as in DialKit. `type` marks a control. */
export type PropertySchema = {
	readonly [key: string]: PropertyControl | PropertySchema;
} & {
	readonly type?: never;
};

/** Live values in the config's shape: folders nest, actions are left out. */
export type PropertyValues = { [key: string]: PropertyValue };
export type PropertyValue = number | boolean | string | PropertyValues;

type Base = { key: string; path: string; label: string };
export type PropertyField = Base &
	(
		| { kind: "slider"; min: number; max: number; step: number }
		| { kind: "number" }
		| { kind: "switch" }
		| { kind: "color" }
		| { kind: "text" }
		| {
				kind: "select" | "combobox" | "segmented";
				options: { value: string; label: string }[];
		  }
		| { kind: "action" }
	) & { placeholder?: string };
export type PropertyFolder = Base & { kind: "folder"; children: PropertyNode[] };
export type PropertyNode = PropertyField | PropertyFolder;

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/** `fillOpacity` and `fill_opacity` read "Fill opacity". */
export function propertyLabel(key: string): string {
	const words = key
		.replace(/[_-]+/g, " ")
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
		.trim()
		.toLowerCase();
	return words.charAt(0).toUpperCase() + words.slice(1);
}

// A bare value keeps its raw form as the value and reads capitalised as the label.
function options(list: readonly PropertyOption[]) {
	return list.map((o) =>
		typeof o === "string" ? { value: o, label: propertyLabel(o) } : o,
	);
}

function isTuple(entry: unknown): entry is readonly number[] {
	return Array.isArray(entry) && entry.every((n) => typeof n === "number");
}

function isFolder(entry: unknown): entry is PropertySchema {
	return (
		typeof entry === "object" &&
		entry !== null &&
		!Array.isArray(entry) &&
		!("type" in entry)
	);
}

// Integer ranges step by 1; fractional ones by the power of ten nearest a hundredth of the span.
function inferStep(min: number, max: number, value: number): number {
	if ([min, max, value].every(Number.isInteger)) return 1;
	return 10 ** Math.floor(Math.log10((max - min) / 100));
}

/** The config as a tree of rows and folders, in key order. */
export function propertyNodes(schema: PropertySchema, prefix = ""): PropertyNode[] {
	return Object.entries(schema).map(([key, entry]) => {
		const base = {
			key,
			path: prefix ? `${prefix}.${key}` : key,
			label: propertyLabel(key),
		};
		if (isTuple(entry)) {
			const [value, min, max, step] = entry;
			return {
				...base,
				kind: "slider",
				min,
				max,
				step: step ?? inferStep(min, max, value),
			};
		}
		if (typeof entry === "number") return { ...base, kind: "number" };
		if (typeof entry === "boolean") return { ...base, kind: "switch" };
		if (typeof entry === "string")
			return { ...base, kind: HEX.test(entry) ? "color" : "text" };
		if (isFolder(entry))
			return { ...base, kind: "folder", children: propertyNodes(entry, base.path) };
		if (entry.type === "action")
			return { ...base, kind: "action", label: entry.label ?? base.label };
		return {
			...base,
			kind: entry.type,
			options: options(entry.options),
			placeholder: entry.type === "combobox" ? entry.placeholder : undefined,
		};
	});
}

export type PropertyGroup = {
	key: string;
	label?: string;
	folder: boolean;
	fields: PropertyField[];
};

/** Panel groups: leading rows under `title`, then one group per folder, nested ones as "A / B". */
export function propertyGroups(nodes: PropertyNode[], title?: string): PropertyGroup[] {
	const groups: PropertyGroup[] = [];
	const walk = (list: PropertyNode[], group: PropertyGroup) => {
		groups.push(group);
		for (const node of list) {
			if (node.kind !== "folder") {
				group.fields.push(node);
				continue;
			}
			const label =
				group.folder && group.label ? `${group.label} / ${node.label}` : node.label;
			walk(node.children, { key: node.path, label, folder: true, fields: [] });
		}
	};
	walk(nodes, { key: "", label: title, folder: false, fields: [] });
	return groups.filter((g) => g.fields.length > 0);
}

/** The values a config starts at, shaped like DialKit's return value. */
export function propertyDefaults(schema: PropertySchema): PropertyValues {
	const out: PropertyValues = {};
	for (const [key, entry] of Object.entries(schema)) {
		if (isTuple(entry)) out[key] = entry[0] ?? 0;
		else if (
			typeof entry === "number" ||
			typeof entry === "boolean" ||
			typeof entry === "string"
		)
			out[key] = entry;
		else if (isFolder(entry)) out[key] = propertyDefaults(entry);
		else if (entry.type !== "action")
			out[key] = entry.default ?? options(entry.options)[0]?.value ?? "";
	}
	return out;
}

/** Reads a dotted path such as `shadow.blur`. */
export function getPropertyValue(
	values: PropertyValues,
	path: string,
): PropertyValue | undefined {
	let node: PropertyValue | undefined = values;
	for (const key of path.split(".")) {
		if (typeof node !== "object" || node === null) return undefined;
		node = node[key];
	}
	return node;
}

/** A copy of `values` with `path` set; folders on the way are copied, never mutated. */
export function setPropertyValue(
	values: PropertyValues,
	path: string,
	value: PropertyValue,
): PropertyValues {
	const [key, ...rest] = path.split(".");
	if (key === undefined) return values;
	if (!rest.length) return { ...values, [key]: value };
	const child = values[key];
	const folder = typeof child === "object" && child !== null ? child : {};
	return { ...values, [key]: setPropertyValue(folder, rest.join("."), value) };
}
