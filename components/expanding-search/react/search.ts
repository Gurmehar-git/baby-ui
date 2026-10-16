export type ExpandingSearchItem = {
	id: string;
	title: string;
	/** One short line under the title, such as the type, owner or last edit. */
	meta?: string;
	/** Results gather under this heading, in the order groups first appear in `items`. */
	group?: string;
	/** Extra words that also find this item. */
	keywords?: string[];
};
export type ExpandingSearchGroup<T extends ExpandingSearchItem = ExpandingSearchItem> = {
	name: string;
	items: T[];
};

/** Title starts beat word starts, which beat matches inside a word, which beat keyword and meta matches. */
export function rankSearch<T extends ExpandingSearchItem>(
	items: T[],
	query: string,
	limit: number,
): T[] {
	const q = query.toLocaleLowerCase();
	const scored: { item: T; score: number; order: number }[] = [];
	items.forEach((item, order) => {
		const title = item.title.toLocaleLowerCase();
		const at = title.indexOf(q);
		const extra = [item.meta ?? "", ...(item.keywords ?? [])].some((word) =>
			word.toLocaleLowerCase().includes(q),
		);
		const score =
			at === 0
				? 0
				: at > 0 && /[\s\-/]/.test(title[at - 1] ?? "")
					? 1
					: at > 0
						? 2
						: extra
							? 3
							: -1;
		if (score >= 0) scored.push({ item, score, order });
	});
	return scored
		.sort((a, b) => a.score - b.score || a.order - b.order)
		.slice(0, limit)
		.map((entry) => entry.item);
}

/** Groups `list` by `group`, ordered by where each group first appears in `source`. */
export function groupSearch<T extends ExpandingSearchItem>(
	list: T[],
	source: T[],
): ExpandingSearchGroup<T>[] {
	const order = new Map<string, number>();
	source.forEach((item, index) => {
		const name = item.group ?? "";
		if (!order.has(name)) order.set(name, index);
	});
	const groups = new Map<string, T[]>();
	for (const item of list) {
		const name = item.group ?? "";
		groups.set(name, [...(groups.get(name) ?? []), item]);
	}
	return [...groups]
		.sort((a, b) => (order.get(a[0]) ?? 0) - (order.get(b[0]) ?? 0))
		.map(([name, items]) => ({ name, items }));
}

/** `text` split around the first match of `query`, for bolding it. */
export function splitSearchMatch(text: string, query: string): [string, string, string] {
	const at = query ? text.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) : -1;
	if (at < 0) return [text, "", ""];
	return [
		text.slice(0, at),
		text.slice(at, at + query.length),
		text.slice(at + query.length),
	];
}
