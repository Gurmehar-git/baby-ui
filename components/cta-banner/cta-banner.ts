import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ctaBanner as ctaBannerVariants } from "./react/variants";

const VARIANTS = ["grain", "ticker", "spotlight"];
const SIZES = ["sm", "default", "lg"];

export const ctaBanner = defineComponent({
	slug: "cta-banner",
	name: "CTA Banner",
	description:
		"A closing call to action built from parts: a grain surface with drifting icons, inclined rows of a running wordmark, or a dark card lit around the pointer.",
	category: "blocks",
	status: "beta",
	variants: variantsOf(ctaBannerVariants, ["variant", "size"]),
	props: [
		{
			name: "title",
			type: "string",
			description: "Demo only: the text inside CtaBannerTitle.",
			control: { kind: "text" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"CtaBanner: `grain` a noisy tinted panel, `ticker` lit copy beside a running wordmark, `spotlight` a dark card whose edge and grid light up under the pointer. Every part styles itself from it.",
			default: "grain",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "CtaBanner: padding and headline scale.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "tint",
			type: "string",
			description:
				"CtaBanner: any CSS colour; sets `--cta-banner`. Defaults to #05845f for grain, #0066ff for ticker and --primary for spotlight.",
			control: { kind: "color" },
		},
		{
			name: "speed",
			type: "number",
			description: "CtaBanner: scales every loop inside, 2 twice as fast, 0.5 half.",
			default: 1,
			control: { kind: "number", min: 0.25, max: 3, step: 0.25 },
		},
		{
			name: "noise",
			type: "number",
			description: "CtaBannerGrain: film grain opacity, 0 to 1.",
			default: 0.4,
			control: { kind: "number", min: 0, max: 1, step: 0.05 },
			showWhen: { variant: ["grain"] },
		},
		{
			name: "lines",
			type: "boolean",
			description: "CtaBannerGrain: the hairline grid.",
			default: true,
			control: { kind: "boolean" },
			showWhen: { variant: ["grain"] },
		},
		{
			name: "angle",
			type: "number",
			description: "CtaBannerTicker: the rows' angle in degrees.",
			default: -38,
			control: { kind: "number", min: -60, max: 60, step: 1 },
			showWhen: { variant: ["ticker"] },
		},
		{
			name: "rows",
			type: "number",
			description: "CtaBannerTicker: how many rows run, held to 4..48.",
			default: 32,
			control: { kind: "number", min: 4, max: 48, step: 1 },
			showWhen: { variant: ["ticker"] },
		},
		{
			name: "veil",
			type: "boolean",
			description: "CtaBannerTicker: blur the rows where they pass behind the copy.",
			default: true,
			control: { kind: "boolean" },
			showWhen: { variant: ["ticker"] },
		},
		{
			name: "word",
			type: "string",
			description:
				"CtaBannerTicker: the word that runs; `mark` sits between repetitions.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "radius",
			type: "number",
			description: "CtaBannerSpotlight: the light's radius in pixels.",
			default: 420,
			control: { kind: "number", min: 160, max: 800, step: 20 },
			showWhen: { variant: ["spotlight"] },
		},
		{
			name: "grid",
			type: "boolean",
			description: "CtaBannerSpotlight: the grid the light reveals.",
			default: true,
			control: { kind: "boolean" },
			showWhen: { variant: ["spotlight"] },
		},
		{
			name: "sweep",
			type: "boolean",
			description: "CtaBannerSpotlight: a highlight that sweeps along the top edge.",
			default: true,
			control: { kind: "boolean" },
			showWhen: { variant: ["spotlight"] },
		},
		{
			name: "duration",
			type: "number",
			description:
				"CtaBannerFloater: loop length in seconds before `speed` scales it; `x`, `y` place it and `delay` offsets its loop.",
			default: 6,
			control: { kind: "none" },
		},
	],
	cssVars: {
		"--cta-banner":
			"The surface tint for grain and ticker and the light colour for spotlight; `tint` sets it.",
		"--banner-speed": "Divides every loop length inside the banner; `speed` sets it.",
	},
	motion: {
		springs: [],
		reducedMotion:
			"Floating icons, the running rows and the edge sweep stand still; the spotlight still follows the pointer.",
		behaviour: [
			"Grain: each floater drifts 10px across and 15px up while turning 10deg and breathing between 10% and 40% opacity, on its own loop and delay.",
			"Ticker: rows of the word run inclined at `angle`, alternate rows reversed and staggered; two identical halves keep the 160s loop seamless, and rows pause while off screen.",
			"Ticker: a blurred veil softens the rows where they pass behind the headline.",
			"Spotlight: the edge, a brighter copy of the grid and a soft light follow the pointer with no easing; a highlight sweeps the top edge every 6s.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"The section is labelled by CtaBannerTitle; every surface part is aria-hidden.",
			"Grain and ticker text is white on the tint: pick a `tint` dark enough for 4.5:1.",
		],
	},
	guidance: {
		when: ["The last section of a landing page, after the reader has seen the product."],
		whenNot: [
			{
				text: "A plain CTA, a split layout beside a visual, or a dismissible bar.",
				use: "cta-section",
			},
		],
		responsive: [
			"The ticker rows show from a 56rem container; narrower, the copy stands alone.",
		],
		performance: [
			"Grain is CSS gradients plus one inline SVG noise tile; no images ship.",
			"Ticker animates transforms only and stops while off screen; fewer `rows` means fewer nodes.",
		],
		ai: [
			"Compose one surface part (Grain, Ticker or Spotlight) matching `variant`, then CtaBannerContent with the copy parts.",
			"Keep two actions at most.",
		],
	},
	licenseOrigin: {
		source: "valence",
		url: "https://github.com/ValenceOSS/Valence",
		license: "MIT",
		copyright: "Copyright (c) 2026 The Valence contributors",
	},
	impl: {
		react: {
			entry: "CtaBanner",
		},
		svelte: {
			entry: "CtaBanner",
		},
	},
	keywords: [
		"cta",
		"banner",
		"closing",
		"grain",
		"noise",
		"ticker",
		"marquee",
		"spotlight",
		"landing",
	],
});
