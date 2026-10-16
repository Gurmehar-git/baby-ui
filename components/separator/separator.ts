import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { separator as separatorVariants } from "./react/variants";

export const separator = defineComponent({
	slug: "separator",
	name: "Separator",
	description:
		"A hairline between groups of content, horizontal or vertical, solid or dashed.",
	category: "base",
	status: "stable",
	variants: variantsOf(separatorVariants, ["variant"]),
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
		},
		svelte: {
			entry: "Separator",
		},
	},
	keywords: ["separator", "divider", "hr", "rule"],
});
