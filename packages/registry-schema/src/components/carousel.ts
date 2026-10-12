import { defineComponent } from "../index.ts";

const SIZES = ["sm", "default", "lg"];
const VARIANTS = ["default", "flat", "inset"];
const CONTROLS = ["full", "dots", "arrows", "none"];

export const carousel = defineComponent({
	slug: "carousel",
	name: "Carousel",
	description:
		"Centred row of slides browsed by drag, flick, trackpad swipe or keys, with neighbours in view and an indicator that travels with them.",
	category: "base",
	status: "stable",
	variants: { variant: VARIANTS, size: SIZES },
	props: [
		{
			name: "label",
			type: "string",
			description:
				'Names the carousel for assistive technology, e.g. "From the Harbour suites".',
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"`default` scales and dims neighbours, `flat` keeps a plain row, `inset` floats the dots and arrows over the slide.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "controls",
			type: CONTROLS.map((v) => `"${v}"`).join(" | "),
			description:
				"Which controls render. `full` adds the play control when `interval` is set; hidden dots stay for screen readers.",
			default: "full",
			control: { kind: "select", options: CONTROLS },
		},
		{
			name: "loop",
			type: "boolean",
			description: "Arrows and keys wrap from the last slide to the first and back.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description:
				"Slide width preset: a share of the carousel width, capped at 260, 340 or 480px.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "slideSize",
			type: "string",
			description:
				"Width of one slide as a CSS length; overrides `size`. Use `cqw` for a share of the carousel.",
			control: { kind: "none" },
		},
		{
			name: "index",
			type: "number",
			description:
				"Active slide. Controlled with onIndexChange; bindable in Svelte. `defaultIndex` sets the uncontrolled start.",
			control: { kind: "none" },
		},
		{
			name: "interval",
			type: "number",
			description:
				"Milliseconds per slide. Adds a play control; rotation pauses on hover, keyboard focus, drag, off screen and in background tabs.",
			control: { kind: "number", min: 0, max: 10000, step: 500 },
		},
		{
			name: "autoplay",
			type: "boolean",
			description:
				"Starts rotating on mount. Off by default, so motion begins with the viewer.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "slideLabel",
			type: "(index: number, count: number) => string",
			description: 'Names each slide and its indicator. Defaults to "2 of 5".',
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Slides jump instead of gliding, the play control is removed and rotation never starts.",
		behaviour: [
			"The track follows the pointer 1:1 once a press moves 6px horizontally; a vertical move hands the gesture to the page scroll.",
			"Release lands where the flick's momentum would carry the track; any flick faster than 360px/s moves at least one slide.",
			"Past either end the track rubber-bands and springs back on release.",
			"Neighbours scale to 0.9 and dim to 50% per step of distance, read every frame from the track position.",
			"The indicator under each slide widens from a 6px dot to a 22px pill as the track nears it, and drains left to right while rotation runs.",
		],
	},
	a11y: {
		role: "region",
		keyboard: [
			{
				keys: ["Arrow Left", "Arrow Right"],
				action: "Move to the previous or next slide",
			},
			{ keys: ["Home", "End"], action: "Jump to the first or last slide" },
			{
				keys: ["Tab"],
				action: "Moves from the slides to the play control, indicators and arrows",
			},
		],
		notes: [
			"The root is a region with aria-roledescription carousel; each slide is a labelled tabpanel driven by the indicator tablist.",
			"Off-screen slides are inert, so focus and screen readers stay on the active slide.",
			"Manual moves are announced in a polite live region; rotation stays silent.",
			"Rotation pauses on hover, keyboard focus and drag, and the play control is always reachable.",
		],
	},
	guidance: {
		when: [
			"A short, ordered set of peers (products, rooms, case studies) where the neighbours hint that there is more.",
			"Galleries browsed by drag, flick, trackpad swipe or keys.",
			"Rotating highlights, provided the viewer can always pause them.",
		],
		whenNot: [
			{ text: "Content everyone must see: most people never reach slide three." },
			{
				text: "A list of logos or tags that should scroll on its own.",
				use: "logo-carousel",
			},
			{
				text: "A labelled list of many items picked from a wheel.",
				use: "wheel-carousel",
			},
		],
		responsive: [
			"Slide width is a share of the carousel's own width (container query units), so it fits a sidebar as well as a full page.",
			"Below 340px the control row tightens so play, indicators and arrows still fit beside a narrow slide.",
		],
		performance: [
			"Every slide stays mounted; transforms are written straight to the DOM without re-rendering slides.",
			"Rotation stops while the carousel is off screen or the tab is hidden.",
		],
		ai: [
			"Wrap each slide in CarouselItem; give the Carousel a `label` that names the set.",
			"Keep slides to roughly three to seven. Past that, a grid with filters serves people better.",
			"Leave `autoplay` off unless the user asked for rotation; set `interval` to offer the play control instead.",
		],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "Carousel",
			files: [
				{ path: "carousel/carousel.tsx", type: "registry:ui" },
				{ path: "carousel/track.ts", type: "registry:ui" },
				{ path: "carousel/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["button"],
		},
		svelte: {
			entry: "Carousel",
			files: [
				{ path: "carousel/carousel.svelte", type: "registry:ui" },
				{ path: "carousel/carousel-item.svelte", type: "registry:ui" },
				{ path: "carousel/context.ts", type: "registry:ui" },
				{ path: "carousel/track.ts", type: "registry:ui" },
				{ path: "carousel/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["button"],
		},
	},
	keywords: ["carousel", "slider", "gallery", "slides", "swipe"],
});
