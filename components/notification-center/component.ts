import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { notificationCenter as notificationCenterVariants } from "./variants";

const SIZES = ["sm", "default"];

export const notificationCenter = defineComponent({
	slug: "notification-center",
	name: "Notification Center",
	description:
		"A bell with an unread badge that opens an inbox: filter unread, expand an update, mark read, dismiss and clear.",
	category: "advanced",
	status: "stable",
	variants: variantsOf(notificationCenterVariants, ["size"]),
	props: [
		{
			name: "notifications",
			type: "NotificationItem[]",
			description:
				"`{ id, title, time, description?, read?, tone?, actor? }`, paired with `onNotificationsChange`; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "onReadChange",
			type: "(notification, read: boolean) => void",
			description: "Called per item, including for Mark all read.",
			control: { kind: "none" },
		},
		{
			name: "onDismiss",
			type: "(notification) => void",
			description: "Called per item, including for Clear read.",
			control: { kind: "none" },
		},
		{
			name: "open",
			type: "boolean",
			description: "Paired with `onOpenChange`; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "label",
			type: "string",
			description: "Panel heading and accessible name.",
			default: "Notifications",
			control: { kind: "none" },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Bell button size.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Folds and pops are instant.",
		behaviour: [
			"The bell tilts while open; the badge pops in and its count rolls.",
			"Rows fold away on filter, dismiss and clear, cascading for bulk actions.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Enter", "Space"], action: "Open the panel or expand an update" },
			{ keys: ["Escape"], action: "Close the panel" },
		],
		notes: [
			"The bell's name includes the unread count; the summary line is a polite live region.",
			"Hidden rows are inert, so focus never lands on a folded item.",
		],
	},
	guidance: {
		when: ["An app header inbox for mentions, deploys and account alerts."],
		whenNot: [
			{ text: "A transient confirmation.", use: "toast" },
			{ text: "A full activity history.", use: "timeline" },
		],
		responsive: ["The panel fits the viewport minus a 12px gutter."],
		performance: ["Renders the list you pass; page older items on the server."],
		ai: ["Write titles that make sense without the description; keep `time` short."],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "NotificationCenter",
		},
		svelte: {
			entry: "NotificationCenter",
		},
	},
	keywords: ["notifications", "inbox", "bell", "alerts", "unread", "popover"],
});
