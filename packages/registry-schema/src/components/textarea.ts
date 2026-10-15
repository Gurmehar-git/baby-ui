import { defineComponent } from "../index.ts";

export const textarea = defineComponent({
	slug: "textarea",
	name: "Textarea",
	description: "Multi-line field that can grow with its content instead of scrolling.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "rows",
			type: "number",
			description: "Initial visible rows.",
			default: 3,
			control: { kind: "number", min: 2, max: 12, step: 1 },
		},
		{
			name: "size",
			type: '"xs" | "sm" | "default" | "lg" | "xl"',
			description: "Control size.",
			default: "default",
			control: { kind: "select", options: ["xs", "sm", "default", "lg", "xl"] },
		},
		{
			name: "variant",
			type: '"outline" | "soft" | "ring"',
			description: "Field treatment; `ring` adds a soft focus halo to the outline look.",
			default: "outline",
			control: { kind: "select", options: ["outline", "soft", "ring"] },
		},
		{
			name: "label",
			type: "string",
			description: "Visible label. Adds a wrapper; without it the textarea is the root.",
			control: { kind: "text" },
		},
		{
			name: "description",
			type: "string",
			description: "Help text below the field, linked with aria-describedby.",
			control: { kind: "text" },
		},
		{
			name: "showCount",
			type: "boolean",
			description: "Show a character count, against maxlength when one is set.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "autoGrow",
			type: "boolean",
			description:
				"Grow to fit content up to maxRows, then scroll. Removes the resize grip.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "maxRows",
			type: "number",
			description: "Row count at which growing stops and scrolling starts.",
			default: 10,
			control: { kind: "number", min: 4, max: 24, step: 1 },
		},
		{
			name: "invalid",
			type: "boolean",
			description: "Mark the field as failing validation.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "disabled",
			type: "boolean",
			description: "Disable the field.",
			default: false,
			control: { kind: "boolean" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Height changes apply immediately without easing.",
		behaviour: [
			"The character count rolls only the digits that change.",
			"Auto-grow sets height from scrollHeight on input, so the caret never leaves the visible area.",
			"Growth is not animated: a field that eases taller lags behind the character you just typed.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Auto-grow changes the control height, not its value, so nothing is announced on resize.",
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
			entry: "Textarea",
			files: [
				{ path: "textarea/textarea.tsx", type: "registry:ui" },
				{ path: "textarea/variants.ts", type: "registry:ui" },
				{ path: "lib/control.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["rolling-digits"],
		},
		svelte: {
			entry: "Textarea",
			files: [
				{ path: "textarea/textarea.svelte", type: "registry:ui" },
				{ path: "textarea/variants.ts", type: "registry:ui" },
				{ path: "lib/control.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["rolling-digits"],
		},
	},
	keywords: ["textarea", "form", "multiline"],
});
