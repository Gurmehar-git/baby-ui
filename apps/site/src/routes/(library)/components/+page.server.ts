import { cardItems, newFirst, newItems, sidebarGroups } from "#lib/server/registry.js";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	fresh: newItems(),
	sections: sidebarGroups().map((group) => ({
		category: group.category,
		items: cardItems([...group.items].sort(newFirst).map((item) => item.slug)),
	})),
});
