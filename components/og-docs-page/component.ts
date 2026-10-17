import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ogDocsPage as ogDocsPageVariants } from "./variants";

const MODES = ["light", "dark"];
const TONES = ["neutral", "chart", "primary"];
const MOTIFS = ["code", "terminal"];

export const ogDocsPage = defineComponent({
	slug: "og-docs-page",
	name: "OG Docs Page",
	description:
		"A 1200x630 documentation card: breadcrumb, page title, description and a code or terminal window, rendered to PNG with takumi.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: variantsOf(ogDocsPageVariants, ["mode", "tone", "motif"]),
	props: [
		{
			name: "title",
			type: "string",
			description: "Page title; clamps to three lines.",
			required: true,
			default: "Dialog",
			control: { kind: "text" },
		},
		{
			name: "site",
			type: "string",
			description: "Docs site name, top left.",
			required: true,
			default: "baby ui",
			control: { kind: "text" },
		},
		{
			name: "description",
			type: "string",
			description: "Short summary under the title; clamps to three lines.",
			default:
				"A modal surface that grows from its trigger and hands focus back on close.",
			control: { kind: "text" },
		},
		{
			name: "section",
			type: "string[]",
			description:
				"Breadcrumb trail above the title; the last entry takes the tone colour.",
			control: { kind: "none" },
		},
		{
			name: "snippet",
			type: "string[]",
			description:
				"Up to eight window lines. `//` and `#` lines dim in code; `$ ` lines get a prompt in terminal. Placeholder bars when omitted.",
			control: { kind: "none" },
		},
		{
			name: "filename",
			type: "string",
			description: "Label in the window's title bar.",
			control: { kind: "none" },
		},
		{
			name: "logo",
			type: "string",
			description: "Site logo URL beside the name.",
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
			description: "Colour of the current breadcrumb, prompt and placeholder accents.",
			default: "neutral",
			control: { kind: "select", options: TONES },
		},
		{
			name: "motif",
			type: MOTIFS.map((v) => `"${v}"`).join(" | "),
			description:
				"Editor window with line numbers, or an always-dark terminal with prompts.",
			default: "code",
			control: { kind: "select", options: MOTIFS },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static image; nothing moves.",
		behaviour: [
			"Fixed 1200x630 canvas built only from flex layout and theme tokens, so takumi renders it the same as the browser.",
			"The terminal motif scopes dark tokens to the window, so it stays dark on a light card.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rendered to an image: give the meta tag a matching og:image:alt, usually the page title.",
		],
	},
	impl: {
		react: {
			entry: "OgDocsPage",
		},
		svelte: {
			entry: "OgDocsPage",
		},
	},
	keywords: [
		"og",
		"open graph",
		"social card",
		"docs",
		"documentation",
		"code",
		"takumi",
		"image",
	],
});
