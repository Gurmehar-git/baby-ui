import { defineComponent } from "@baby-ui/registry-schema";

export const separator = defineComponent({
	slug: "separator",
	name: "Separator",
	description:
		"A hairline between groups of content, horizontal or vertical, solid or dashed.",
	category: "base",
	status: "stable",
	variants: { variant: ["solid", "dashed"] },
	props: [
		{
			name: "variant",
			type: '"solid" | "dashed"',
			description: "Line style.",
			default: "solid",
			control: { kind: "select", options: ["solid", "dashed"] },
		},
		{
			name: "orientation",
			type: '"horizontal" | "vertical"',
			description:
				"Direction of the line. A vertical separator stretches to its row's height.",
			default: "horizontal",
			control: { kind: "none" },
		},
		{
			name: "decorative",
			type: "boolean",
			description: "Hide from assistive tech when the line is purely visual.",
			default: false,
			control: { kind: "none" },
		},
	],
	a11y: {
		role: "separator",
		keyboard: [],
		notes: [
			"Renders role=separator with aria-orientation. Set `decorative` when the line carries no meaning, so screen readers skip it.",
		],
	},
	licenseOrigin: {
		source: "shadcn/ui",
		url: "https://github.com/shadcn-ui/ui",
		license: "MIT",
		copyright: "Copyright (c) 2023 shadcn",
	},
	impl: {
		react: {
			entry: "Separator",
			files: [
				{ path: "separator/separator.tsx", type: "registry:ui" },
				{ path: "separator/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "@base-ui/react"],
		},
		svelte: {
			entry: "Separator",
			files: [
				{ path: "separator/separator.svelte", type: "registry:ui" },
				{ path: "separator/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "bits-ui"],
		},
	},
	keywords: ["separator", "divider", "hr", "rule"],
});
