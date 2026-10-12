import { defineComponent } from "../index.ts";

export const card = defineComponent({
	slug: "card",
	name: "Card",
	description: "Content surface with header, body and footer slots.",
	category: "base",
	status: "stable",
	variants: { variant: ["default", "secondary", "ghost", "framed", "well"] },
	props: [
		{
			name: "interactive",
			type: "boolean",
			description:
				"Lift and brighten the border on hover. Only set this when the whole card is a link.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "variant",
			type: '"default" | "secondary" | "ghost" | "framed" | "well"',
			description:
				"`default` sits on the page colour with a border; `secondary` is the borderless grey card step for grouped or nested areas; `ghost` has no fill or border; `framed` wraps the body in Dialog's inset rim; `well` is a grey rim around a raised page-colour body, with a direct `CardFooter` in the rim below it.",
			default: "default",
			control: {
				kind: "select",
				options: ["default", "secondary", "ghost", "framed", "well"],
			},
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The hover lift is removed; the border change stays.",
		behaviour: [
			"An interactive card lifts 2px and brightens its border over 200ms on hover.",
			"A non-interactive card has no hover state at all, so it never looks clickable.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"`interactive` is presentation only. Put a real link or button inside; a hover style is not an affordance.",
			"Part names and `data-slot` values match shadcn/ui, so this replaces an existing card without touching call sites.",
		],
	},
	guidance: {
		when: [
			"Grouping one subject's content (a project, a plan, a setting) with an optional header and footer.",
			"A tile that links somewhere: `interactive` adds the hover lift.",
			"Pages of many cards: `well` keeps content on the page colour with grey only as the frame.",
		],
		whenNot: [
			{
				text: "Rows of uniform records that need sorting or scanning.",
				use: "data-table",
			},
			{ text: "Sections the reader should be able to collapse.", use: "accordion" },
			{ text: "A one-line status or message.", use: "alert" },
		],
		responsive: [
			"Cards fill their container; set the grid or width on the parent, not the card.",
			"The header is a container-query context, so its contents respond to the card's width, not the viewport.",
		],
		performance: [
			"Plain markup with no client state; `interactive` only adds a CSS transition.",
		],
		ai: [
			"Compose CardHeader, CardTitle, CardDescription, CardAction, CardContent and CardFooter, as in shadcn.",
			"In `well`, put CardFooter directly inside Card, not inside CardContent, so it renders in the rim.",
			"Use `secondary` for a card nested inside another surface; top-level cards use `default`.",
		],
	},
	licenseOrigin: {
		source: "sivir-ui",
		url: "https://github.com/aidan-neel/sivir-ui",
		license: "MIT",
		copyright: "Copyright (c) 2026 Aidan Neel",
	},
	impl: {
		react: {
			entry: "Card",
			files: [
				{ path: "card/card.tsx", type: "registry:ui" },
				{ path: "card/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "Card",
			files: [
				{ path: "card/card.svelte", type: "registry:ui" },
				{ path: "card/card-header.svelte", type: "registry:ui" },
				{ path: "card/card-title.svelte", type: "registry:ui" },
				{ path: "card/card-description.svelte", type: "registry:ui" },
				{ path: "card/card-action.svelte", type: "registry:ui" },
				{ path: "card/card-content.svelte", type: "registry:ui" },
				{ path: "card/card-footer.svelte", type: "registry:ui" },
				{ path: "card/context.ts", type: "registry:ui" },
				{ path: "card/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["card", "surface", "panel", "container"],
});
