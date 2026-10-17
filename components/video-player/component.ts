import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { videoPlayer as videoPlayerVariants } from "./variants";

const VARIANTS = ["default", "overlay", "cinema", "minimal"];

export const videoPlayer = defineComponent({
	slug: "video-player",
	name: "Video Player",
	description:
		"A composable video player on media-chrome with HLS, speed, quality and volume menus, buffering and error states, and every playback value controllable.",
	category: "base",
	status: "beta",
	variants: variantsOf(videoPlayerVariants, ["variant"]),
	props: [
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"`default` insets the video in a grey card with controls underneath; `overlay` floats a frosted pill over the video; `cinema` puts a full-width scrubber over a control row on a bottom scrim; `minimal` drops the card. `overlay` and `cinema` hide their controls during untouched playback.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "playing",
			type: "boolean",
			description:
				"Controlled play state (`bind:playing` in Svelte, `defaultPlaying` + `onPlayingChange` in React).",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "currentTime",
			type: "number",
			description:
				"Controlled playhead in seconds; moving it further than half a second seeks the video.",
			default: 0,
			control: { kind: "none" },
		},
		{
			name: "volume",
			type: "number",
			description: "Controlled volume, 0 to 1.",
			default: 1,
			control: { kind: "number", min: 0, max: 1, step: 0.1 },
		},
		{
			name: "muted",
			type: "boolean",
			description: "Controlled mute. Browsers only autoplay muted video.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "loop",
			type: "boolean",
			description: "Controlled loop, also toggled by `VideoPlayerLoopButton`.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "playbackRate",
			type: "number",
			description: "Controlled speed multiplier.",
			default: 1,
			control: { kind: "select", options: ["0.5", "1", "1.5", "2"] },
		},
		{
			name: "quality",
			type: "number",
			description:
				"Controlled HLS rendition index, `-1` for automatic. `VideoPlayerQuality` lists the stream's renditions.",
			default: -1,
			control: { kind: "none" },
		},
		{
			name: "onError",
			type: '(error: "network" | "decode" | "source" | "unknown") => void',
			description:
				"Fires when playback fails; `VideoPlayerError` shows the matching message and a retry.",
			control: { kind: "none" },
		},
		{
			name: "when",
			type: '"ended" | "idle" | "paused"',
			description:
				"VideoPlayerEndScreen: opens after the video ends, before the first play, or whenever paused. `open` overrides it.",
			default: "ended",
			control: { kind: "select", options: ["ended", "idle", "paused"] },
		},
		{
			name: "rates",
			type: "number[]",
			description: "VideoPlayerPlaybackRate: the speeds offered.",
			default: "[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]",
			control: { kind: "none" },
		},
		{
			name: "remaining",
			type: "boolean",
			description: "VideoPlayerTimeDisplay: shows time left instead of time elapsed.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "size",
			type: '"default" | "lg"',
			description:
				"VideoPlayerPlayButton: `lg` is a round play control centred over the video, for use inside the viewport.",
			default: "default",
			control: { kind: "none" },
		},
		{
			name: "showDuration",
			type: "boolean",
			description:
				"VideoPlayerTimeDisplay: appends the total length after the elapsed time.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "seekOffset",
			type: "number",
			description: "Seek buttons: seconds to jump.",
			default: 10,
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Icons cross-fade without scaling or blurring, the loop and seek arrows stop turning, the overlay pill fades without sliding and the spinner holds still.",
		behaviour: [
			"Play and pause, mute levels and fullscreen glyphs stay mounted and cross-fade with a scale and blur, so a state change never pops.",
			"Each changed character of the time readout rises into place as playback moves or the scrubber jumps.",
			"Speed, quality and volume open as popovers above their trigger; the open trigger stays tinted and the control row stays up while a menu is open.",
			"Play turns into replay once the video ends; the speed and quality labels tick when they change.",
			"The end screen fades in over a blur with its content lifting into place, and fades back out on replay.",
			"After half a second of buffering a spinner fades in over the video; a failure covers it with the reason and a retry.",
			"The scrubber track thickens on hover and its thumb grows, then squeezes while dragged.",
			"The loop arrows turn over when looping switches on and back when it switches off.",
			"Seek arrows twist toward their direction while pressed; every button presses down.",
			"The large play button scales down and fades out once playback starts.",
			"`overlay` and `cinema`: the controls slide down and fade after a moment of pointer inactivity during playback, and return on pointer movement, hover, focus or an open menu.",
		],
	},
	a11y: {
		role: "region",
		keyboard: [
			{ keys: ["Tab"], action: "Reaches every control in the bar" },
			{ keys: ["Space", "Enter"], action: "Activates the focused button" },
			{ keys: ["Arrow keys"], action: "Steps the focused scrubber or volume slider" },
			{ keys: ["Space", "K"], action: "With the video focused, toggles play" },
			{ keys: ["M"], action: "Mutes" },
			{ keys: ["F"], action: "Toggles fullscreen" },
			{ keys: ["Arrow Left", "Arrow Right"], action: "Seek" },
		],
		notes: [
			"Media-chrome owns playback wiring, focus, hotkeys and the buttons' accessible names, which follow their state.",
			"Speed and quality are radio groups inside labelled popovers; arrow keys move the choice.",
			"Volume is a vertical slider in a popover, with a mute toggle that reports `aria-pressed`.",
			"The loading spinner carries a polite status region; the error overlay is an alert.",
			"The loop button is a toggle with `aria-pressed`.",
			"Captions are `<track>` children of `VideoPlayerContent`; nothing here adds captions on its own.",
		],
	},
	impl: {
		react: {
			entry: "VideoPlayer",
		},
		svelte: {
			entry: "VideoPlayer",
		},
	},
	keywords: ["video", "player", "media", "playback", "hls", "scrubber", "media-chrome"],
});
