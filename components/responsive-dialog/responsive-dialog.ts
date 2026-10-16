import { defineComponent } from "@baby-ui/registry-schema";

export const responsiveDialog = defineComponent({
	slug: "responsive-dialog",
	name: "Responsive Dialog",
	description: "Dialog on desktop, Drawer on mobile, behind one prop API.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "open",
			type: "boolean",
			description: "Controlled open state. Bindable in Svelte, `onOpenChange` in React.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: '"default" | "framed"',
			description:
				"Shared frame treatment, forwarded to whichever surface renders (Dialog's or Drawer's own `variant`).",
			default: "default",
			control: { kind: "select", options: ["default", "framed"] },
		},
		{
			name: "size",
			type: '"sm" | "default" | "lg" | "xl"',
			description: "Desktop (Dialog) only: panel width.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg", "xl"] },
		},
		{
			name: "dismissOnBackdrop",
			type: "boolean",
			description: "Desktop (Dialog) only: click outside the panel closes it.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "direction",
			type: '"bottom" | "top" | "left" | "right"',
			description: "Mobile (Drawer) only: edge the drawer slides from.",
			default: "bottom",
			control: { kind: "select", options: ["bottom", "top", "left", "right"] },
		},
		{
			name: "dismissible",
			type: "boolean",
			description:
				"Mobile (Drawer) only: escape, backdrop click and drag past the threshold close it.",
			default: true,
			control: { kind: "boolean" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Inherited from whichever surface is active: Dialog appears at full size, Drawer drops the slide and keeps the fade.",
		behaviour: [
			"The breakpoint switch (Tailwind's md, 768px) is read once per mount via a matchMedia listener, so resizing across it live re-renders the correct surface.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Escape"], action: "Closes and returns focus to the trigger" },
			{ keys: ["Tab"], action: "Stays inside the open surface" },
		],
		notes: [
			"Renders the real Dialog or Drawer component underneath, so every a11y guarantee of the active surface (focus trap, aria-labelledby/describedby wiring, inert background) carries over unchanged.",
			"SSR/first paint defaults to the desktop (Dialog) branch, since the server can't read the viewport; corrects on mount for mobile viewports.",
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
			entry: "ResponsiveDialog",
			files: [
				{ path: "responsive-dialog/responsive-dialog.tsx", type: "registry:ui" },
				{ path: "lib/use-is-mobile.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge"],
			registryDependencies: ["dialog", "drawer"],
		},
		svelte: {
			entry: "ResponsiveDialog",
			files: [
				{ path: "responsive-dialog/responsive-dialog.svelte", type: "registry:ui" },
				{
					path: "responsive-dialog/responsive-dialog-trigger.svelte",
					type: "registry:ui",
				},
				{
					path: "responsive-dialog/responsive-dialog-content.svelte",
					type: "registry:ui",
				},
				{
					path: "responsive-dialog/responsive-dialog-header.svelte",
					type: "registry:ui",
				},
				{
					path: "responsive-dialog/responsive-dialog-footer.svelte",
					type: "registry:ui",
				},
				{ path: "responsive-dialog/responsive-dialog-title.svelte", type: "registry:ui" },
				{
					path: "responsive-dialog/responsive-dialog-description.svelte",
					type: "registry:ui",
				},
				{ path: "responsive-dialog/responsive-dialog-close.svelte", type: "registry:ui" },
				{ path: "responsive-dialog/context.ts", type: "registry:ui" },
				{ path: "lib/use-is-mobile.svelte.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "vaul-svelte@^1.0.0-next.7", "bits-ui"],
			registryDependencies: ["dialog", "drawer"],
		},
	},
	keywords: ["responsive", "dialog", "drawer", "modal", "sheet"],
});
