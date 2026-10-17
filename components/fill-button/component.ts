import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { fillButton as fillButtonVariants } from "./variants";

const TONES = ["soft", "outline"];
const SIZES = ["sm", "md", "lg"];

export const fillButton = defineComponent({
	slug: "fill-button",
	name: "Fill Button",
	description:
		"A call to action whose icon tile expands into a full fill on hover, swapping the label as it goes.",
	category: "advanced",
	status: "stable",
	variants: variantsOf(fillButtonVariants, ["tone", "size"]),
	props: [
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description:
				"Base surface: a primary tint, or the page background with a border. The fill is always --primary.",
			default: "soft",
			control: { kind: "select", options: TONES },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Height, tile size and type scale.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "href",
			type: "string",
			description: "Renders an anchor instead of a button.",
			control: { kind: "none" },
		},
		{
			name: "icon",
			type: "ReactNode | Snippet",
			description: "Icon inside the tile. Defaults to an arrow.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Every transition drops to an instant state swap; hover still shows the filled state.",
		behaviour: [
			"The fill is always full size and clip-path reveals it, so only transform, opacity and clip-path animate.",
			"The icon rides a full-width track that translates by its own width minus the tile, landing on the far edge.",
			"Leaving hover or focus reverses every transition, so the exit mirrors the entrance.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Tab"], action: "Focuses it and plays the fill" },
			{
				keys: ["Enter", "Space"],
				action: "Activates (Space only when it renders as a button)",
			},
		],
		notes: [
			"The label on the fill is an aria-hidden copy, so the accessible name is read once.",
			"Keyboard focus shows the same filled state as hover, plus the standard focus ring.",
		],
	},
	impl: {
		react: {
			entry: "FillButton",
		},
		svelte: {
			entry: "FillButton",
		},
	},
	keywords: ["button", "cta", "hover", "fill", "arrow"],
});
