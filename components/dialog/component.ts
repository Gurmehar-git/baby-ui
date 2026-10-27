import { defineComponent } from "@baby-ui/registry-schema";

export const dialog = defineComponent({
	slug: "dialog",
	name: "Dialog",
	description:
		"Centred dialog on the platform top layer, so the browser traps focus for you.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "open",
			type: "boolean",
			description: "Whether the dialog is shown. Bindable.",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "motion",
			type: '"zoom" | "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "morph"',
			description:
				"How the panel enters and exits. Every exit retraces the entrance path; `morph` unfolds from the centre.",
			default: "zoom",
			control: {
				kind: "select",
				options: [
					"zoom",
					"fade",
					"slide-up",
					"slide-down",
					"slide-left",
					"slide-right",
					"morph",
				],
			},
		},
		{
			name: "size",
			type: '"sm" | "default" | "lg" | "xl"',
			description: "Maximum width of the content panel.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg", "xl"] },
		},
		{
			name: "variant",
			type: '"default" | "framed"',
			description:
				"`framed` insets the body in a rim: a thin bg-background border around a bg-card surface. `default` is the flat shadcn/ui surface, for dropping into an existing project.",
			default: "default",
			control: { kind: "select", options: ["default", "framed"] },
		},
		{
			name: "dismissOnBackdrop",
			type: "boolean",
			description: "Close when the backdrop is clicked.",
			default: true,
			control: { kind: "boolean" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The panel appears in place without scale, travel or clipping.",
		behaviour: [
			"The default panel scales from 1.02 and fades; fade, four directional slides and a centre-unfolding morph are optional.",
			"Fade, zoom and slide closes retrace their open path with shorter exit timing; morph stays opaque and folds fully back to its centre over the same duration it opens.",
			"The backdrop fades and blurs in step with every panel treatment.",
		],
	},
	a11y: {
		role: "dialog",
		keyboard: [
			{ keys: ["Escape"], action: "Closes the dialog" },
			{ keys: ["Tab"], action: "Cycles within the dialog while it is open" },
		],
		notes: [
			"Base UI and bits-ui own focus trapping, inertness, top-layer emulation and focus restoration.",
			"DialogTitle and DialogDescription own the ids that the dialog is labelled and described by, so the wiring cannot drift.",
			'`variant="default"` renders a single flat surface (the DialogFooter padding moves inline with it), matching the shadcn/ui baseline exactly.',
			"Part names and data-slot values match shadcn/ui, so this replaces an existing dialog without touching call sites.",
		],
	},
	guidance: {
		when: [
			"A focused task that blocks the page until it is done or dismissed: a form, a detail view, settings.",
			"Content the user must not lose to a stray click outside: set `dismissOnBackdrop={false}`.",
		],
		whenNot: [
			{ text: "Confirming a destructive action.", use: "alert-dialog" },
			{
				text: "A panel that slides from an edge, or a long form on mobile.",
				use: "sheet",
			},
			{
				text: "Extra detail anchored to a trigger without blocking the page.",
				use: "popover",
			},
		],
		responsive: [
			"`size` caps the width (sm, md, lg, xl) and the dialog always keeps a 1rem margin from the viewport edge.",
		],
		performance: ["Content mounts only while open."],
		ai: [
			"Control it with `open` and `onOpenChange`; never toggle it with CSS.",
			"Always include a DialogTitle: it names the dialog for screen readers.",
			"Escape and the close button always dismiss; `dismissOnBackdrop` only governs outside clicks.",
			"Choose motion for spatial meaning: slide from the related edge, or keep `zoom` when there is no directional source.",
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
			entry: "Dialog",
		},
		svelte: {
			entry: "Dialog",
		},
	},
	keywords: ["dialog", "modal"],
});
