import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ctaSection as ctaSectionVariants } from "./variants";

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
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"CtaSection: a closing section, copy beside CtaSectionVisual, or a single-line banner.",
			default: "centered",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "open",
			type: "boolean",
			description:
				"CtaSection, banner: shown or folded away. Controlled with onOpenChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "children",
			type: "ReactNode | Snippet",
			description:
				"CtaSection: CtaSectionContent (CtaSectionTitle, CtaSectionDescription, CtaSectionPoints, CtaSectionActions, CtaSectionNote), then CtaSectionVisual in split; the banner puts CtaSectionActions with CtaSectionDismiss beside the content.",
			control: { kind: "none" },
		},
		{
			name: "href",
			type: "string",
			description:
				'CtaSectionAction: renders a link; otherwise a button with onClick. `variant="outline"` makes it the secondary action.',
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
			"One primary CtaSectionAction, at most one outline secondary.",
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
