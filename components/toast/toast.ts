import { defineComponent } from "@baby-ui/registry-schema";

export const toast = defineComponent({
	slug: "toast",
	name: "Toast",
	description: "A styled stack on sonner: one Toaster, then toast() from anywhere.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "position",
			type: '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"',
			description: "Corner the stack grows from.",
			default: "bottom-right",
			control: {
				kind: "select",
				options: [
					"top-left",
					"top-center",
					"top-right",
					"bottom-left",
					"bottom-center",
					"bottom-right",
				],
			},
		},
		{
			name: "expand",
			type: "boolean",
			description:
				"Show every toast at full size. Off collapses older ones behind the newest.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "closeButton",
			type: "boolean",
			description: "Round close control on each toast.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "visibleToasts",
			type: "number",
			description: "How many toasts show before older ones collapse behind.",
			default: 4,
			control: { kind: "none" },
		},
		{
			name: "duration",
			type: "number",
			description:
				"Milliseconds a toast stays. Per-call `duration` overrides it; `Infinity` keeps it.",
			default: 4000,
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "sonner drops the slide and keeps the fade.",
		behaviour: [
			"A new toast slides in from its edge and older ones scale back into a stack that expands on hover.",
			"Swipe or close removes it with the reverse slide; the stack closes up as it leaves.",
		],
	},
	a11y: {
		keyboard: [{ keys: ["Tab"], action: "Reaches each toast's close button" }],
		notes: [
			"sonner renders an aria-live region, so a new toast is announced without interrupting.",
			"Timers pause while the pointer is over the stack and while the page is hidden.",
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
			entry: "Toaster",
			files: [
				{ path: "lib/cn.ts", type: "registry:lib" },
				{ path: "toast/toaster.tsx", type: "registry:ui" },
				{ path: "lib/toast-classes.ts", type: "registry:lib" },
			],
			dependencies: ["tailwind-merge", "clsx", "sonner"],
		},
		svelte: {
			entry: "Toaster",
			files: [
				{ path: "lib/cn.ts", type: "registry:lib" },
				{ path: "toast/toaster.svelte", type: "registry:ui" },
				{ path: "lib/toast-classes.ts", type: "registry:lib" },
			],
			dependencies: ["tailwind-merge", "clsx", "svelte-sonner"],
		},
	},
	keywords: ["toast", "sonner", "notification"],
});
