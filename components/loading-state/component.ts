import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { loadingState as loadingStateVariants } from "./variants";

const VARIANTS = ["drive", "dots", "orbit"];

export const loadingState = defineComponent({
	slug: "loading-state",
	name: "Loading State",
	description:
		"Pixel-grid wavefront loader with a shimmering label and a live elapsed timer.",
	category: "agents",
	status: "stable",
	variants: variantsOf(loadingStateVariants, ["variant"]),
	props: [
		{
			name: "variant",
			type: '"drive" | "dots" | "orbit"',
			description:
				"LoadingState: `drive`/`dots` sweep a chevron wavefront across the grid (square vs. round cells); `orbit` laps a comet around the perimeter.",
			default: "drive",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "children",
			type: "ReactNode | Snippet",
			description:
				"LoadingState: LoadingStateIndicator, LoadingStateLabel and LoadingStateElapsed, then an optional LoadingStatePreview.",
			control: { kind: "none" },
		},
		{
			name: "src",
			type: "string",
			description:
				'LoadingStatePreview: the looping video URL. Falls back to a "Video unavailable" placeholder without one.',
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The grid freezes to its dim resting state and the label stops shimmering; the elapsed timer keeps ticking, since it's the actual status information.",
		behaviour: [
			"Each grid cell's `animation-delay` is set per-pattern (a chevron sweep or an orbit lap), so the wavefront motion comes from staggered starts on one shared keyframe, not per-cell state.",
		],
	},
	a11y: {
		role: "status",
		keyboard: [],
		notes: [
			'role="status" so assistive tech announces the label and timer without needing focus.',
			"The grid itself is aria-hidden; the label text and timer carry the actual information.",
		],
	},
	licenseOrigin: {
		source: "beUI",
		url: "https://beui.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 beUI",
	},
	impl: {
		react: {
			entry: "LoadingState",
		},
		svelte: {
			entry: "LoadingState",
		},
	},
	keywords: ["loading", "loader", "spinner", "progress", "agent"],
});
