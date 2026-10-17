import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ogPodcastEpisode as ogPodcastEpisodeVariants } from "./variants";

const MODES = ["light", "dark"];
const TONES = ["neutral", "chart", "primary"];
const LAYOUTS = ["left", "right"];
const union = (values: string[]) => values.map((v) => `"${v}"`).join(" | ");

export const ogPodcastEpisode = defineComponent({
	slug: "og-podcast-episode",
	name: "OG Podcast Episode",
	description:
		"A 1200x630 podcast episode card: cover art on a record sleeve, show, episode number, title, guest and a waveform player, rendered to PNG with takumi.",
	category: "og-images",
	demo: { mode: "auto", frame: "og" },
	status: "stable",
	variants: variantsOf(ogPodcastEpisodeVariants, ["mode", "tone", "layout"]),
	props: [
		{
			name: "title",
			type: "string",
			description: "Episode title; clamps to three lines.",
			required: true,
			default: "Why every design system rewrites its tokens",
			control: { kind: "text" },
		},
		{
			name: "show",
			type: "string",
			description: "Show name above the title.",
			required: true,
			default: "Tokens and Tea",
			control: { kind: "text" },
		},
		{
			name: "episode",
			type: "string",
			description: 'Pre-formatted pill beside the show, e.g. "EP 142".',
			default: "EP 142",
			control: { kind: "text" },
		},
		{
			name: "duration",
			type: "string",
			description: 'Pre-formatted, right of the waveform, e.g. "48:12".',
			default: "48:12",
			control: { kind: "text" },
		},
		{
			name: "cover",
			type: "string",
			description: "Cover art URL; a mic mark fills the sleeve when omitted.",
			control: { kind: "none" },
		},
		{
			name: "guest",
			type: "{ name: string; avatar?: string }",
			description: "Guest line under the title; the avatar is an image URL.",
			control: { kind: "none" },
		},
		{
			name: "peaks",
			type: "number[]",
			description:
				"Waveform bar heights from 0 to 1; a static motif is drawn when omitted.",
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
			description: "Colour of the glow, record label, play button and waveform.",
			default: "neutral",
			control: { kind: "select", options: TONES },
		},
		{
			name: "layout",
			type: union(LAYOUTS),
			description: "Which side the cover art sits on.",
			default: "left",
			control: { kind: "select", options: LAYOUTS },
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
			"Rendered to an image: give the meta tag a matching og:image:alt, usually the show and title.",
		],
	},
	impl: {
		react: {
			entry: "OgPodcastEpisode",
		},
		svelte: {
			entry: "OgPodcastEpisode",
		},
	},
	keywords: [
		"og",
		"open graph",
		"social card",
		"podcast",
		"episode",
		"waveform",
		"takumi",
	],
});
