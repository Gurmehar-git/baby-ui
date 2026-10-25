import { defineComponent } from "@baby-ui/registry-schema";

export const scrollArea = defineComponent({
	slug: "scroll-area",
	name: "Scroll Area",
	description:
		"Scroll container with edge fades that appear only when there is more to see.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "maxHeight",
			type: "string",
			description: "CSS max-height for the viewport.",
			default: "16rem",
			control: { kind: "text" },
		},
		{
			name: "scrollbar",
			type: '"auto" | "hidden"',
			description:
				"Whether to render the custom scrollbar. Hidden keeps scrolling but removes the track, corner and gutter.",
			default: "auto",
			control: { kind: "select", options: ["auto", "hidden"] },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Unchanged; the fades are not motion.",
		behaviour: [
			"Top and bottom fades appear only when content is actually clipped in that direction, so a short list has no false edge.",
			"They fade over 150ms, which is below the threshold where the change itself draws attention.",
			"Nested regions contain overscroll, so a wheel or trackpad gesture does not move the page behind a sidebar or panel.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Arrow keys", "Page Up", "Page Down"],
				action: "Scrolls the region natively",
			},
		],
		notes: [
			"The viewport still scrolls via real overflow, so keyboard scrolling, momentum and screen-reader virtual cursors all keep working. `scrollbar=hidden` changes only the visual affordance and reserved gutter.",
			"Positioning, drag-to-scroll and auto-hide are delegated to Base UI (React) and bits-ui (Svelte); this component only owns the classes and data-slots.",
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
			entry: "ScrollArea",
		},
		svelte: {
			entry: "ScrollArea",
		},
	},
	keywords: ["scroll", "area"],
});
