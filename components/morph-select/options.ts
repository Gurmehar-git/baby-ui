export type MorphSelectOption = {
	value: string;
	label: string;
	/** Short trailing detail, such as an offset or a count. */
	meta?: string;
	disabled?: boolean;
};
export type MorphSelectGroup = { label: string; options: MorphSelectOption[] };
export type MorphSelectItem = MorphSelectOption | MorphSelectGroup;
export type MorphSelectSection = {
	key: string;
	label?: string;
	options: MorphSelectOption[];
};

const isGroup = (item: MorphSelectItem): item is MorphSelectGroup => "options" in item;

/** Loose options between groups gather into unlabelled sections, keeping the given order. */
export function sections(items: MorphSelectItem[]): MorphSelectSection[] {
	const out: MorphSelectSection[] = [];
	items.forEach((item, index) => {
		if (isGroup(item)) {
			out.push({ key: `group-${index}`, label: item.label, options: item.options });
			return;
		}
		const last = out.at(-1);
		if (last && !last.label) last.options.push(item);
		else out.push({ key: `loose-${index}`, options: [item] });
	});
	return out;
}

export const flatOptions = (items: MorphSelectItem[]) =>
	sections(items).flatMap((section) => section.options);
