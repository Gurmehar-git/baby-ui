import { defineComponent } from "@baby-ui/registry-schema";

const SIZES = ["sm", "md", "lg"];

export const fineTuneCard = defineComponent({
	slug: "fine-tune-card",
	name: "Fine Tune Card",
	description:
		"A compact element inspector on PropertyPanelControls: a layout switch, a slider per number and a type select.",
	category: "advanced",
	status: "stable",
	variants: { size: SIZES },
	props: [
		{
			name: "fields",
			type: "FineTuneField[]",
			description:
				"The tunable numbers, one slider row each; `key` doubles as the row label.",
			control: { kind: "none" },
		},
		{
			name: "options",
			type: "string[]",
			description: "Options offered in the Type select; the row is hidden when empty.",
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "FineTuneCardLabels",
			description: "Prominent copy strings, merged over generic defaults.",
			control: { kind: "none" },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Card's max width.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "id",
			type: "string",
			description:
				"Identifies the subject `fields` describes (an element/layer id). Changing it resets uncontrolled edits, so switching selection doesn't keep showing edits made against the previous subject.",
			control: { kind: "none" },
		},
		{
			name: "state",
			type: "FineTuneState",
			description:
				"Controlled editable state (`layout`/`values`/`type`). Omit to let the card own it.",
			control: { kind: "none" },
		},
		{
			name: "onChange",
			type: "(state: FineTuneState) => void",
			description: "Fired with the full editable state whenever the user edits it.",
			control: { kind: "none" },
		},
		{
			name: "element",
			type: '"button" | "card"',
			description:
				"Demo-only: swaps which element's fields are shown, to exercise switching selection (the real component takes `fields` and `id`, not `element`).",
			default: "button",
			control: { kind: "select", options: ["button", "card"] },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			'The "Edited" pop-in drops and the shimmering "Adjust" label freezes; each control keeps its own reduced-motion rules.',
		behaviour: [
			"Rows are PropertyPanelControls: a segmented layout switch, a Slider per field and a Select for the type.",
			"The header swaps the shimmering Adjust label for an Edited badge once any value leaves its default.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Tab"],
				action: "Reaches the layout segments, each slider and the type select",
			},
			{ keys: ["Arrow keys"], action: "Adjusts a focused slider" },
		],
		notes: [
			"Every row is a real baby-ui control with its own label, so no semantics are reimplemented here.",
		],
	},
	licenseOrigin: {
		source: "beUI",
		url: "https://beui.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 beUI",
	},
	impl: {
		react: {
			entry: "FineTuneCard",
			files: [
				{ path: "fine-tune-card/fine-tune-card.tsx", type: "registry:ui" },
				{ path: "fine-tune-card/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["property-panel"],
		},
		svelte: {
			entry: "FineTuneCard",
			files: [
				{ path: "fine-tune-card/fine-tune-card.svelte", type: "registry:ui" },
				{ path: "fine-tune-card/types.ts", type: "registry:ui" },
				{ path: "fine-tune-card/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["property-panel"],
		},
	},
	keywords: ["inspector", "slider", "number", "properties", "editor"],
});
