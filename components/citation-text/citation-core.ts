export type CitationSource = {
	id: string;
	title: string;
	url: string;
	/** Host the source lives on, e.g. "en.wikipedia.org". */
	domain: string;
	/** Short quote shown in the hover card. */
	snippet?: string;
	/** Icon URL; a monogram of the site name stands in when absent. */
	favicon?: string;
};

export type CitationSegment = {
	/** One sentence or clause; it is what highlights when one of its chips is active. */
	text: string;
	/** Source ids backing this segment, in the order the chips should read. */
	citations?: string[];
};

export type CitationRef = { id: string; number: number; source: CitationSource };

/** Numbers sources by first citation; ids with no matching source are dropped. */
export function numberCitations(
	segments: readonly CitationSegment[],
	sources: readonly CitationSource[],
): { refs: CitationRef[][]; cited: CitationRef[] } {
	const byId = new Map(sources.map((source) => [source.id, source]));
	const numbers = new Map<string, number>();
	const cited: CitationRef[] = [];
	const refs = segments.map((segment) => {
		const seen = new Set<string>();
		return (segment.citations ?? []).flatMap((id) => {
			const source = byId.get(id);
			if (!source || seen.has(id)) return [];
			seen.add(id);
			let number = numbers.get(id);
			if (number === undefined) {
				number = numbers.size + 1;
				numbers.set(id, number);
				cited.push({ id, number, source });
			}
			return [{ id, number, source }];
		});
	});
	return { refs, cited };
}

const SECOND_LEVEL = new Set(["co", "com", "org", "net", "gov", "ac", "edu"]);

/** Site name for a domain chip: "en.wikipedia.org" reads "wikipedia". */
export function siteName(domain: string): string {
	const host = domain
		.replace(/^[a-z]+:\/\//i, "")
		.replace(/^www\./i, "")
		.split(/[/:?#]/)[0]
		?.toLowerCase();
	if (!host) return domain;
	const parts = host.split(".");
	if (parts.length < 2) return host;
	const tld = parts.length - 1;
	const name =
		SECOND_LEVEL.has(parts[tld - 1] ?? "") && parts.length > 2 ? tld - 2 : tld - 1;
	return parts[name] ?? host;
}

/** One letter for a source with no favicon. */
export function monogram(source: CitationSource): string {
	return siteName(source.domain).charAt(0).toUpperCase() || "?";
}

/** Segments join with a space unless one side already brings whitespace or punctuation. */
export function needsSpace(previous: string, next: string): boolean {
	return !/\s$/.test(previous) && !/^[\s,.;:!?)]/.test(next);
}

/** Whether segment `index` reads as active for the chip or source under the pointer. */
export function segmentActive(
	refs: CitationRef[][],
	index: number,
	active: { segment: number | null; source: string | null },
): boolean {
	if (active.segment !== null) return active.segment === index;
	if (active.source === null) return false;
	return refs[index]?.some((ref) => ref.id === active.source) ?? false;
}
