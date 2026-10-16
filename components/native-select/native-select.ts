import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { nativeSelect as nativeSelectVariants } from "./react/variants";

export const nativeSelect = defineComponent({
	slug: "native-select",
	name: "Native Select",
	description:
		"The platform select, styled to match: native pickers on mobile, autofill and form posting for free.",
	category: "base",
	status: "stable",
	variants: variantsOf(nativeSelectVariants, ["size"]),
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
		},
		svelte: {
			entry: "NativeSelect",
		},
	},
	keywords: ["select", "native select", "dropdown", "form"],
});
