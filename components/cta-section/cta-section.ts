import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ctaSection as ctaSectionVariants } from "./react/variants";

const VARIANTS = ["centered", "split", "banner"];

export const ctaSection = defineComponent({
	slug: "cta-section",
	name: "CTA Section",
	description:
		"A call to action as a centred closing section, a split layout beside a visual, or a one-line banner that folds away when dismissed.",
	category: "blocks",
	status: "stable",
	variants: variantsOf(ctaSectionVariants, ["variant"]),
	props: [
		{
			name: "title",
			type: "string",
			description: "The heading.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "primaryAction",
			type: "{ label: string; href?: string; onClick?: () => void }",
			description: "The main button; a link when it has an href.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "A closing section, copy beside a `visual`, or a single-line banner.",
			default: "centered",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "secondaryAction",
			type: "CtaAction",
			description: "An outline button beside the primary; not shown in the banner.",
			control: { kind: "none" },
		},
		{
			name: "note",
			type: "string",
			description: "Small print under the actions in the centered variant.",
			control: { kind: "none" },
		},
		{
			name: "avatars",
			type: "{ src: string; alt?: string }[]",
			description: "Up to four faces beside the note in the centered variant.",
			control: { kind: "none" },
		},
		{
			name: "points",
			type: "string[]",
			description: "Benefit lines with a check in the split variant.",
			control: { kind: "none" },
		},
		{
			name: "visual",
			type: "ReactNode | Snippet",
			description: "The split variant's right-hand side.",
			control: { kind: "none" },
		},
		{
			name: "dismissible",
			type: "boolean",
			description: "Banner: adds a dismiss button.",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "open",
			type: "boolean",
			description:
				"Banner: shown or folded away. Controlled with onOpenChange; bindable in Svelte.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The banner disappears without folding; arrows stay still.",
		behaviour: [
			"A dismissed banner folds its row closed on grid rows, so content below rises into place.",
			"The primary arrow leans forward on hover.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"A section labelled by its heading.",
			"A folded banner is inert, so focus never lands in it.",
			"Faces are decorative and hidden from screen readers.",
		],
	},
	guidance: {
		when: ["The end of a landing page, beside a product shot, or a timely announcement."],
		whenNot: [
			{ text: "A site-wide notice that cycles messages.", use: "announcement-bar" },
		],
		responsive: [
			"Actions stack full width in a container under 36rem; split stacks under 48rem.",
		],
		performance: ["No effects or observers; the banner fold is CSS."],
		ai: [
			"One primary action, at most one secondary.",
			"Keep the title under eight words.",
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
			entry: "CtaSection",
		},
		svelte: {
			entry: "CtaSection",
		},
	},
	keywords: ["cta", "call to action", "banner", "marketing", "landing", "section"],
});
