import { defineComponent } from "@baby-ui/registry-schema";

export const nativeSelect = defineComponent({
	slug: "native-select",
	name: "Native Select",
	description:
		"The platform select, styled to match: native pickers on mobile, autofill and form posting for free.",
	category: "base",
	status: "stable",
	variants: { size: ["xs", "sm", "default", "lg", "xl"] },
	props: [
		{
			name: "size",
			type: '"xs" | "sm" | "default" | "lg" | "xl"',
			description: "Height and text size.",
			default: "default",
			control: { kind: "select", options: ["xs", "sm", "default", "lg", "xl"] },
		},
		{
			name: "disabled",
			type: "boolean",
			description: "Disable the select.",
			default: false,
			control: { kind: "boolean" },
		},
	],
	a11y: {
		keyboard: [],
		notes: [
			"A real select element, so keyboard, screen reader and mobile picker behaviour come from the platform.",
		],
	},
	licenseOrigin: {
		source: "shadcn/ui",
		url: "https://github.com/shadcn-ui/ui",
		license: "MIT",
		copyright: "Copyright (c) 2023 shadcn",
	},
	impl: {
		react: {
			entry: "NativeSelect",
			files: [
				{ path: "native-select/native-select.tsx", type: "registry:ui" },
				{ path: "native-select/variants.ts", type: "registry:ui" },
				{ path: "lib/control.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "NativeSelect",
			files: [
				{ path: "native-select/native-select.svelte", type: "registry:ui" },
				{ path: "native-select/native-select-opt-group.svelte", type: "registry:ui" },
				{ path: "native-select/native-select-option.svelte", type: "registry:ui" },
				{ path: "native-select/variants.ts", type: "registry:ui" },
				{ path: "lib/control.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["select", "native select", "dropdown", "form"],
});
