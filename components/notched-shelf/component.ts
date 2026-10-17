import { defineComponent } from "@baby-ui/registry-schema";

export const notchedShelf = defineComponent({
	slug: "notched-shelf",
	name: "Notched Shelf",
	description:
		"A bar that hangs from or rises into an edge on two curved wings, for tabs, navbars and back-to-top notches.",
	category: "blocks",
	status: "stable",
	props: [
		{
			name: "children",
			type: "ReactNode",
			description: "What sits on the bar: a label, a link, a whole nav row.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: '"solid" | "muted" | "inverse" | "outline"',
			description:
				"Solid fills with the page surface it bridges into; outline draws only the hairline silhouette.",
			default: "solid",
			control: { kind: "select", options: ["solid", "muted", "inverse", "outline"] },
		},
		{
			name: "layout",
			type: '"hanging" | "rising"',
			description: "Drop from a top edge, or grow up from a bottom edge.",
			default: "hanging",
			control: { kind: "select", options: ["hanging", "rising"] },
		},
		{
			name: "size",
			type: '"sm" | "default" | "lg"',
			description:
				"Bar height; the wings keep their aspect, so depth and width scale with it.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg"] },
		},
		{
			name: "shape",
			type: '"smooth" | "soft" | "sharp"',
			description:
				"Wing curve: Recast's eased shoulder, a plain S-curve, or a straight chamfer.",
			default: "smooth",
			control: { kind: "select", options: ["smooth", "soft", "sharp"] },
		},
		{
			name: "align",
			type: '"start" | "center" | "end"',
			description:
				"Where along the edge the shelf sits. Start and end inset past a rounded corner.",
			default: "center",
			control: { kind: "select", options: ["start", "center", "end"] },
			showWhen: { edge: [false] },
		},
		{
			name: "edge",
			type: "boolean",
			description: "Continue the hairline along the rest of the edge, full width.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "fill",
			type: "string",
			description:
				"Text colour class overriding the variant's fill, e.g. `text-card` when it bridges into a card.",
			control: { kind: "none" },
		},
		{
			name: "stroke",
			type: "string",
			description: "Stroke colour class overriding the variant's hairline.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Nothing animates; the shelf is static geometry.",
		behaviour: [
			"The bar and wings paint in `currentColor`, so one text colour class themes the whole silhouette in light and dark.",
			"A hairline traces the wing curve, so the shape still reads where the fill matches the surface behind it.",
		],
	},
	a11y: {
		notes: [
			"The wings and edge lines are aria-hidden SVG; only the children reach assistive tech.",
		],
	},
	impl: {
		react: {
			entry: "NotchedShelf",
		},
		svelte: {
			entry: "NotchedShelf",
		},
	},
	keywords: [
		"notch",
		"shelf",
		"tab",
		"navbar",
		"footer",
		"back to top",
		"shape",
		"recast",
	],
});
