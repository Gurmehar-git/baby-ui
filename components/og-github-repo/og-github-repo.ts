import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ogGithubRepo as ogGithubRepoVariants } from "./react/variants";

const MODES = ["light", "dark"];
const TONES = ["chart", "primary", "neutral"];

export const ogGithubRepo = defineComponent({
	slug: "og-github-repo",
	name: "OG GitHub Repo",
	description:
		"A 1200x630 repository card: owner and name, description, language, star/fork/issue counts, a contributor stack and an activity grid, rendered to PNG with takumi.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: variantsOf(ogGithubRepoVariants, ["mode", "tone"]),
	props: [
		{
			name: "owner",
			type: "string",
			description: "Account or organisation, above the name.",
			required: true,
			default: "kanakkholwal",
			control: { kind: "text" },
		},
		{
			name: "name",
			type: "string",
			description: "Repository name, the focal line; clamps to two lines.",
			required: true,
			default: "baby-ui",
			control: { kind: "text" },
		},
		{
			name: "description",
			type: "string",
			description: "Repository description; clamps to two lines.",
			default: "Motion-first components for React and Svelte, drop-in with shadcn.",
			control: { kind: "text" },
		},
		{
			name: "language",
			type: "string",
			description: "Primary language beside a tone-coloured dot.",
			default: "TypeScript",
			control: { kind: "text" },
		},
		{
			name: "stars",
			type: "string",
			description: 'Pre-formatted count, e.g. "12.4k".',
			control: { kind: "none" },
		},
		{
			name: "forks",
			type: "string",
			description: "Pre-formatted count.",
			control: { kind: "none" },
		},
		{
			name: "issues",
			type: "string",
			description: "Pre-formatted open issue count.",
			control: { kind: "none" },
		},
		{
			name: "contributors",
			type: "string[]",
			description: "Contributor avatar URLs; the first five overlap.",
			control: { kind: "none" },
		},
		{
			name: "contributorCount",
			type: "string",
			description: 'Pre-formatted overflow chip, e.g. "+128".',
			control: { kind: "none" },
		},
		{
			name: "avatar",
			type: "string",
			description: "Owner avatar URL.",
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
			description: "Colour of the activity grid and language dot.",
			default: "chart",
			control: { kind: "select", options: TONES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static image; nothing moves.",
		behaviour: [
			"Fixed 1200x630 canvas built only from flex layout and theme tokens, so takumi renders it the same as the browser.",
			"The activity grid is a fixed decorative pattern, not repository data.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rendered to an image: give the meta tag a matching og:image:alt, usually owner/name and the description.",
		],
	},
	impl: {
		react: {
			entry: "OgGithubRepo",
		},
		svelte: {
			entry: "OgGithubRepo",
		},
	},
	keywords: [
		"og",
		"open graph",
		"social card",
		"github",
		"repository",
		"open source",
		"takumi",
		"image",
	],
});
