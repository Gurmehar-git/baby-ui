import { defineComponent } from "@baby-ui/registry-schema";

export const typography = defineComponent({
	slug: "typography",
	name: "Typography",
	description: "Text scale with the right element for each visual level.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "variant",
			type: '"h1" | "h2" | "h3" | "body" | "lead" | "small" | "muted" | "code"',
			description: "Visual level, which also picks the default element.",
			default: "body",
			control: {
				kind: "select",
				options: ["h1", "h2", "h3", "body", "lead", "small", "muted", "code"],
			},
		},
		{
			name: "as",
			type: "string",
			description: "Override the rendered element without changing the look.",
			control: { kind: "none" },
		},
	],
	a11y: {
		keyboard: [],
		notes: [
			"`variant` picks the element as well as the style, so the document outline matches what is on screen by default.",
			"Use `as` when the outline and the visual level genuinely differ, which is rarer than it seems.",
		],
	},
	licenseOrigin: {
		source: "sivir-ui",
		url: "https://github.com/aidan-neel/sivir-ui",
		license: "MIT",
		copyright: "Copyright (c) 2026 Aidan Neel",
	},
	impl: {
		react: {
			entry: "Typography",
			files: [
				{ path: "typography/typography.tsx", type: "registry:ui" },
				{ path: "typography/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "Typography",
			files: [
				{ path: "typography/typography.svelte", type: "registry:ui" },
				{ path: "typography/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["typography"],
});
