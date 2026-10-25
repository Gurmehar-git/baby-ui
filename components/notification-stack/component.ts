import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { notificationStack as notificationStackVariants } from "./variants";

const VARIANTS = ["elevated", "flat"];

export const notificationStack = defineComponent({
	slug: "notification-stack",
	name: "Notification Stack",
	description:
		"Notices stacked behind each other: only the front card reads, the rest peek out below, and dismissing one brings the next forward.",
	category: "blocks",
	status: "beta",
	added: "2026-10-21",
	variants: variantsOf(notificationStackVariants, ["variant"]),
	props: [
		{
			name: "value",
			type: "string[]",
			description:
				"NotificationStack: dismissed notices, by value. Controlled with onValueChange; bindable in Svelte. Dismissed cards stay mounted to slide away; drop them from your data when you like.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"NotificationStack: cards lifted with a soft shadow on the page colour, or flat on the grey card step.",
			default: "elevated",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "pattern",
			type: '"orbit" | "grid" | "rays"',
			description:
				"NotificationStackPattern: the line art in the card's top-right corner.",
			default: "orbit",
			control: { kind: "none" },
		},
		{
			name: "external",
			type: "boolean",
			description:
				"NotificationStackAction: with `href`, opens in a new tab and shows an arrow.",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "children",
			type: "ReactNode | Snippet",
			description:
				"NotificationStack: NotificationStackItem (value) holding NotificationStackPattern and NotificationStackBody (NotificationStackHeader with NotificationStackBadge and NotificationStackDismiss, NotificationStackTitle, NotificationStackDescription, NotificationStackActions), then NotificationStackEmpty.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Cards change places and leave without sliding.",
		behaviour: [
			"Cards behind sit on the front card's bottom edge, 12px lower and 5% smaller each, two deep.",
			"Dismissing slides the card 40px right and fades it; the next card rises to the front and the stack's height follows it on the collapse timing.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Enter", "Space"], action: "Dismiss the front notice, or run its action" },
		],
		notes: [
			"Each card is an article named by its title; only the front card is reachable, the rest are inert and hidden.",
			"Dismissing moves focus to the next card's dismiss button, or to the stack when none are left.",
		],
	},
	guidance: {
		when: [
			"Announcements a user works through one at a time: what's new, plan limits, setup nudges.",
		],
		whenNot: [
			{ text: "Transient feedback after an action.", use: "toast" },
			{ text: "An inbox the user browses and filters.", use: "notification-center" },
		],
		ai: ["Keep each notice to a short title, one sentence and at most one action."],
	},
	licenseOrigin: {
		source: "affectui",
		url: "https://github.com/flohoeller/affectui",
		license: "MIT",
		copyright: "Copyright (c) 2026 Florian Höller (adfects)",
	},
	impl: {
		react: { entry: "NotificationStack" },
		svelte: { entry: "NotificationStack" },
	},
	keywords: ["notifications", "notices", "announcements", "stack", "cards", "whats new"],
});
