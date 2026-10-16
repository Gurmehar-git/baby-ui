import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { expandableCard as expandableCardVariants } from "./react/variants";

const SIZES = ["sm", "default"];
const VARIANTS = ["default", "outline"];

export const expandableCard = defineComponent({
	slug: "expandable-card",
	name: "Expandable Card",
	description:
		"A card that opens in place: width and height grow together, the details fade in once there is room, and Escape closes it back to the header.",
	category: "advanced",
	status: "stable",
	variants: variantsOf(expandableCardVariants, ["variant", "size"]),
	props: [
		{
			name: "title",
			type: "string",
			description: "The header line.",
			required: true,
			control: { kind: "text" },
		},
		{
			name: "description",
			type: "string",
			description: "A summary under the title; changed words rise in when it updates.",
			control: { kind: "text" },
		},
		{
			name: "open",
			type: "boolean",
			description:
				"Whether the details show, paired with `onOpenChange`; bindable in Svelte. `defaultOpen` seeds it.",
			control: { kind: "none" },
		},
		{
			name: "width",
			type: "number",
			description:
				"Closed width cap in px; never wider than the container. Fills it when omitted.",
			control: { kind: "none" },
		},
		{
			name: "expandedWidth",
			type: "number",
			description:
				"Open width cap in px, so the card can grow sideways. Defaults to `width`.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "A resting shadow, or a flat bordered card.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Header height and padding.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The card opens and closes at once.",
		behaviour: [
			"Width springs between `width` and `expandedWidth` while the panel's height opens through a grid row, so nothing stretches.",
			"The details keep the open width throughout, so they never reflow as the box moves.",
			"Changed words in the description rise in; unchanged words hold still.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Enter", "Space"], action: "Open or close" },
			{ keys: ["Escape"], action: "Close and return focus to the header" },
		],
		notes: [
			"Built on the collapsible primitive: the header is a button with aria-expanded and aria-controls.",
			"Closed details are inert, so they stay out of the tab order.",
		],
	},
	guidance: {
		when: [
			"Summaries that reveal details in place: an order, a deployment, a plan, a settings group.",
			"Dashboards where a card should grow into nearby space when opened.",
		],
		whenNot: [
			{ text: "Several sections where only one opens at a time.", use: "accordion" },
			{ text: "A bare disclosure without card chrome.", use: "collapsible" },
			{ text: "Details that need the whole screen.", use: "dialog" },
		],
		responsive: [
			"Caps are in px but never exceed the container; on phones the card fills the width in both states.",
		],
		performance: ["Width and height are CSS transitions; nothing is measured on open."],
		ai: [
			"Keep `description` to one short line, such as a status or count, so the rolling words read well.",
			"Set `expandedWidth` larger than `width` only when the layout has room for the card to grow.",
		],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "ExpandableCard",
		},
		svelte: {
			entry: "ExpandableCard",
		},
	},
	keywords: ["card", "expand", "disclosure", "collapsible", "details"],
});
