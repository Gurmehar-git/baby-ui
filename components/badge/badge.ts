import { defineComponent } from "@baby-ui/registry-schema";

const VARIANTS = [
	"default",
	"secondary",
	"outline",
	"success",
	"warning",
	"destructive",
	"info",
	"gold",
];

export const badge = defineComponent({
	slug: "badge",
	name: "Badge",
	description:
		"Compact status label with semantic colour variants and an optional leading dot.",
	category: "base",
	status: "stable",
	variants: { variant: VARIANTS, size: ["sm", "default", "lg", "xl"] },
	props: [
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"Semantic colour. `success`, `warning` and `destructive` carry meaning, not decoration; `gold` marks premium items with a passing shine.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: '"sm" | "default" | "lg" | "xl"',
			description: "Height and horizontal padding.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg", "xl"] },
		},
		{
			name: "dot",
			type: "boolean",
			description: "Show a leading dot tinted to the variant.",
			default: false,
			control: { kind: "boolean" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "`gold` keeps its tint and drops the shine.",
		behaviour: [
			"`gold`: a highlight sweeps across in about 1.4s, then rests before the next pass.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"A badge is not interactive and takes no role; if its colour is the only carrier of meaning, repeat that meaning in the text.",
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
			entry: "Badge",
			files: [
				{ path: "badge/badge.tsx", type: "registry:ui" },
				{ path: "badge/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "Badge",
			files: [
				{ path: "badge/badge.svelte", type: "registry:ui" },
				{ path: "badge/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["badge", "tag", "status", "label", "chip"],
});
