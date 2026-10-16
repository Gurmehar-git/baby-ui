import { defineComponent } from "@baby-ui/registry-schema";

const MODES = ["light", "dark"];
const TONES = ["neutral", "chart", "primary"];

export const ogNewsletterIssue = defineComponent({
	slug: "og-newsletter-issue",
	name: "OG Newsletter Issue",
	description:
		"A 1200x630 editorial newsletter cover: a masthead over a hairline rule, one large headline and up to three numbered stories, rendered to PNG with takumi.",
	category: "og-images",
	status: "stable",
	variants: { mode: MODES, tone: TONES },
	props: [
		{
			name: "publication",
			type: "string",
			description: "Newsletter name, set small in the masthead.",
			required: true,
			default: "The Render Loop",
			control: { kind: "text" },
		},
		{
			name: "headline",
			type: "string",
			description:
				"Lead story headline, the focal point; clamps to three lines, or two when the list shows.",
			required: true,
			default: "Why every design system eventually rebuilds its tokens",
			control: { kind: "text" },
		},
		{
			name: "issue",
			type: "string",
			description: 'Pre-formatted issue label, e.g. "No. 42".',
			default: "No. 42",
			control: { kind: "text" },
		},
		{
			name: "date",
			type: "string",
			description: "Pre-formatted date, so the card never guesses a locale.",
			default: "Sep 26, 2026",
			control: { kind: "text" },
		},
		{
			name: "inside",
			type: "string[]",
			description:
				"Up to three other stories, numbered under the lead; each clamps to one line.",
			control: { kind: "none" },
		},
		{
			name: "insideLabel",
			type: "string",
			description: "Small label above the numbered list.",
			default: "In this issue",
			control: { kind: "text" },
		},
		{
			name: "logo",
			type: "string",
			description: "Publication logo URL beside the name.",
			control: { kind: "none" },
		},
		{
			name: "mode",
			type: MODES.map((v) => `"${v}"`).join(" | "),
			description: "Light or dark card, independent of the page theme.",
			default: "light",
			control: { kind: "select", options: MODES },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description:
				"Accent for the issue label and list numbers only; the canvas stays plain in every tone.",
			default: "neutral",
			control: { kind: "select", options: TONES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static image; nothing moves.",
		behaviour: [
			"Fixed 1200x630 canvas built only from flex layout and theme tokens, so takumi renders it the same as the browser.",
			"`mode` scopes the dark tokens to the card itself, so a dark card renders from a light page and vice versa.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rendered to an image: give the meta tag a matching og:image:alt, usually the lead headline.",
		],
	},
	impl: {
		react: {
			entry: "OgNewsletterIssue",
			files: [
				{ path: "og-newsletter-issue/og-newsletter-issue.tsx", type: "registry:ui" },
				{ path: "og-newsletter-issue/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "OgNewsletterIssue",
			files: [
				{ path: "og-newsletter-issue/og-newsletter-issue.svelte", type: "registry:ui" },
				{ path: "og-newsletter-issue/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["og", "open graph", "social card", "newsletter", "email", "takumi", "image"],
});
