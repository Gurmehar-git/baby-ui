import origins from "./generated/origins.json";
import { componentCountLabel } from "./registry";

export const SITE_URL = origins.site;
export const SITE_NAME = "Baby UI";
export const REPO_URL = "https://github.com/kanakkholwal/baby-ui";
export const HOME_TITLE = "Baby UI: Animated React & Svelte Components";

export const homeDescription = (total: number) =>
	`Animated, accessible React and Svelte components on one token layer. Install any of ${componentCountLabel(total)} components with the shadcn CLI, in TypeScript or JavaScript.`;

export const DEFAULT_KEYWORDS = [
	"react components",
	"svelte components",
	"react 19 components",
	"svelte 5 components",
	"ui component library",
	"shadcn registry",
	"shadcn-svelte",
	"shadcn alternative",
	"animated components",
	"accessible components",
	"tailwind css components",
	"d3 charts",
];

/** A component page's search terms: its own keywords plus the framework phrasings people type. */
export function componentKeywords(name: string, keywords: string[]): string[] {
	const term = name.toLowerCase();
	return [
		...new Set([
			term,
			`react ${term}`,
			`svelte ${term}`,
			`${term} component`,
			`shadcn ${term}`,
			...keywords,
		]),
	];
}

/** Resolves `path` against `origin`; pages pass `SITE_URL` outside dev. */
export function absoluteUrl(origin: string, path: string): string {
	return new URL(path, origin).toString();
}

/** Builds the branded OG image URL for a page; `tag` is a small category label. */
export function ogImageUrl(
	origin: string,
	params: { title: string; description?: string; tag?: string },
): string {
	return absoluteUrl(origin, ogImagePath(params));
}

export function ogImagePath(params: {
	title: string;
	description?: string;
	tag?: string;
}): string {
	const url = new URL("/og", "https://baby-ui.invalid");
	url.searchParams.set("title", params.title);
	if (params.description) url.searchParams.set("description", params.description);
	if (params.tag) url.searchParams.set("tag", params.tag);
	return `${url.pathname}${url.search}`;
}

/** Appends `suffix` when the result still fits a search snippet (160 chars). */
export function metaDescription(base: string, suffix: string): string {
	const text = base.trim().replace(/\.?$/, ".");
	return text.length + suffix.length + 1 <= 160 ? `${text} ${suffix}` : text;
}

// --- Structured data ---

export type JsonLd = Record<string, unknown>;

const site = (path: string) => absoluteUrl(SITE_URL, path);

const ORGANIZATION_ID = site("/#organization");
const WEBSITE_ID = site("/#website");

/** The publisher every other node points at. */
export function organizationLd(): JsonLd {
	return {
		"@type": "Organization",
		"@id": ORGANIZATION_ID,
		name: SITE_NAME,
		url: site("/"),
		logo: site("/logo.svg"),
		sameAs: [REPO_URL],
	};
}

export function websiteLd(description: string): JsonLd {
	return {
		"@type": "WebSite",
		"@id": WEBSITE_ID,
		name: SITE_NAME,
		url: site("/"),
		description,
		inLanguage: "en",
		publisher: { "@id": ORGANIZATION_ID },
	};
}

/** The library itself, as Google's software rich result expects it: category, OS and a free offer. */
export function softwareApplicationLd(params: {
	description: string;
	keywords: string[];
	componentCount: number;
}): JsonLd {
	return {
		"@type": "SoftwareApplication",
		"@id": site("/#software"),
		name: SITE_NAME,
		description: params.description,
		url: site("/"),
		applicationCategory: "DeveloperApplication",
		applicationSubCategory: "UI component library",
		operatingSystem: "Web",
		offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
		license: "https://www.apache.org/licenses/LICENSE-2.0",
		keywords: params.keywords.join(", "),
		featureList: [
			`${componentCountLabel(params.componentCount)} components with React and Svelte ports`,
			"Installs through the shadcn and shadcn-svelte CLIs",
			"TypeScript and JavaScript output",
			"Keyboard and screen-reader support, reduced-motion aware",
		],
		screenshot: site("/og?title=Baby+UI"),
		downloadUrl: site("/docs/installation"),
		sameAs: [REPO_URL],
		publisher: { "@id": ORGANIZATION_ID },
	};
}

