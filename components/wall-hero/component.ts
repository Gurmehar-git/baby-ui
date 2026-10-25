import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { wallHero as wallHeroVariants } from "./variants";

const VARIANTS = ["split", "backdrop"];

export const wallHero = defineComponent({
	slug: "wall-hero",
	name: "Wall Hero",
	description:
		"A landing hero with brand, headline, an install command and actions beside a tilted wall of your own cards drifting past in columns.",
	category: "blocks",
	status: "beta",
	added: "2026-10-21",
	variants: variantsOf(wallHeroVariants, ["variant"]),
	props: [
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"WallHero: copy on the left with the wall on the right (stacked under it when narrow), or the wall behind centred copy.",
			default: "split",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "command",
			type: "string",
			description:
				"WallHeroCommand: the install command shown in the pill and copied by its button.",
			control: { kind: "none" },
		},
		{
			name: "direction",
			type: '"up" | "down"',
			description:
				"WallHeroColumn: which way the column drifts. Alternate them for depth.",
			default: "up",
			control: { kind: "none" },
		},
		{
			name: "duration",
			type: "string",
			description:
				'WallHeroColumn: one full loop, e.g. "70s". Give columns different lengths so they never line up.',
			control: { kind: "none" },
		},
		{
			name: "children",
			type: "ReactNode | Snippet",
			description:
				"WallHero: WallHeroContent (WallHeroBrand, WallHeroTitle, WallHeroDescription, WallHeroCommand, WallHeroActions), then WallHeroWall with WallHeroColumn of WallHeroCard.",
			control: { kind: "none" },
		},
	],
	cssVars: {
		"--wall-hero-duration":
			"One loop of a column's drift; 60s unless a column sets `duration`.",
	},
	motion: {
		springs: [],
		reducedMotion: "The wall holds still.",
		behaviour: [
			"Each column holds its cards twice and moves by half its height on a linear loop, so the drift never seams.",
			"The plane is tilted in 3D and masked so cards fade in and out at the edges.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"The wall is decoration: aria-hidden and inert, so its cards are never focused or read.",
			"Put anything a visitor must reach in WallHeroContent, not on the wall.",
		],
	},
	guidance: {
		when: [
			"The top of a landing page for a product with many surfaces to show at a glance.",
		],
		whenNot: [
			{ text: "A centred hero with a glow and no imagery.", use: "gradient-hero-01" },
			{ text: "Cards that settle into place as the page scrolls.", use: "hero-stage" },
		],
		ai: [
			"Fill the wall with real, small product pieces (a chart, a toggle list, a badge row) at three to four cards per column.",
		],
	},
	licenseOrigin: {
		source: "affectui",
		url: "https://github.com/flohoeller/affectui",
		license: "MIT",
		copyright: "Copyright (c) 2026 Florian Höller (adfects)",
	},
	impl: {
		react: { entry: "WallHero" },
		svelte: { entry: "WallHero" },
	},
	keywords: ["hero", "landing", "wall", "marquee", "showcase", "install", "tilted"],
});
