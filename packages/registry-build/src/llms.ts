import { CATEGORY, type ComponentSpec, docsPath } from "@baby-ui/registry-schema";
import { REGISTRY_URL, SITE_URL } from "./config";

/** A link-list entry in llmstxt.org form: `- [Title](url): notes`. */
const entry = (title: string, url: string, notes: string) =>
	`- [${title}](${url}): ${notes}`;

/** llmstxt.org layout: H1, summary blockquote, prose, then H2 sections of markdown links. */
export function buildLlmsTxt(all: ComponentSpec[]): string {
	// Retired items still install, but nothing should point a reader at them.
	const specs = all.filter((s) => !s.retired);
	const lines = [
		"# Baby UI",
		"",
		"> Animated, accessible UI components for React and Svelte. Every component has one",
		"> ComponentSpec and up to two implementations that share a token layer, so both renders",
		"> match. Components install as source through the shadcn and shadcn-svelte CLIs.",
		"",
		"Every link below points at the page's markdown version. Install any component with:",
		"",
		"```bash",
		`npx shadcn@latest add ${REGISTRY_URL}/r/{slug}.json`,
		`npx shadcn-svelte@latest add ${REGISTRY_URL}/svelte/r/{slug}.json`,
		"```",
		"",
		"Insert `/js` before the slug for JavaScript instead of TypeScript. A spec's",
		"`motion.behaviour` lists what the component must observably do; it is the contract both",
		"implementations satisfy. `props[].control` gives the range of values worth trying,",
		"`a11y.keyboard` lists `{ keys, action }` rows, and `guidance` holds when to use it, when",
		"not to (with the component to use instead), responsive, performance and notes for AI.",
		"",
		"## Rules for agents",
		"",
		"- Install through the registry URLs above; never paste a component's source by hand. Each item brings `tokens` (additive variables only) and any opt-in token layer it reads.",
		"- Read a page's When not to use and Notes for AI before choosing a component.",
		"- Style through `variant` and `size` (shadcn's names) and `class`/`className`; do not fork a component for a one-off look.",
		"- Status, progress, streaming and open state are props the caller controls; components never simulate them.",
		"- React and Svelte share prop names, except `className` (React) and `class` (Svelte).",
		"- Leave the app's theme alone: `tokens` never redefines shadcn's variables; `theme` is the opt-in that does.",
		"",
		"## Docs",
		"",
		entry(
			"Introduction",
			`${SITE_URL}/docs/index.md`,
			"what Baby UI is and how it installs",
		),
		entry(
			"Installation",
			`${SITE_URL}/docs/installation.md`,
			"project setup and adding components with the shadcn CLI",
		),
		entry(
			"Theming",
			`${SITE_URL}/docs/theming.md`,
			"colour, dark mode and motion variables",
		),
		"",
		"## Registry",
		"",
		entry(
			"Specs",
			`${REGISTRY_URL}/r/specs.json`,
			"every ComponentSpec, the full source of truth",
		),
		entry(
			"shadcn registry",
			`${REGISTRY_URL}/r/registry.json`,
			"React items, one per component",
		),
		entry(
			"shadcn-svelte registry",
			`${REGISTRY_URL}/svelte/r/registry.json`,
			"Svelte items, one per component",
		),
		"",
	];

	const categories = [...new Set(specs.map((s) => s.category))].sort();
	for (const category of categories) {
		lines.push(`## ${CATEGORY[category].title}`, "");
		for (const spec of specs.filter((s) => s.category === category)) {
			const frameworks = Object.keys(spec.impl).sort().join(" and ");
			lines.push(
				entry(
					spec.name,
					`${SITE_URL}${docsPath(spec)}.md`,
					`${spec.description} (${frameworks})`,
				),
			);
		}
		lines.push("");
	}

	return lines.join("\n");
}
