import { defineComponent } from "../index.ts";

export const spinner = defineComponent({
	slug: "spinner",
	name: "Spinner",
	description: "Indeterminate loading indicator with an accessible name.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "size",
			type: '"sm" | "default" | "lg" | "xl"',
			description: "Diameter.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg", "xl"] },
		},
		{
			name: "label",
			type: "string",
			description: "Announced name. Say what is loading, not just Loading.",
			default: "Loading",
			control: { kind: "text" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The spin slows to 2s instead of stopping.",
		behaviour: [
			"Rotates at 850ms linear. A faster spinner makes the wait feel shorter even when the wait is identical.",
			"Under reduced motion it slows to 2s rather than stopping, because a frozen spinner reads as a hang.",
		],
	},
	a11y: {
		role: "status",
		keyboard: [],
		notes: [
			"role=status with an accessible name, so the spinner is announced once rather than being a silent graphic.",
			"Give it a specific label: Loading results beats Loading.",
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
			entry: "Spinner",
			files: [
				{ path: "spinner/spinner.tsx", type: "registry:ui" },
				{ path: "spinner/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "Spinner",
			files: [
				{ path: "spinner/spinner.svelte", type: "registry:ui" },
				{ path: "spinner/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["spinner"],
});
