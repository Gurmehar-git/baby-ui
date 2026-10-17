import { defineComponent } from "@baby-ui/registry-schema";

export const morphingModal = defineComponent({
	slug: "morphing-modal",
	name: "Morphing Modal",
	description:
		"Card that expands into a dialog from its own position, measured with FLIP so the two frameworks travel identically.",
	category: "advanced",
	status: "stable",

	props: [
		{
			name: "open",
			type: "boolean",
			description: "Controlled open state. Omit to let the modal own it.",
			control: { kind: "none" },
		},
		{
			name: "onOpenChange",
			type: "(open: boolean) => void",
			description:
				"Fired when the trigger, the close button, Escape or the backdrop opens or closes the modal.",
			control: { kind: "none" },
		},
		{
			name: "spring",
			type: '"snappy" | "gentle" | "bouncy"',
			description: "Named spring that drives the morph in both directions.",
			default: "gentle",
			control: { kind: "select", options: ["snappy", "gentle", "bouncy"] },
		},
		{
			name: "size",
			type: '"sm" | "default" | "lg"',
			description: "Width of the expanded panel.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg"] },
		},
		{
			name: "dismissOnBackdrop",
			type: "boolean",
			description: "Close when the backdrop is clicked.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "backdropBlur",
			type: "number",
			description:
				"Backdrop blur radius in pixels. Kept low; blur is expensive in Safari.",
			default: 8,
			control: { kind: "number", min: 0, max: 20, step: 1 },
		},
	],

	motion: {
		springs: ["snappy", "gentle", "bouncy"],
		reducedMotion:
			"No morph: the dialog crossfades in place at its final size and the backdrop fades.",
		behaviour: [
			"On open the trigger's bounding box is measured and the dialog is transformed from that box to its final box, so it appears to grow out of the card rather than over it.",
			"The transform is applied to the dialog, never to width or height, so the morph stays off the layout path.",
			"Closing runs the inverse and is faster than opening, because the user has already decided.",
			"The trigger stays in the layout and is hidden with opacity, so the page does not reflow mid-morph.",
			"The morph is FLIP against a measured rect, not a shared-layout animation, because Svelte has no equivalent of that.",
		],
	},

	a11y: {
		role: "dialog",
		keyboard: [
			{ keys: ["Escape"], action: "Closes the dialog" },
			{ keys: ["Tab"], action: "Cycles within the dialog while it is open" },
		],
		notes: [
			"Rendered with the native <dialog> element, so the top layer and inertness come from the platform.",
			"aria-labelledby points at the dialog's own heading, not the trigger's text.",
			"Focus returns to the trigger on close.",
		],
	},

	impl: {
		react: {
			entry: "MorphingModal",
		},
		svelte: {
			entry: "MorphingModal",
		},
	},

	keywords: ["modal", "dialog", "morph", "flip", "expand"],
});
