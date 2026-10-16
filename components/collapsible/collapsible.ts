import { defineComponent } from "@baby-ui/registry-schema";

export const collapsible = defineComponent({
	slug: "collapsible",
	name: "Collapsible",
	description:
		"Single disclosure with animated height and nothing measured in JavaScript.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "open",
			type: "boolean",
			description: "Open state. Bindable.",
			default: false,
			control: { kind: "boolean" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The panel opens instantly; the chevron still rotates.",
		behaviour: [
			"Height animates through grid-template-rows from 0fr to 1fr, so no JavaScript measures anything and content of any length opens at the same speed.",
			"The chevron rotates over the same 200ms.",
		],
	},
	a11y: {
		keyboard: [{ keys: ["Enter", "Space"], action: "Toggles the panel" }],
		notes: [
			"A button with aria-expanded and aria-controls pointing at the region.",
			"State and keyboard are delegated to Base UI (React) and bits-ui (Svelte); this component only owns the classes and data-slots.",
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
			entry: "Collapsible",
			files: [
				{ path: "collapsible/collapsible.tsx", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "@base-ui/react"],
		},
		svelte: {
			entry: "Collapsible",
			files: [
				{ path: "collapsible/collapsible.svelte", type: "registry:ui" },
				{ path: "collapsible/collapsible-trigger.svelte", type: "registry:ui" },
				{ path: "collapsible/collapsible-content.svelte", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "bits-ui"],
		},
	},
	keywords: ["collapsible"],
});
