import { CATEGORIES } from "@baby-ui/registry-schema/categories";
import origins from "#lib/generated/origins.json";
import { installArgs } from "#lib/install.js";
import { PMS, pmCommand } from "#lib/pm.js";
import type { PackageManager } from "#lib/preferences.svelte.js";
import type { CatalogItem } from "#lib/registry.js";
import { scoreEntry } from "#lib/search-score.js";

/** Where the tools read components from: the server's specs, or the site's static files in a browser. */
export interface ToolSource {
	catalog: () => Promise<CatalogItem[]>;
	/** The component's markdown twin, or null when there is none. */
	markdown: (item: CatalogItem) => Promise<string | null>;
}

export interface ToolResult {
	content: { type: "text"; text: string }[];
	isError?: boolean;
}

type Args = Record<string, unknown>;

export interface SiteTool {
	name: string;
	description: string;
	inputSchema: {
		type: "object";
		properties: Record<string, unknown>;
		required?: string[];
	};
	run: (args: Args, source: ToolSource) => Promise<ToolResult>;
}

const text = (body: string, isError = false): ToolResult => ({
	content: [{ type: "text", text: body }],
	...(isError ? { isError } : {}),
});
const str = (args: Args, key: string) => {
	const value = args[key];
	return typeof value === "string" ? value.trim() : undefined;
};
const list = (args: Args, key: string) => {
	const value = args[key];
	const items = Array.isArray(value) ? value : [value];
	return items.filter(
		(item): item is string => typeof item === "string" && item.length > 0,
	);
};
const markdownUrl = (item: CatalogItem) => `${origins.site}${item.href}.md`;
const line = (item: CatalogItem) =>
	`- ${item.name} (\`${item.slug}\`, ${item.category}${item.tier === "pro" ? ", Pro" : ""}): ${item.description} ${markdownUrl(item)}`;
const isPm = (value: string | undefined): value is PackageManager =>
	PMS.some((pm) => pm === value);

export const SITE_TOOLS: SiteTool[] = [
	{
		name: "search_components",
		description:
			"Find Baby UI components by intent or name, e.g. 'date range picker' or 'animated counter'. Returns the best matches with their markdown docs URL.",
		inputSchema: {
			type: "object",
			properties: {
				query: {
					type: "string",
					description: "What the UI needs to do, or a component name.",
				},
				limit: { type: "number", minimum: 1, maximum: 25, default: 8 },
			},
			required: ["query"],
		},
		run: async (args, source) => {
			const query = str(args, "query");
			if (!query) return text("`query` is required.", true);
			const limit =
				typeof args.limit === "number" ? Math.min(25, Math.max(1, args.limit)) : 8;
			const ranked = (await source.catalog())
				.map((item) => ({
					item,
					score: scoreEntry(
						item.name,
						`${item.keywords.join(" ")} ${item.description}`,
						query,
					),
				}))
				.filter((row) => row.score > 0)
				.sort((a, b) => b.score - a.score)
				.slice(0, limit);
			if (!ranked.length)
				return text(`No component matches "${query}". Try list_components.`);
			return text(ranked.map((row) => line(row.item)).join("\n"));
		},
	},
	{
		name: "list_components",
		description:
			"List Baby UI components, optionally filtered by category or tier. Categories: " +
			`${CATEGORIES.join(", ")}.`,
		inputSchema: {
			type: "object",
			properties: {
				category: { type: "string", enum: [...CATEGORIES] },
				tier: { type: "string", enum: ["free", "pro"] },
			},
		},
		run: async (args, source) => {
			const category = str(args, "category");
			const tier = str(args, "tier");
			const items = (await source.catalog()).filter(
				(item) =>
					(!category || item.category === category) && (!tier || item.tier === tier),
			);
			if (!items.length) return text("No components match those filters.");
			return text([`${items.length} components`, ...items.map(line)].join("\n"));
		},
	},
	{
		name: "get_component",
		description:
			"The full reference for one component as markdown: when to use it and what to use instead, install, usage, props, keyboard, accessibility, motion and notes for AI.",
		inputSchema: {
			type: "object",
			properties: { slug: { type: "string", description: "e.g. `signature-pad`" } },
			required: ["slug"],
		},
		run: async (args, source) => {
			const slug = str(args, "slug");
			const item = (await source.catalog()).find((entry) => entry.slug === slug);
			if (!item)
				return text(`No component with slug "${slug}". Use search_components.`, true);
			return text((await source.markdown(item)) ?? `See ${markdownUrl(item)}`);
		},
	},
	{
		name: "get_install_command",
		description:
			"The @baby-ui/cli command that adds one or more components to a React or Svelte project; it reads framework and TS/JS from components.json. Pro components install from the account page instead.",
		inputSchema: {
			type: "object",
			properties: {
				slugs: { type: "array", items: { type: "string" }, minItems: 1 },
				packageManager: { type: "string", enum: [...PMS], default: "npm" },
			},
			required: ["slugs"],
		},
		run: async (args, source) => {
			const slugs = list(args, "slugs");
			if (!slugs.length) return text("`slugs` needs at least one slug.", true);
			const catalog = await source.catalog();
			const unknown = slugs.filter((slug) => !catalog.some((item) => item.slug === slug));
			if (unknown.length) return text(`Unknown slugs: ${unknown.join(", ")}.`, true);
			const pro = slugs.filter(
				(slug) => catalog.find((item) => item.slug === slug)?.tier === "pro",
			);
			const free = slugs.filter((slug) => !pro.includes(slug));
			const requested = str(args, "packageManager");
			const pm = isPm(requested) ? requested : "npm";
			const out = free.length ? [pmCommand("dlx", installArgs(free), pm)] : [];
			if (pro.length)
				out.push(
					`Pro (install from ${origins.site}/account after purchase): ${pro.join(", ")}`,
				);
			return text(out.join("\n"));
		},
	},
];

export const MCP_INSTRUCTIONS =
	"Baby UI is a React and Svelte component library installed as source through @baby-ui/cli. " +
	"Search or list components, read get_component before choosing one (it names what to use instead), " +
	"then install with get_install_command. Style through variant, size and className/class; never fork a component.";

/** Runs a tool by name, reporting an unknown name or a thrown error as a tool error. */
export async function runTool(
	name: string,
	args: Args,
	source: ToolSource,
): Promise<ToolResult> {
	const tool = SITE_TOOLS.find((entry) => entry.name === name);
	if (!tool) return text(`Unknown tool "${name}".`, true);
	try {
		return await tool.run(args, source);
	} catch (error) {
		return text(
			`Tool failed: ${error instanceof Error ? error.message : String(error)}`,
			true,
		);
	}
}
