import { defineComponent } from "@baby-ui/registry-schema";

export const drawer = defineComponent({
	slug: "drawer",
	name: "Drawer",
	description:
		"Draggable sheet on vaul, with snap points, an inset surface and the same rim as Dialog.",
	category: "base",
	status: "stable",
	variants: { direction: ["bottom", "top", "left", "right"] },
	props: [
		{
			name: "open",
			type: "boolean",
			description: "Controlled open state. Bindable in Svelte, `onOpenChange` in React.",
			control: { kind: "none" },
		},
		{
			name: "direction",
			type: '"bottom" | "top" | "left" | "right"',
			description: "Edge the drawer slides from. Vertical drawers show a drag handle.",
			default: "bottom",
			control: { kind: "select", options: ["bottom", "top", "left", "right"] },
		},
		{
			name: "dismissible",
			type: "boolean",
			description: "Escape, backdrop click and drag past the threshold close it.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "variant",
			type: '"default" | "framed"',
			description:
				"`framed` insets the body in a rim: a thin bg-background border around a bg-card surface, with a draggable pill handle. `default` is the flat shadcn/ui surface with a decorative bar (vaul drags the whole panel either way).",
			default: "default",
			control: { kind: "select", options: ["default", "framed"] },
		},
		{
			name: "snapPoints",
			type: "(number | string)[]",
			description:
				"Fractions of the viewport or lengths the drawer rests at while dragging.",
			control: { kind: "none" },
		},
		{
			name: "shouldScaleBackground",
			type: "boolean",
			description:
				"Scale the page behind the drawer, iOS style. Needs `data-vaul-drawer-wrapper` on the page root.",
			default: false,
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "vaul drops the slide and keeps the fade.",
		behaviour: [
			"Slides in over 500ms on cubic-bezier(0.32, 0.72, 0, 1), the same curve as --ease-drawer, and follows the pointer while dragging.",
			"Releasing past the close threshold finishes the slide out; releasing short snaps back or to the nearest snap point.",
			"Dragging inside the body always scrolls, never dismisses; only the handle/bar area starts a dismiss-drag.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Escape"], action: "Closes and returns focus to the trigger" },
			{ keys: ["Tab"], action: "Stays inside the drawer while it is open" },
		],
		notes: [
			"vaul renders a modal dialog with focus trapped inside and the page behind it inert.",
			"The body (`drawer-surface`) is marked `data-vaul-no-drag`, so scrolling never triggers a dismiss-drag; only the handle/bar area does, and both show cursor: grab/grabbing even though `default`'s bar isn't a separate Handle element. Every close path also exists as a button or key.",
		],
	},
	licenseOrigin: {
		source: "beUI",
		url: "https://beui.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 beUI",
	},
	impl: {
		react: {
			entry: "Drawer",
			files: [
				{ path: "drawer/drawer.tsx", type: "registry:ui" },
				{ path: "drawer/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["tailwind-variants", "clsx", "tailwind-merge", "vaul"],
		},
		svelte: {
			entry: "Drawer",
			files: [
				{ path: "drawer/drawer.svelte", type: "registry:ui" },
				{ path: "drawer/drawer-trigger.svelte", type: "registry:ui" },
				{ path: "drawer/drawer-content.svelte", type: "registry:ui" },
				{ path: "drawer/drawer-header.svelte", type: "registry:ui" },
				{ path: "drawer/drawer-footer.svelte", type: "registry:ui" },
				{ path: "drawer/drawer-title.svelte", type: "registry:ui" },
				{ path: "drawer/drawer-description.svelte", type: "registry:ui" },
				{ path: "drawer/drawer-close.svelte", type: "registry:ui" },
				{ path: "drawer/context.ts", type: "registry:ui" },
				{ path: "drawer/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: [
				"tailwind-variants",
				"vaul-svelte@^1.0.0-next.7",
				"clsx",
				"tailwind-merge",
				"bits-ui",
			],
		},
	},
	keywords: ["drawer", "sheet", "bottom sheet", "vaul"],
});
