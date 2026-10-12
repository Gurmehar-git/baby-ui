import { defineComponent } from "../index.ts";

export const field = defineComponent({
	slug: "field",
	name: "Field",
	description:
		"Label, control, description and error laid out as one accessible unit, with shadcn's exact part names.",
	category: "base",
	status: "stable",
	variants: {
		orientation: ["vertical", "horizontal", "responsive"],
		size: ["default", "sm"],
	},
	props: [
		{
			name: "orientation",
			type: '"vertical" | "horizontal" | "responsive"',
			description:
				"Stack the label over the control, set them side by side, or switch at the field group's @md width.",
			default: "vertical",
			control: { kind: "select", options: ["vertical", "horizontal", "responsive"] },
		},
		{
			name: "size",
			type: '"default" | "sm"',
			description:
				'Field, FieldSet and FieldGroup. `sm` is the compact inspector density: tighter rows and, when horizontal, a fixed muted label column. Pair it with FieldLegend `variant="eyebrow"`.',
			default: "default",
			control: { kind: "select", options: ["default", "sm"] },
		},
		{
			name: "errors",
			type: "{ message?: string }[]",
			description:
				"FieldError only. The shape zod and react-hook-form report; duplicates and blanks are dropped.",
			control: { kind: "none" },
		},
	],
	a11y: {
		role: "group",
		keyboard: [],
		notes: [
			"FieldError renders role=alert, so a new message is announced once.",
			"Point the control's aria-describedby at FieldDescription and FieldError ids and set aria-invalid; Field reads data-invalid for styling only.",
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
			entry: "Field",
			files: [
				{ path: "field/field.tsx", type: "registry:ui" },
				{ path: "field/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["label", "separator"],
		},
		svelte: {
			entry: "Field",
			files: [
				{ path: "field/field.svelte", type: "registry:ui" },
				{ path: "field/field-content.svelte", type: "registry:ui" },
				{ path: "field/field-description.svelte", type: "registry:ui" },
				{ path: "field/field-error.svelte", type: "registry:ui" },
				{ path: "field/field-group.svelte", type: "registry:ui" },
				{ path: "field/field-label.svelte", type: "registry:ui" },
				{ path: "field/field-legend.svelte", type: "registry:ui" },
				{ path: "field/field-separator.svelte", type: "registry:ui" },
				{ path: "field/field-set.svelte", type: "registry:ui" },
				{ path: "field/field-title.svelte", type: "registry:ui" },
				{ path: "field/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["label", "separator"],
		},
	},
	keywords: ["field", "form", "label", "error", "validation", "fieldset"],
});
