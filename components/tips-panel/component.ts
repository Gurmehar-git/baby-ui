import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { tipsPanel as tipsPanelVariants } from "./variants";

const VARIANTS = ["tray", "plain"];

export const tipsPanel = defineComponent({
	slug: "tips-panel",
	name: "Tips Panel",
	description:
		"A grid of short tips, each with one action that settles into a done state, and a running count of what's left.",
	category: "blocks",
	status: "beta",
	added: "2026-10-21",
	variants: variantsOf(tipsPanelVariants, ["variant"]),
	props: [
		{
			name: "value",
			type: "string[]",
			description:
				"TipsPanel: ids of the tips already taken. Controlled with onValueChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"TipsPanel: the tip card framed in a grey rim with the heading and footer, or one bordered card.",
			default: "tray",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "label",
			type: "(done: number, total: number) => string",
			description: 'TipsPanelProgress: the count text. Defaults to "2/6 done".',
			control: { kind: "none" },
		},
		{
			name: "primary",
			type: "boolean",
			description:
				"TipsPanelAction: the filled button. Use it on the one tip that matters most.",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "doneLabel",
			type: "string",
			description: 'TipsPanelAction: what the action reads once taken, e.g. "Enabled".',
			default: "Done",
			control: { kind: "none" },
		},
		{
			name: "children",
			type: "ReactNode | Snippet",
			description:
				"TipsPanel: TipsPanelHeader (TipsPanelTitle, TipsPanelProgress), TipsPanelContent holding TipsPanelGrid of TipsPanelTip (value; TipsPanelTipTitle, TipsPanelTipDescription, TipsPanelAction), then an optional TipsPanelFooter.",
			control: { kind: "none" },
		},
	],
	cssVars: {
		"--tips-panel-max-height":
			"Height of the tip card before it scrolls; defaults to 26rem.",
	},
	motion: {
		springs: [],
		reducedMotion: "Tips appear in place and the done state swaps without the pop.",
		behaviour: [
			"Tips rise 8px and fade in once on mount, 50ms apart.",
			"Taking a tip tints its card and swaps the action for a check that pops in at 95% scale.",
		],
	},
	a11y: {
		keyboard: [{ keys: ["Enter", "Space"], action: "Take the focused tip's action" }],
		notes: [
			"The count is a polite live region.",
			"When a taken action leaves the page, focus moves to its done status so keyboard users keep their place.",
		],
	},
	guidance: {
		when: ["Onboarding nudges or feature discovery on a home or settings page."],
		whenNot: [
			{ text: "Ordered setup steps with progress.", use: "stepper" },
			{ text: "One message with an action.", use: "alert" },
		],
		responsive: ["Three columns, two under 35rem and one under 24rem of card width."],
		ai: ["Keep each tip to a title of a few words and one sentence; one action per tip."],
	},
	licenseOrigin: {
		source: "affectui",
		url: "https://github.com/flohoeller/affectui",
		license: "MIT",
		copyright: "Copyright (c) 2026 Florian Höller (adfects)",
	},
	impl: {
		react: { entry: "TipsPanel" },
		svelte: { entry: "TipsPanel" },
	},
	keywords: ["tips", "onboarding", "discovery", "nudges", "checklist", "getting started"],
});
