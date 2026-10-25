import { CATEGORIES, type Category } from "@baby-ui/registry-schema";
import { error } from "@sveltejs/kit";
import {
	CATEGORY_BLURB,
	CATEGORY_GROUPS,
	CATEGORY_LABEL,
	COLLECTIONS,
	categoryHref,
	isCollection,
	TOP_LEVEL,
} from "#lib/registry.js";
import { cardItems, newFirst, specs } from "#lib/server/registry.js";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ params }) => {
	const id = params.category;
	if (isCollection(id)) {
		const { label, blurb, slugs } = COLLECTIONS[id];
		const shown = specs.filter((s) => (slugs as readonly string[]).includes(s.slug));
		const items = cardItems(shown.sort(newFirst).map((s) => s.slug));
		return { label, blurb, path: `/${id}`, topLevel: true, items, groups: null };
	}
	const category = id as Category;
	if (!CATEGORIES.includes(category)) throw error(404, `No category named "${id}"`);
	const slugs = specs
		.filter((s) => s.category === category)
		.sort(newFirst)
		.map((s) => s.slug);
	// A preview category has no visible specs while its flag is off.
	if (!slugs.length) throw error(404, `No category named "${id}"`);

	// Some categories (base) are too broad for one flat grid; show their sub-groups instead.
	const groupDefs = (
		CATEGORY_GROUPS as Partial<Record<Category, typeof CATEGORY_GROUPS.base>>
	)[category];
	const groups = groupDefs
		? groupDefs
				.map((g) => ({
					id: g.id,
					label: g.label,
					items: cardItems([...g.slugs]).sort(newFirst),
				}))
				.filter((g) => g.items.length > 0)
		: null;

	return {
		label: CATEGORY_LABEL[category],
		blurb: CATEGORY_BLURB[category],
		path: categoryHref(category),
		topLevel: TOP_LEVEL.includes(category),
		items: cardItems(slugs),
		groups,
	};
};
