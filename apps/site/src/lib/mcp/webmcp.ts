import type { CatalogItem } from "#lib/registry.js";
import { goto } from "$app/navigation";
import { runTool, SITE_TOOLS, type ToolResult, type ToolSource } from "./tools";

let catalog: Promise<CatalogItem[]> | null = null;

// The browser reads the same prerendered files a visitor would: the catalog and each `.md` twin.
const source: ToolSource = {
	catalog: () => {
		catalog ??= fetch("/catalog.json").then((res) => res.json());
		catalog.catch(() => {
			catalog = null;
		});
		return catalog;
	},
	markdown: async (item) => {
		const res = await fetch(`${item.href}.md`);
		return res.ok ? res.text() : null;
	},
};

const reply = (text: string, isError = false): ToolResult => ({
	content: [{ type: "text", text }],
	...(isError ? { isError } : {}),
});

/** Offers the site's tools to an in-browser agent through WebMCP, where the browser supports it. */
export function provideWebMcp() {
	const context = navigator.modelContext;
	if (!context) return;
	context.provideContext({
		tools: [
			...SITE_TOOLS.map(({ name, description, inputSchema }) => ({
				name,
				description,
				inputSchema,
				annotations: { readOnlyHint: true },
				execute: (input: Record<string, unknown>) => runTool(name, input, source),
			})),
			{
				name: "open_component",
				description:
					"Open a component's page on this site, where its live preview and controls are.",
				inputSchema: {
					type: "object",
					properties: { slug: { type: "string" } },
					required: ["slug"],
				},
				annotations: { readOnlyHint: false },
				execute: async (input: Record<string, unknown>) => {
					const item = (await source.catalog()).find(
						(entry) => entry.slug === input.slug,
					);
					if (!item)
						return reply(`No component with slug "${String(input.slug)}".`, true);
					await goto(item.href);
					return reply(`Opened ${item.name}.`);
				},
			},
		],
	});
}