/** Trail from the home page; each entry is a visible page, last one the current page. */
export function breadcrumbLd(trail: { name: string; path: string }[]): JsonLd {
	return {
		"@type": "BreadcrumbList",
		itemListElement: [{ name: "Home", path: "/" }, ...trail].map((item, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: item.name,
			item: site(item.path),
		})),
	};
}

/** A free in-browser tool, so search engines can list it as an app rather than a page. */
export function webApplicationLd(params: {
	name: string;
	description: string;
	path: string;
	features: string[];
	keywords: string[];
}): JsonLd {
	return {
		"@type": "WebApplication",
		"@id": site(`${params.path}#app`),
		name: params.name,
		description: params.description,
		url: site(params.path),
		applicationCategory: "DesignApplication",
		operatingSystem: "Web",
		browserRequirements: "Requires JavaScript and a modern browser",
		isAccessibleForFree: true,
		offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
		featureList: params.features,
		keywords: params.keywords.join(", "),
		screenshot: site(`/og?title=${encodeURIComponent(params.name)}`),
		isPartOf: { "@id": WEBSITE_ID },
		publisher: { "@id": ORGANIZATION_ID },
	};
}

/** Search phrases for a category page: its name in the forms people type, for both frameworks. */
export function categoryKeywords(label: string): string[] {
	const name = label.toLowerCase();
	return [
		name,
		`${name} components`,
		`react ${name}`,
		`svelte ${name}`,
		`tailwind ${name}`,
		`shadcn ${name}`,
		`animated ${name}`,
		"react components",
		"svelte components",
	];
}

export function collectionLd(params: {
	name: string;
	description: string;
	path: string;
	items: { name: string; path: string; description?: string }[];
}): JsonLd {
	return {
		"@type": "CollectionPage",
		name: params.name,
		description: params.description,
		url: site(params.path),
		isPartOf: { "@id": WEBSITE_ID },
		mainEntity: {
			"@type": "ItemList",
			numberOfItems: params.items.length,
			itemListElement: params.items.map((item, i) => ({
				"@type": "ListItem",
				position: i + 1,
				name: item.name,
				url: site(item.path),
				...(item.description ? { description: item.description } : {}),
			})),
		},
	};
}

/** A component page: source code in two languages, installable through the shadcn CLI. */
export function componentLd(params: {
	name: string;
	description: string;
	path: string;
	keywords: string[];
}): JsonLd {
	return {
		"@type": "SoftwareSourceCode",
		name: params.name,
		description: params.description,
		url: site(params.path),
		codeRepository: REPO_URL,
		programmingLanguage: ["TypeScript", "Svelte", "React"],
		runtimePlatform: "Web browser",
		license: "https://www.apache.org/licenses/LICENSE-2.0",
		keywords: params.keywords.join(", "),
		isPartOf: { "@id": WEBSITE_ID },
		publisher: { "@id": ORGANIZATION_ID },
	};
}

export function articleLd(params: {
	title: string;
	description: string;
	path: string;
}): JsonLd {
	return {
		"@type": "TechArticle",
		headline: params.title,
		description: params.description,
		url: site(params.path),
		inLanguage: "en",
		isPartOf: { "@id": WEBSITE_ID },
		publisher: { "@id": ORGANIZATION_ID },
	};
}

/** One `<script type="application/ld+json">` body; `<` escaped so content can't close the tag. */
export function jsonLdScript(nodes: JsonLd[]): string {
	const json = JSON.stringify({ "@context": "https://schema.org", "@graph": nodes });
	return `<script type="application/ld+json">${json.replace(/</g, "\\u003c")}</script>`;
}
