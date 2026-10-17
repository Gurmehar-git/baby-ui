import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { musicPlayer as musicPlayerVariants } from "./variants";

const LAYOUTS = ["vinyl", "compact"];

export const musicPlayer = defineComponent({
	slug: "music-player",
	name: "Music Player",
	description:
		"A record-deck player: the cover spins as a vinyl disc under a tonearm, with seek, transport and volume controls.",
	category: "blocks",
	status: "stable",
	variants: variantsOf(musicPlayerVariants, ["layout"]),
	props: [
		{
			name: "image",
			type: "(props: ImageSlotProps) => ReactNode | Snippet<[ImageSlotProps]>",
			description:
				"Renders each image with `{ src, alt, width?, height?, className?, loading? }`, e.g. through your framework's image component. Defaults to `<img>`.",
			control: { kind: "none" },
		},
		{
			name: "title",
			type: "string",
			description: "Track title.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "artist",
			type: "string",
			description: "Artist line under the title.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "cover",
			type: "string",
			description: "Cover art URL, shown as the record face.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "coverAlt",
			type: "string",
			description: "Alt text for the cover; empty marks it decorative.",
			default: '""',
			control: { kind: "none" },
		},
		{
			name: "duration",
			type: "number",
			description: "Track length in seconds.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "src",
			type: "string",
			description:
				"Audio URL. When set, a hidden `<audio>` follows `playing`, `position` and `volume`; without it the player only renders.",
			control: { kind: "none" },
		},
		{
			name: "playing",
			type: "boolean",
			description:
				"Controlled play state (`bind:playing` in Svelte, `defaultPlaying` + `onPlayingChange` in React).",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "position",
			type: "number",
			description:
				"Controlled playhead in seconds (`bind:position`, or `defaultPosition` + `onPositionChange`).",
			default: 0,
			control: { kind: "none" },
		},
		{
			name: "volume",
			type: "number",
			description:
				"Controlled volume, 0 to 1 (`bind:volume`, or `defaultVolume` + `onVolumeChange`).",
			default: 1,
			control: { kind: "number", min: 0, max: 1, step: 0.1 },
		},
		{
			name: "onPrevious",
			type: "() => void",
			description: "Shows a previous-track button when set.",
			control: { kind: "none" },
		},
		{
			name: "onNext",
			type: "() => void",
			description: "Shows a next-track button when set.",
			control: { kind: "none" },
		},
		{
			name: "layout",
			type: LAYOUTS.map((v) => `"${v}"`).join(" | "),
			description:
				"Vinyl puts a large deck beside or above the controls; compact is a single row with a small spinning disc.",
			default: "vinyl",
			control: { kind: "select", options: LAYOUTS },
		},
		{
			name: "labels",
			type: "Partial<MusicPlayerLabels>",
			description: "Accessible names for every control.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The disc stays still and the tonearm moves without a transition.",
		behaviour: [
			"The disc spins with a CSS animation that pauses in place when `playing` turns false.",
			"The tonearm swings onto the record while playing.",
			"The playhead only moves when the caller (or the `<audio>` element behind `src`) updates `position`.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Space", "Enter"],
				action: "Activates the focused play, skip or mute button",
			},
			{ keys: ["Arrow keys"], action: "Steps the focused seek or volume slider" },
			{ keys: ["Home", "End"], action: "Jumps a slider to its bounds" },
		],
		notes: [
			"Play and mute buttons swap their accessible names with their state.",
			"Seek and volume use the registry Slider, so thumbs carry their own labels and values.",
		],
	},
	licenseOrigin: {
		source: "componentry",
		url: "https://componentry.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Harsh Jadhav",
	},
	impl: {
		react: {
			entry: "MusicPlayer",
		},
		svelte: {
			entry: "MusicPlayer",
		},
	},
	keywords: ["music", "audio", "player", "vinyl", "record", "media"],
});
