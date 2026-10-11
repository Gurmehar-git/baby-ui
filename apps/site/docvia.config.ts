import { ComponentDocRequiredSchema } from "@baby-ui/registry-schema";
import { defineConfig } from "@docvia/core";
import { createSvelteRenderer } from "@docvia/core/svelte/node";

export default defineConfig({
	sourceDir: "src/docs",
	outDir: ".docvia",
	collections: [
		{
			name: "components",
			sourceDir: "src/docs/components",
			baseUrl: "/components",
			frontmatter: ComponentDocRequiredSchema,
		},
		{ name: "guides", sourceDir: "src/docs/guides", baseUrl: "/docs" },
		// Pro prose lives in the private submodule; public checkouts get an empty collection.
		{
			name: "pro",
			sourceDir: "../../pro/docs/components",
			baseUrl: "/components",
			frontmatter: ComponentDocRequiredSchema,
			optional: true,
		},
	],

	// Registering these is what fills `virtual:docvia/registry`.
	components: {
		"button-demo": {
			path: "../../packages/demos/src/svelte/button-demo.svelte",
			hydrate: true,
		},
		"code-block": {
			path: "./src/lib/components/code-block.svelte",
			hydrate: true,
		},
		"code-group": {
			path: "./src/lib/components/code-group.svelte",
			hydrate: true,
		},
	},
	// docs-nodes.ts swaps fences for CodeBlock/CodeGroup, so they can't merge into static html.
	renderer: createSvelteRenderer({ staticHtml: { keepTags: ["pre"] } }),
});
