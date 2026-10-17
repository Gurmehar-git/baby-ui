import gitDates from "virtual:component-dates";
import { specs as publicSpecs } from "@baby-ui/components/specs";
import {
	CATEGORIES,
	type Category,
	type ComponentSpec,
	FRAMEWORKS,
	PREVIEW_CATEGORIES,
} from "@baby-ui/registry-schema";
import {
	type AdjacentComponent,
	CATEGORY_LABEL,
	type CardItem,
	type CatalogItem,
	categoryHref,
	defaultProps,
	type NavCategory,
	type SidebarGroup,
	specHref,
} from "#lib/registry.js";
import { proSpecs } from "#lib/server/pro.js";

const proSlugs = new Set(proSpecs.map((s) => s.slug));

const FRESH_DAYS = 15;
const DAY_MS = 86_400_000;
// The build's clock: prerendered pages keep their labels until the next deploy.
const today = Date.now();
const recent = (date?: string) =>
	!!date && today - Date.parse(date) <= FRESH_DAYS * DAY_MS;

/** The component's code (each port and the shared files) and its spec; `lib/` never dates one. */
function datedPaths(spec: ComponentSpec) {
	const root = `${proSlugs.has(spec.slug) ? "pro/" : ""}components`;
	const folder = FRAMEWORKS.map((f) => spec.impl[f]?.files[0]?.path.split("/")[0]).find(
		(name) => name && name !== "lib",
	);
	const folders = folder
		? [
				...FRAMEWORKS.filter((f) => spec.impl[f]).map((f) => `${root}/${folder}/${f}`),
				`${root}/${folder}/shared`,
			]
		: [];
	return { folders, file: `${root}/${spec.slug}/component.ts` };
}

type Freshness = "new" | "updated" | null;

/** The day a component first landed: the spec's own date, else its earliest commit. */
function addedDate(spec: ComponentSpec): string | undefined {
	const { folders, file } = datedPaths(spec);
	const known = [file, ...folders].flatMap((path) => gitDates[path] ?? []);
	return spec.added ?? known.map((d) => d.added).sort()[0];
}

/** "new" for 15 days after release, then "updated" for 15 days after a code change; specs' own dates win. */
function dateFreshness(spec: ComponentSpec): Freshness {
	const { folders } = datedPaths(spec);
	const added = addedDate(spec);
	// Spec-only edits (docs, metadata) are not updates; only the ports' own code counts.
	const updated =
		spec.updated ??
		folders
			.flatMap((path) => gitDates[path]?.updated ?? [])
			.sort()
			.at(-1);
	if (recent(added)) return "new";
	return updated && recent(updated) && (!added || updated > added) ? "updated" : null;
}

/** Every spec the site shows: Pro and preview categories (emails) appear only with the flag.
 * Pages, lists, search and the sitemap all read this, so a hidden spec 404s everywhere. */
export const specs: readonly ComponentSpec[] = [...publicSpecs, ...proSpecs].filter(
	(s) =>
		__SHOW_PRO__ || (!proSlugs.has(s.slug) && !PREVIEW_CATEGORIES.includes(s.category)),
);

/** What the site lists: retired specs keep their page and registry item, nothing else. */
export const liveSpecs: readonly ComponentSpec[] = specs.filter((s) => !s.retired);

const FRESHNESS = new Map(specs.map((s) => [s.slug, dateFreshness(s)]));

/** The New/Updated label a component wears for this build. */
export const freshness = (spec: Pick<ComponentSpec, "slug">): Freshness =>
	FRESHNESS.get(spec.slug) ?? null;

/** Categories with at least one component, in schema order. */
export function navCategories(): NavCategory[] {
	return CATEGORIES.flatMap((category) => {
		const count = liveSpecs.filter((s) => s.category === category).length;
		return count
			? [
					{
						category,
						label: CATEGORY_LABEL[category],
						href: categoryHref(category),
						count,
					},
				]
			: [];
	});
}

