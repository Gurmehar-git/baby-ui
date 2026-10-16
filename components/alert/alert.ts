import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { alert as alertVariants } from "./react/variants";

export const alert = defineComponent({
	slug: "alert",
	name: "Alert",
	description: "Inline status message with a semantic tone and an optional dismiss.",
	category: "base",
	status: "stable",
	variants: variantsOf(alertVariants, ["variant"]),
	props: [
		{
			name: "variant",
			type: '"info" | "success" | "warning" | "destructive"',
			description: "Semantic colour and the role the alert announces with.",
			default: "info",
			control: { kind: "select", options: ["info", "success", "warning", "destructive"] },
		},
		{
			name: "dismissible",
			type: "boolean",
			description: "Show a close button.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "open",
			type: "boolean",
			description:
				"Shown or folded away. Controlled with onOpenChange; bindable in Svelte.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The alert appears and disappears without travel or folding.",
		behaviour: [
			"On mount the alert fades and slides 4px into place over 200ms.",
			"Dismissing folds the alert's row shut on grid rows while it fades, so content below rises instead of jumping.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"destructive and warning render with role=alert so they interrupt; info and success use role=status so they do not.",
			"The icon is aria-hidden; the variant meaning lives in the text.",
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
			entry: "Alert",
		},
		svelte: {
			entry: "Alert",
		},
	},
	keywords: ["alert", "callout", "banner", "notice"],
});
