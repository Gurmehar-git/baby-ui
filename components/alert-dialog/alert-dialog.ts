import { defineComponent } from "@baby-ui/registry-schema";

export const alertDialog = defineComponent({
	slug: "alert-dialog",
	name: "Alert Dialog",
	description:
		"Blocking confirmation with the safe action focused and the destructive one styled.",
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
			name: "destructive",
			type: "boolean",
			description: "AlertDialogAction: style the confirming action as destructive.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "variant",
			type: '"default" | "framed"',
			description:
				"`framed` insets the body in the same rim as Dialog. `default` is the flat shadcn/ui surface.",
			default: "default",
			control: { kind: "select", options: ["default", "framed"] },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The panel appears at full size.",
		behaviour: [
			"Same entry as the modal, because it is the same surface with a narrower job.",
		],
	},
	a11y: {
		role: "alertdialog",
		keyboard: [{ keys: ["Escape"], action: "Cancels" }],
		notes: [
			"role=alertdialog, so assistive tech announces it as an interruption rather than a passive dialog.",
			"Focus lands on cancel, never on the destructive action. A confirmation that focuses Delete turns a reflexive Enter into data loss.",
			"aria-describedby points at the consequence, so it is read with the title.",
			'`variant="default"` renders a single flat surface, matching the shadcn/ui baseline.',
			"Part names and data-slot values match shadcn/ui, so this replaces an existing alert dialog without touching call sites.",
			"Focus starts on the cancel button.",
		],
	},
	guidance: {
		when: [
			"Confirming an action that cannot be undone: delete, revoke, discard changes.",
			"A decision the user must make before continuing, with exactly two outcomes.",
		],
		whenNot: [
			{ text: "A form or anything longer than a short question.", use: "dialog" },
			{
				text: "Reporting that something happened, with nothing to decide.",
				use: "toast",
			},
		],
		responsive: [],
		performance: ["Content mounts only while open."],
		ai: [
			"Focus starts on Cancel by design; never move initial focus to the destructive action.",
			"Set `destructive` so the confirming action takes the destructive style.",
			"State the consequence in AlertDialogDescription; it is read together with the title.",
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
			entry: "AlertDialog",
			files: [
				{ path: "button/variants.ts", type: "registry:ui" },
				{ path: "alert-dialog/alert-dialog.tsx", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["tailwind-variants", "@base-ui/react", "clsx", "tailwind-merge"],
			// Reuses Dialog's dialogFrame (backdrop, popup) and DialogVariant type.
			registryDependencies: ["dialog"],
		},
		svelte: {
			entry: "AlertDialog",
			files: [
				{ path: "button/variants.ts", type: "registry:ui" },
				{ path: "alert-dialog/alert-dialog.svelte", type: "registry:ui" },
				{ path: "alert-dialog/alert-dialog-trigger.svelte", type: "registry:ui" },
				{ path: "alert-dialog/alert-dialog-content.svelte", type: "registry:ui" },
				{ path: "alert-dialog/alert-dialog-header.svelte", type: "registry:ui" },
				{ path: "alert-dialog/alert-dialog-title.svelte", type: "registry:ui" },
				{ path: "alert-dialog/alert-dialog-description.svelte", type: "registry:ui" },
				{ path: "alert-dialog/alert-dialog-footer.svelte", type: "registry:ui" },
				{ path: "alert-dialog/alert-dialog-cancel.svelte", type: "registry:ui" },
				{ path: "alert-dialog/alert-dialog-action.svelte", type: "registry:ui" },
				{ path: "alert-dialog/context.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["tailwind-variants", "bits-ui", "clsx", "tailwind-merge"],
			registryDependencies: ["dialog"],
		},
	},
	keywords: ["alert", "dialog"],
});