export function catalog(): CatalogItem[] {
	return liveSpecs.map((s) => ({
		slug: s.slug,
		name: s.name,
		category: s.category,
		tier: s.tier,
		description: s.description,
		keywords: s.keywords,
		href: specHref(s),
	}));
}

export function cardItem(spec: ComponentSpec): CardItem {
	return {
		slug: spec.slug,
		name: spec.name,
		description: spec.description,
		href: specHref(spec),
		category: spec.category,
		tier: spec.tier,
		isNew: freshness(spec) === "new",
		isUpdated: freshness(spec) === "updated",
		defaults: defaultProps(spec),
	};
}

/** Card data for the given slugs, in the order given; unknown slugs are dropped. */
export function cardItems(slugs: string[]): CardItem[] {
	return slugs.flatMap((slug) => {
		const spec = liveSpecs.find((s) => s.slug === slug);
		return spec ? [cardItem(spec)] : [];
	});
}

/** Browsing order for card grids: new components first, then alphabetical. */
export function newFirst<T extends { slug: string; name: string }>(a: T, b: T): number {
	const fresh = (item: T) => Number(freshness(item) === "new");
	return fresh(b) - fresh(a) || a.name.localeCompare(b.name);
}

/** Live new components: categories in schema order, alphabetical within each. */
export function newItems(): CardItem[] {
	return CATEGORIES.flatMap((category) =>
		liveSpecs
			.filter((s) => freshness(s) === "new" && s.category === category)
			.map(cardItem)
			.sort(newFirst),
	);
}

/** The `limit` newest new components, taking one per category in turn so a row spans areas. */
export function latestNew(limit: number, exclude: readonly string[] = []): CardItem[] {
	const queues = CATEGORIES.map((category) =>
		liveSpecs
			.filter(
				(s) =>
					s.category === category && freshness(s) === "new" && !exclude.includes(s.slug),
			)
			.map((spec) => ({ spec, added: addedDate(spec) ?? "" }))
			.sort(
				(a, b) =>
					b.added.localeCompare(a.added) || a.spec.name.localeCompare(b.spec.name),
			),
	);
	const picked: ComponentSpec[] = [];
	while (picked.length < limit && queues.some((q) => q.length)) {
		// Each round takes every category's newest once, newest round members first.
		const round = queues.flatMap((q) => q.splice(0, 1));
		round.sort((a, b) => b.added.localeCompare(a.added));
		picked.push(...round.slice(0, limit - picked.length).map((r) => r.spec));
	}
	return picked.map(cardItem);
}

/** Every category, with `lead` (the route's own category) moved to the front. */
export function sidebarGroups(lead?: Category): SidebarGroup[] {
	return [...CATEGORIES]
		.sort((a, b) => Number(b === lead) - Number(a === lead))
		.map((category) => ({
			category,
			label: CATEGORY_LABEL[category],
			// Alphabetical: the sidebar is for finding a known name, not for browsing.
			items: liveSpecs
				.filter((s) => s.category === category)
				.map((s) => ({
					slug: s.slug,
					name: s.name,
					href: specHref(s),
					status: s.status,
					tier: s.tier,
					fresh: freshness(s),
				}))
				.sort((a, b) => a.name.localeCompare(b.name)),
		}))
		.filter((g) => g.items.length > 0);
}

export function findSpec(category: string, slug: string): ComponentSpec | undefined {
	return specs.find((s) => s.slug === slug && s.category === category);
}

/** Previous/next in the same order the sidebar lists them: category, then alphabetical. */
export function adjacentComponents(
	category: string,
	slug: string,
): { prev: AdjacentComponent | null; next: AdjacentComponent | null } {
	const flat = sidebarGroups(category as Category).flatMap((group) =>
		group.items.map((item) => ({ ...item, category: group.category })),
	);
	const index = flat.findIndex(
		(item) => item.category === category && item.slug === slug,
	);
	if (index === -1) return { prev: null, next: null };
	const prev = flat[index - 1];
	const next = flat[index + 1];
	return {
		prev: prev ? { name: prev.name, href: prev.href } : null,
		next: next ? { name: next.name, href: next.href } : null,
	};
}
