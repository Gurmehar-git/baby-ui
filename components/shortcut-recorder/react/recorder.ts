import { parseShortcut } from "../../lib/react/shortcut-keys";

export type ShortcutBinding = {
	id: string;
	/** What the shortcut does, e.g. "Open search". */
	label: string;
	shortcut: string;
};

const NAMED: Record<string, string> = {
	" ": "space",
	enter: "enter",
	tab: "tab",
	arrowup: "up",
	arrowdown: "down",
	arrowleft: "left",
	arrowright: "right",
	backspace: "backspace",
	delete: "delete",
};

/** Combinations the browser or system keeps for itself. */
export const RESERVED_SHORTCUTS = [
	"mod+w",
	"mod+q",
	"mod+t",
	"mod+n",
	"mod+r",
	"mod+l",
	"mod+c",
	"mod+v",
	"mod+x",
	"mod+z",
	"mod+a",
	"mod+tab",
];

/** The modifiers held right now, as tokens, for the live preview while recording. */
export function heldModifiers(event: KeyboardEvent, apple: boolean): string[] {
	const out: string[] = [];
	if (apple ? event.metaKey : event.ctrlKey) out.push("mod");
	if (apple && event.ctrlKey) out.push("ctrl");
	if (!apple && event.metaKey) out.push("cmd");
	if (event.altKey) out.push("alt");
	if (event.shiftKey) out.push("shift");
	return out;
}

/** Caps for modifiers held on their own; the parser wants a key, so one is added and dropped. */
export function heldCaps(held: string[], apple: boolean): string[] {
	return parseShortcut([...held, "a"].join("+"), apple)?.caps.slice(0, -1) ?? held;
}

/** A shortcut string such as `"mod+shift+k"`, or null while only modifiers are held. */
export function comboFromEvent(event: KeyboardEvent, apple: boolean): string | null {
	const raw = event.key.toLowerCase();
	if (["meta", "control", "shift", "alt", "os"].includes(raw)) return null;
	// With Alt held, macOS reports the composed character; the physical key reads truer.
	const fromCode =
		/^Key([A-Z])$/.exec(event.code)?.[1] ?? /^Digit(\d)$/.exec(event.code)?.[1];
	const key =
		NAMED[raw] ??
		(event.altKey && fromCode ? fromCode.toLowerCase() : raw.length === 1 ? raw : null);
	if (!key) return null;
	return [...heldModifiers(event, apple), key].join("+");
}

/** True when the combo carries Command, Ctrl or Alt, so it cannot clash with typing. */
export const hasModifier = (combo: string) => /(^|\+)(mod|ctrl|cmd|alt)\+/.test(combo);

/** Normalised for comparing, so "Shift+Mod+K" equals "mod+shift+k". */
export const comboKey = (combo: string) =>
	combo
		.toLowerCase()
		.split("+")
		.map((token) => token.trim())
		.sort()
		.join("+");
