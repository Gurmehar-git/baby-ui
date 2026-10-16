import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { loadingScreen as loadingScreenVariants } from "./react/variants";

const INDICATORS = ["bar", "spinner", "dots", "none"];
const LOGO_MOTIONS = ["breathe", "none"];
const POSITIONS = ["fixed", "absolute"];

export const loadingScreen = defineComponent({
	slug: "loading-screen",
	name: "Loading Screen",
	description:
		"A full-page or container loading overlay: your logo, an indicator and an optional caption, fading out when done.",
	category: "blocks",
	status: "stable",
	variants: variantsOf(loadingScreenVariants, ["indicator", "logoMotion", "position"]),
	props: [
		{
			name: "logo",
			type: "ReactNode | Snippet",
			description: "Your mark, e.g. an inline SVG. Omit for an indicator-only screen.",
			control: { kind: "none" },
		},
		{
			name: "open",
			type: "boolean",
			description: "Visible while true; false fades it out and makes it inert.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "progress",
			type: "number",
			description: "0-100 for a determinate bar; omit for an indeterminate one.",
			control: { kind: "none" },
		},
		{
			name: "indicator",
			type: INDICATORS.map((v) => `"${v}"`).join(" | "),
			description: "Progress bar, spinner, bouncing dots, or nothing.",
			default: "bar",
			control: { kind: "select", options: INDICATORS },
		},
		{
			name: "logoMotion",
			type: LOGO_MOTIONS.map((v) => `"${v}"`).join(" | "),
			description: "A slow breathe on the logo, or a still logo.",
			default: "breathe",
			control: { kind: "select", options: LOGO_MOTIONS },
		},
		{
			name: "position",
			type: POSITIONS.map((v) => `"${v}"`).join(" | "),
			description:
				"`fixed` covers the page; `absolute` covers the nearest positioned container.",
			default: "fixed",
			control: { kind: "none" },
		},
		{
			name: "caption",
			type: "ReactNode | Snippet",
			description: "Short visible line under the indicator.",
			control: { kind: "none" },
		},
		{
			name: "label",
			type: "string",
			description:
				"Screen-reader status text; the percent is appended when progress is set.",
			default: "Loading",
			control: { kind: "text" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The breathe, dots and bar sweep stop; closing still hides the screen, without the fade.",
		behaviour: [
			"Opening fades in over --duration-overlay; closing fades over --duration-exit, then flips visibility so the hidden screen never blocks clicks.",
			"The bar is the registry Progress: indeterminate until `progress` is set, then it fills.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			'The screen is a single `role="status"` region; its sr-only text carries the label and percent, so progress updates are announced.',
			"A closed screen is `inert`, so nothing inside it can take focus.",
		],
	},
	impl: {
		react: {
			entry: "LoadingScreen",
		},
		svelte: {
			entry: "LoadingScreen",
		},
	},
	keywords: ["loading", "splash", "boot", "overlay", "spinner"],
});
