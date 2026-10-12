export interface FaqItem {
	/** Stable id for open state; defaults to the question. */
	id?: string;
	question: string;
	/** Plain text; search matches it too. */
	answer: string;
	/** Topic in the columns variant; defaults to "General". */
	category?: string;
}

export interface FaqContact {
	label: string;
	description?: string;
	href?: string;
	onClick?: () => void;
}

export const faqKey = (item: FaqItem) => item.id ?? item.question;
export const faqCategory = (item: FaqItem) => item.category ?? "General";

export const faqCategories = (items: FaqItem[]) => [...new Set(items.map(faqCategory))];

// Strips combining marks after NFD, so "resume" finds "résumé".
const normalize = (text: string) =>
	text.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");

export const faqMatches = (item: FaqItem, query: string) => {
	const needle = normalize(query.trim());
	return !needle || normalize(`${item.question} ${item.answer}`).includes(needle);
};

/** `text` split into plain and matching runs, keeping the original casing. */
export function highlightParts(text: string, query: string) {
	const needle = normalize(query.trim());
	if (!needle) return [{ text, match: false }];
	const haystack = normalize(text);
	const parts: { text: string; match: boolean }[] = [];
	let from = 0;
	let at = haystack.indexOf(needle);
	while (at >= 0) {
		if (at > from) parts.push({ text: text.slice(from, at), match: false });
		parts.push({ text: text.slice(at, at + needle.length), match: true });
		from = at + needle.length;
		at = haystack.indexOf(needle, from);
	}
	if (from < text.length) parts.push({ text: text.slice(from), match: false });
	return parts;
}

/** A window of the answer around the first match, for a closed item that matches only there. */
export function faqHint(item: FaqItem, query: string, open: boolean): string | null {
	const needle = normalize(query.trim());
	if (!needle || open || normalize(item.question).includes(needle)) return null;
	const at = normalize(item.answer).indexOf(needle);
	if (at < 0) return null;
	const start = Math.max(0, item.answer.lastIndexOf(" ", Math.max(0, at - 36)) + 1);
	const end = Math.min(item.answer.length, at + needle.length + 60);
	const ellipsis = String.fromCharCode(8230);
	return `${start > 0 ? ellipsis : ""}${item.answer.slice(start, end).trim()}${end < item.answer.length ? ellipsis : ""}`;
}
