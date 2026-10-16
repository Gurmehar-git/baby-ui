import { defineComponent } from "@baby-ui/registry-schema";

const VARIANTS = ["default", "inverted"];

const files = (main: string) => [
	{ path: `announcement-bar/${main}`, type: "registry:ui" as const },
	{ path: "announcement-bar/rotation.ts", type: "registry:ui" as const },
	{ path: "announcement-bar/variants.ts", type: "registry:ui" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
];

export const announcementBar = defineComponent({
	slug: "announcement-bar",
	name: "Announcement Bar",
	description:
		"A slim bar for the top of a page: rotating messages with a call to action and countdown, and a dismiss that eases the page up.",
	category: "advanced",
	status: "stable",
	variants: { variant: VARIANTS },
	props: [
		{
			name: "messages",
			type: "Announcement[]",
			description:
				"`{ id, message, action?, countdown? }`; `countdown` is `{ to, label? }`.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "id",
			type: "string",
			description: "Remembers dismissal in the browser under this id.",
			control: { kind: "none" },
		},
		{
			name: "open",
			type: "boolean",
			description: "Paired with `onOpenChange`; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "index",
			type: "number",
			description: "Visible message, paired with `onIndexChange`; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "autoPlay",
			type: "boolean",
			description: "Rotate every `interval` ms (6000 by default).",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "controls",
			type: "boolean",
			description: "Previous, next and a pause ring that shows time left.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "dismissible",
			type: "boolean",
			description: "Shows the close button.",
			default: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "`inverted` flips to a foreground-coloured bar.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Rotation stops; dismiss and message changes are instant.",
		behaviour: [
			"The next message rises in from below while the old one lifts away; previous runs the other way.",
			"Dismissing folds the bar's height so the page eases up.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Tab"],
				action: "Reach the action, controls and dismiss; focus pauses rotation",
			},
		],
		notes: [
			"A carousel region with slides named n of m; announcements are polite only while rotation is paused.",
		],
	},
	guidance: {
		when: ["Site-wide news, launches and time-limited offers above the header."],
		whenNot: [
			{ text: "A status tied to one action.", use: "toast" },
			{ text: "An inline warning in a form.", use: "alert" },
		],
		responsive: [
			"Below 35rem the message reads from the start edge and the mirror column drops.",
		],
		performance: ["One animation frame loop while rotating; none while paused."],
		ai: ["Keep each message to one short sentence plus one action."],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "AnnouncementBar",
			files: files("announcement-bar.tsx"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["button", "countdown"],
		},
		svelte: {
			entry: "AnnouncementBar",
			files: files("announcement-bar.svelte"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["button", "countdown"],
		},
	},
	keywords: ["announcement", "banner", "promo", "bar", "countdown", "marquee"],
});
