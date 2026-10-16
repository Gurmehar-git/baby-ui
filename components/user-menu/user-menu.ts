import { defineComponent } from "@baby-ui/registry-schema";

const SIZES = ["sm", "default"];

const files = (main: string) => [
	{ path: `user-menu/${main}`, type: "registry:ui" as const },
	{ path: "user-menu/account.ts", type: "registry:ui" as const },
	{ path: "user-menu/variants.ts", type: "registry:ui" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
];
const deps = ["avatar", "badge", "dropdown-menu", "mention-input", "spinner"];

export const userMenu = defineComponent({
	slug: "user-menu",
	name: "User Menu",
	description:
		"The account menu behind a person's avatar: identity, destinations, presence status, theme and sign out.",
	category: "advanced",
	status: "stable",
	variants: { size: SIZES },
	props: [
		{
			name: "user",
			type: "UserMenuUser",
			description: "`{ name, email, plan?, avatar? }`.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "status",
			type: '"available" | "busy" | "away"',
			description:
				"Shows a presence dot and a status submenu, paired with `onStatusChange`; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "theme",
			type: '"light" | "dark" | "system"',
			description:
				"Shows a theme submenu, paired with `onThemeChange`; applying it is up to the app.",
			control: { kind: "none" },
		},
		{
			name: "items",
			type: "UserMenuItem[]",
			description: "`{ label, icon?, shortcut?, onSelect? }` account destinations.",
			control: { kind: "none" },
		},
		{
			name: "onSignOut",
			type: "() => unknown",
			description:
				"A returned promise keeps the menu open with progress until it settles.",
			control: { kind: "none" },
		},
		{
			name: "showName",
			type: "boolean",
			description: "Name and chevron beside the avatar from 640px up.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Avatar size in the trigger.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The presence dot changes without the morph.",
		behaviour: [
			"The presence dot morphs: a bar slides in for busy and a hole opens for away.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Enter", "Space", "ArrowDown"], action: "Open the menu" },
			{ keys: ["ArrowRight"], action: "Open the status or theme submenu" },
			{ keys: ["Escape"], action: "Close" },
		],
		notes: [
			"The trigger is named with the person and their status; each dot also differs in shape, not only colour.",
		],
	},
	guidance: {
		when: ["The account control at the end of an app's top bar."],
		whenNot: [
			{ text: "General actions on a record.", use: "dropdown-menu" },
			{ text: "Choosing a theme on a settings page.", use: "theme-toggle" },
		],
		responsive: ["The name hides below 640px; the menu stays anchored to the avatar."],
		performance: ["Renders nothing extra until opened."],
		ai: ["Keep `items` to three or four; put the rest on a settings page."],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "UserMenu",
			files: files("user-menu.tsx"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: deps,
		},
		svelte: {
			entry: "UserMenu",
			files: files("user-menu.svelte"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: deps,
		},
	},
	keywords: ["user", "account", "avatar", "profile", "menu", "presence", "sign out"],
});
