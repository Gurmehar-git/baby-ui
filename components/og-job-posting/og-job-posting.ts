import { defineComponent } from "@baby-ui/registry-schema";

const MODES = ["light", "dark"];
const TONES = ["neutral", "chart", "primary"];
const union = (values: string[]) => values.map((v) => `"${v}"`).join(" | ");

export const ogJobPosting = defineComponent({
	slug: "og-job-posting",
	name: "OG Job Posting",
	description:
		"A 1200x630 hiring card: company logo, hiring pill, team, role title and a strip with location, salary and contract.",
	category: "og-images",
	demo: { mode: "auto", frame: "og" },
	status: "beta",
	variants: { mode: MODES, tone: TONES },
	props: [
		{
			name: "title",
			type: "string",
			description: "Role title, the headline; clamps to two lines.",
			required: true,
			default: "Senior Product Designer",
			control: { kind: "text" },
		},
		{
			name: "company",
			type: "string",
			description: "Company name beside the logo.",
			required: true,
			default: "Acme",
			control: { kind: "text" },
		},
		{
			name: "badge",
			type: "string",
			description: "Pill, top right.",
			default: "We're hiring",
			control: { kind: "text" },
		},
		{
			name: "team",
			type: "string",
			description: "Above the role, in the tone colour.",
			default: "Design team",
			control: { kind: "text" },
		},
		{
			name: "location",
			type: "string",
			description: "First strip cell.",
			default: "Remote, EU",
			control: { kind: "text" },
		},
		{
			name: "remote",
			type: "boolean",
			description: "Swaps the location pin for a globe.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "salary",
			type: "string",
			description: "Pre-formatted range, so the card never guesses a currency.",
			default: "$160k to $200k",
			control: { kind: "text" },
		},
		{
			name: "employment",
			type: "string",
			description: 'e.g. "Full-time".',
			default: "Full-time",
			control: { kind: "text" },
		},
		{
			name: "logo",
			type: "string",
			description: "Company logo URL in the tile.",
			control: { kind: "none" },
		},
		{
			name: "mode",
			type: union(MODES),
			description: "Light or dark card, independent of the page theme.",
			default: "light",
			control: { kind: "select", options: MODES },
		},
		{
			name: "tone",
			type: union(TONES),
			description: "Colour of the rings, pill, team and strip icons.",
			default: "neutral",
			control: { kind: "select", options: TONES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static image; nothing moves.",
		behaviour: [
			"Fixed 1200x630 canvas built only from flex layout and theme tokens, so takumi renders it the same as the browser.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rendered to an image: give the meta tag a matching og:image:alt, e.g. role and company.",
		],
	},
	impl: {
		react: {
			entry: "OgJobPosting",
			files: [
				{ path: "og-job-posting/og-job-posting.tsx", type: "registry:ui" },
				{ path: "og-job-posting/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "OgJobPosting",
			files: [
				{ path: "og-job-posting/og-job-posting.svelte", type: "registry:ui" },
				{ path: "og-job-posting/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: [
		"og",
		"open graph",
		"social card",
		"job",
		"hiring",
		"careers",
		"takumi",
		"image",
	],
});
