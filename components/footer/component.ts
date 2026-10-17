import { defineComponent } from "@baby-ui/registry-schema";

export const footer = defineComponent({
	slug: "footer",
	name: "Footer",
	description:
		"Marketing site footer: brand and socials, link columns, legal links, an optional giant wordmark and a notched back-to-top layout, or one minimal row.",
	category: "blocks",
	status: "stable",
	props: [
		{
			name: "columns",
			type: "FooterColumn[]",
			description:
				"Link columns shown beside the brand block. A link's `description` adds a muted second line, e.g. a product's kind.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "brand",
			type: "ReactNode",
			description: "Logo and wordmark slot above the description.",
			control: { kind: "none" },
		},
		{
			name: "description",
			type: "string",
			description: "One line under the brand.",
			control: { kind: "text" },
		},
		{
			name: "socials",
			type: "FooterSocialLink[]",
			description:
				"Links under the description: icon buttons, or text with an arrow when a link has no icon or the layout is notched.",
			default: "[]",
			control: { kind: "none" },
		},
		{
			name: "copyright",
			type: "ReactNode",
			description: "Copyright line under the socials.",
			control: { kind: "none" },
		},
		{
			name: "legal",
			type: "FooterLink[]",
			description: "Policy links beside the copyright.",
			default: "[]",
			control: { kind: "none" },
		},
		{
			name: "actions",
			type: "ReactNode",
			description: "Small controls beside the copyright, e.g. a theme toggle.",
			control: { kind: "none" },
		},
		{
			name: "topHref",
			type: "string",
			description:
				"Target of the notched layout's back-to-top tab. The tab only renders with one.",
			control: { kind: "none" },
		},
		{
			name: "topLabel",
			type: "string",
			description: "Label of the back-to-top tab.",
			default: "Back to top",
			control: { kind: "text" },
			showWhen: { layout: ["notched"] },
		},
		{
			name: "wordmark",
			type: "string",
			description: "Giant animated background text. Omit to skip that section entirely.",
			control: { kind: "text" },
		},
		{
			name: "layout",
			type: '"split" | "centered" | "notched" | "minimal"',
			description:
				"Brand block beside the link columns, centred above them, a rounded top with a notched back-to-top tab, or one quiet row of brand, links and copyright.",
			default: "split",
			control: { kind: "select", options: ["split", "centered", "notched", "minimal"] },
		},
		{
			name: "status",
			type: '{ label: string; href?: string; tone?: "success" | "warning" | "destructive" }',
			description:
				"A system status link with a pulsing dot in its tone, beside the copyright.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The wordmark's sheen stops sweeping and flattens to a two-stop gradient instead of freezing mid-sweep.",
		behaviour: [
			"The wordmark is a `background-clip: text` gradient sweeping left, matching the same shimmer family as Reasoning's own text shimmer.",
		],
	},
	a11y: {
		notes: ["A real <footer> landmark; the wordmark is decorative text, not a heading."],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "Footer",
		},
		svelte: {
			entry: "Footer",
		},
	},
	keywords: ["footer", "site footer", "links", "marketing", "wordmark"],
});
