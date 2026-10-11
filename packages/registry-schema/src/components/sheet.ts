import { defineComponent } from "../index.ts";

export const sheet = defineComponent({
	slug: "sheet",
	name: "Sheet",
	description:
		"Panel that slides in from any edge, with focus moved inside and Escape to close.",
	category: "base",
	status: "stable",
	isUpdated: true,
	variants: { variant: ["default", "framed"] },
	props: [
		{
			name: "variant",
			type: '"default" | "framed"',
			description:
				"SheetContent: `framed` insets the body in a card-step rim, like Dialog and Drawer. `default` is the flat shadcn/ui surface.",
			default: "default",
			control: { kind: "select", options: ["default", "framed"] },
		},
		{
			name: "open",
			type: "boolean",
			description: "Whether the sheet is shown. Bindable.",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "side",
			type: '"left" | "right" | "top" | "bottom"',
			description: "SheetContent: the edge it slides from.",
			default: "right",
			control: { kind: "select", options: ["left", "right", "top", "bottom"] },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The panel appears in place without travelling.",
		behaviour: [
			"The panel slides in from its own edge over 250ms and back out over 200ms on the drawer easing.",
			"The backdrop fades on the same curve and timing, so panel and backdrop finish together.",
		],
	},
	a11y: {
		role: "dialog",
		keyboard: [{ keys: ["Escape"], action: "Closes the sheet" }],
		notes: [
			"aria-modal with a labelled heading. Focus moves to the first control inside on open.",
			"Prefer `bottom` on phones: it is the reachable part of the screen.",
			"Built on the same Dialog primitive (Base UI/bits-ui) as Dialog itself, just with a side-anchored panel instead of a centered one.",
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
			entry: "Sheet",
			files: [
				{ path: "sheet/sheet.tsx", type: "registry:ui" },
				{ path: "sheet/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "@base-ui/react"],
		},
		svelte: {
			entry: "Sheet",
			files: [
				{ path: "sheet/sheet.svelte", type: "registry:ui" },
				{ path: "sheet/sheet-trigger.svelte", type: "registry:ui" },
				{ path: "sheet/sheet-content.svelte", type: "registry:ui" },
				{ path: "sheet/sheet-header.svelte", type: "registry:ui" },
				{ path: "sheet/sheet-title.svelte", type: "registry:ui" },
				{ path: "sheet/sheet-description.svelte", type: "registry:ui" },
				{ path: "sheet/sheet-footer.svelte", type: "registry:ui" },
				{ path: "sheet/sheet-close.svelte", type: "registry:ui" },
				{ path: "sheet/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "bits-ui"],
		},
	},
	keywords: ["sheet"],
});
