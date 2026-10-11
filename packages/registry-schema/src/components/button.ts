import { defineComponent } from "../index.ts";

export const button = defineComponent({
	slug: "button",
	isNew: true,
	name: "Button",
	description:
		"Pressable button or link with variant and size axes, a blur-crossfaded loading face, and spring press feedback.",
	category: "base",
	status: "stable",

	variants: {
		variant: [
			"default",
			"default_soft",
			"secondary",
			"outline",
			"ghost",
			"link",
			"destructive",
			"destructive_soft",
			"success",
			"success_soft",
			"warning",
			"warning_soft",
			"info",
			"info_soft",
			"default_surface",
			"secondary_surface",
			"destructive_surface",
			"success_surface",
			"warning_surface",
			"info_surface",
			"dark",
			"light",
			"raw",
		],
		size: [
			"xs",
			"sm",
			"default",
			"lg",
			"xl",
			"icon-xs",
			"icon-sm",
			"icon",
			"icon-lg",
			"icon-xl",
		],
	},

	props: [
		{
			name: "variant",
			type: '"default" | "default_soft" | "secondary" | "outline" | "ghost" | "link" | "destructive" | "destructive_soft" | "success" | "success_soft" | "warning" | "warning_soft" | "info" | "info_soft" | "default_surface" | "secondary_surface" | "destructive_surface" | "success_surface" | "warning_surface" | "info_surface" | "dark" | "light" | "raw"',
			description:
				"Visual weight. The `_soft` family is a tinted fill for secondary emphasis; the `_surface` family is a raised fill with a sheen, a lit edge and a soft drop.",
			default: "default",
			control: {
				kind: "select",
				options: [
					"default",
					"default_soft",
					"secondary",
					"outline",
					"ghost",
					"link",
					"destructive",
					"destructive_soft",
					"success",
					"success_soft",
					"warning",
					"warning_soft",
					"info",
					"info_soft",
					"default_surface",
					"secondary_surface",
					"destructive_surface",
					"success_surface",
					"warning_surface",
					"info_surface",
					"dark",
					"light",
					"raw",
				],
			},
		},
		{
			name: "size",
			type: '"xs" | "sm" | "default" | "lg" | "xl" | "icon-xs" | "icon-sm" | "icon" | "icon-lg" | "icon-xl"',
			description: "Height and horizontal padding. The `icon-*` sizes render squares.",
			default: "default",
			control: {
				kind: "select",
				options: [
					"xs",
					"sm",
					"default",
					"lg",
					"xl",
					"icon-xs",
					"icon-sm",
					"icon",
					"icon-lg",
					"icon-xl",
				],
			},
		},
		{
			name: "href",
			type: "string",
			description: "Renders an anchor instead of a button. Keeps the same visuals.",
			control: { kind: "text", placeholder: "https://example.com" },
		},
		{
			name: "loading",
			type: "boolean",
			description:
				"Shows the spinner face and refuses activation while staying focusable.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "loadingLabel",
			type: "string",
			description: "Text shown on the loading face and announced to screen readers.",
			default: "Loading…",
			control: { kind: "text" },
		},
		{
			name: "disabled",
			type: "boolean",
			description: "Standard disabled state. Prefer `loading` for in-flight actions.",
			default: false,
			control: { kind: "boolean" },
		},
	],

	motion: {
		springs: [],
		reducedMotion:
			"Press scale and face crossfade collapse to 0ms; the spinner stops rotating and the loading label alone conveys state.",
		behaviour: [
			"Pressing scales the button to 0.97 over 140ms and releases on pointerup.",
			"Toggling `loading` crossfades the idle and loading faces through a 3px blur so the two never read as separate stacked elements.",
			"The button's width does not change when the face swaps; both faces share one grid cell.",
			"The spinner rotates at 850ms linear and is paused, not unmounted, when idle.",
		],
	},

	a11y: {
		role: "button",
		keyboard: [
			"Space and Enter activate the button",
			"Space activates the anchor form, which browsers do not",
			"Activation is refused while loading; focus stays put",
		],
		notes: [
			"`aria-busy` is set while loading.",
			"A visually hidden live region announces the settled loading label.",
		],
	},

	licenseOrigin: {
		source: "sivir-ui",
		url: "https://github.com/aidan-neel/sivir-ui",
		license: "MIT",
		copyright: "Copyright (c) 2026 Aidan Neel",
	},

	impl: {
		svelte: {
			entry: "Button",
			files: [
				{ path: "button/button.svelte", type: "registry:ui" },
				{ path: "button/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		react: {
			entry: "Button",
			files: [
				{ path: "button/button.tsx", type: "registry:ui" },
				{ path: "button/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},

	keywords: ["button", "link", "loading", "pending", "cta"],
});
