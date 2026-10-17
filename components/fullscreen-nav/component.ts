import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { fullscreenNav as fullscreenNavVariants } from "./variants";

const VARIANTS = ["fade", "slide", "clip"];
const ALIGNS = ["start", "center"];
const SIZES = ["md", "lg"];

export const fullscreenNav = defineComponent({
	slug: "fullscreen-nav",
	name: "Fullscreen Nav",
	description:
		"Full-viewport navigation overlay with staggered links, a current-page mark and an optional footer.",
	category: "blocks",
	status: "stable",
	variants: variantsOf(fullscreenNavVariants, ["variant", "align", "size"]),
	props: [
		{
			name: "open",
			type: "boolean",
			description:
				"Whether the overlay is shown. Controlled with onOpenChange (React also defaultOpen); bindable in Svelte.",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "links",
			type: "NavLink[]",
			description: "Navigation targets, in order; each may carry a short description.",
			control: { kind: "none" },
		},
		{
			name: "title",
			type: "string",
			description: "Accessible name for the overlay.",
			default: "Menu",
			control: { kind: "text" },
		},
		{
			name: "current",
			type: "string",
			description:
				'href of the page being viewed; that link gets aria-current="page" and an underline.',
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"Fade dissolves in place; slide drops from the top edge; clip grows as a circle from the top-right corner, where menu triggers usually sit.",
			default: "fade",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "align",
			type: ALIGNS.map((v) => `"${v}"`).join(" | "),
			description: "Links hug the left edge or sit centred.",
			default: "start",
			control: { kind: "select", options: ALIGNS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Link type scale.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "numbered",
			type: "boolean",
			description: "Prefix each link with 01, 02…",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "footer",
			type: "ReactNode | Snippet",
			description: "Content pinned under the links, e.g. contact details or socials.",
			control: { kind: "none" },
		},
		{
			name: "closeLabel",
			type: "string",
			description: "Accessible name of the close button.",
			default: "Close",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The overlay and its links only fade in place, with no travel, clip or stagger delay.",
		behaviour: [
			"The overlay fades in over 280ms and the links stagger in at 45ms intervals, which is inside the range where stagger still reads as one gesture.",
			"Links animate opacity and transform only, so a long list does not cost layout.",
			"Hovering or focusing a link dims its siblings; the dim lives on an inner row so the entrance stagger never delays it.",
		],
	},
	a11y: {
		role: "dialog",
		keyboard: [{ keys: ["Escape"], action: "Closes the overlay" }],
		notes: [
			"Body scroll is locked while open and the previous value is restored on close, rather than being blanked.",
			"aria-modal with a labelled heading.",
			"Focus moves to the first link on open.",
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
			entry: "FullscreenNav",
		},
		svelte: {
			entry: "FullscreenNav",
		},
	},
	keywords: ["fullscreen", "nav"],
});
