import { defineComponent } from "@baby-ui/registry-schema";

export const form = defineComponent({
	slug: "form",
	name: "Form",
	description:
		"Field parts wired to TanStack Form: label, control, description and errors linked by id, with invalid state and submit handled for you.",
	category: "base",
	status: "beta",
	variants: { spacing: ["compact", "comfortable"] },
	props: [
		{
			name: "spacing",
			type: '"compact" | "comfortable"',
			description: "FormField only. Gap between label, control, description and errors.",
			default: "comfortable",
			control: { kind: "select", options: ["compact", "comfortable"] },
		},
		{
			name: "orientation",
			type: '"vertical" | "horizontal" | "responsive"',
			description:
				"FormField only. Passed to Field: label over, beside, or switching at @md.",
			default: "vertical",
			control: { kind: "select", options: ["vertical", "horizontal", "responsive"] },
		},
		{
			name: "form",
			type: "AnyFormApi",
			description:
				"Form only. What useForm (React) or createForm (Svelte) returns; submit runs its handleSubmit.",
			control: { kind: "none" },
		},
		{
			name: "field",
			type: "AnyFieldApi",
			description:
				"FormField only. The field form.Field hands its children; drives invalid state and errors.",
			control: { kind: "none" },
		},
	],
	a11y: {
		keyboard: [],
		notes: [
			"FormLabel points at the control's id; FormControl sets aria-invalid and aria-describedby to the description and, once invalid, the errors.",
			"A field turns invalid once touched and failing; submitting touches every field, so errors appear on submit too.",
			"FormButton uses Button's loading state while the form submits: aria-busy, and a second press does nothing.",
		],
	},
	impl: {
		react: {
			entry: "FormField",
			files: [
				{ path: "form/form.tsx", type: "registry:ui" },
				{ path: "form/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: [
				"clsx",
				"tailwind-merge",
				"tailwind-variants",
				"@tanstack/react-form",
			],
			registryDependencies: ["field", "button"],
		},
		svelte: {
			entry: "FormField",
			files: [
				{ path: "form/form.svelte", type: "registry:ui" },
				{ path: "form/form-button.svelte", type: "registry:ui" },
				{ path: "form/form-control.svelte", type: "registry:ui" },
				{ path: "form/form-description.svelte", type: "registry:ui" },
				{ path: "form/form-field-errors.svelte", type: "registry:ui" },
				{ path: "form/form-field.svelte", type: "registry:ui" },
				{ path: "form/form-label.svelte", type: "registry:ui" },
				{ path: "form/context.ts", type: "registry:ui" },
				{ path: "form/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: [
				"clsx",
				"tailwind-merge",
				"tailwind-variants",
				"@tanstack/svelte-form",
			],
			registryDependencies: ["field", "button"],
		},
	},
	keywords: ["form", "tanstack form", "validation", "zod", "standard schema", "field"],
});
