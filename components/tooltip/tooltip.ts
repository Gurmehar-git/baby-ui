import { defineComponent } from "@baby-ui/registry-schema";

export const tooltip = defineComponent({
	slug: "tooltip",
	name: "Tooltip",
	description:
		"Delayed label anchored to its trigger, shown on hover and on keyboard focus.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "label",
			type: "string",
			description:
				"Demo only: the TooltipContent text. Keep it short; a tooltip is not a paragraph.",
			default: "Copy to clipboard",
			control: { kind: "text" },
		},
		{
			name: "side",
			type: '"top" | "right" | "bottom" | "left"',
			description:
				"TooltipContent: preferred side. Flips automatically when there is not room.",
			default: "top",
			control: {
				kind: "select",
				options: ["top", "right", "bottom", "left"],
			},
		},
		{
			name: "delay",
			type: "number",
			description: "Milliseconds of hover before it opens.",
			default: 400,
			control: { kind: "number", min: 0, max: 1000, step: 50 },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The tooltip appears without the scale.",
		behaviour: [
			"Hover waits `delay` before opening; focus opens immediately, because a deliberate key press is not an accidental sweep.",
			"It grows from the edge nearest the trigger over 200ms.",
		],
	},
	a11y: {
		role: "tooltip",
		keyboard: [{ keys: ["Escape"], action: "Closes the tooltip" }],
		notes: [
			"Opens on focus as well as hover, otherwise keyboard users never see it.",
			"The tooltip is aria-describedby the trigger, so it supplements the accessible name rather than replacing it.",
			"pointer-events are off, so the tooltip can never eat the click meant for the trigger.",
			"Positioning, hover-intent timing and portaling are delegated to Base UI (React) and bits-ui (Svelte); this component only owns the classes and data-slots.",
			"Svelte: bits-ui's Tooltip.Root requires a Tooltip.Provider ancestor and throws without one; Base UI's Tooltip.Root has no such requirement, so React usage is fine standalone.",
			"Focusing the trigger opens it with no delay.",
		],
	},
	guidance: {
		when: [
			"Naming an icon-only button.",
			"A short hint for a control whose purpose is not obvious.",
		],
		whenNot: [
			{ text: "Anything interactive or longer than a phrase.", use: "popover" },
			{ text: "A rich preview of a link or a person.", use: "hover-card" },
			{
				text: "Information a touch user must see: tooltips need hover or keyboard focus.",
			},
		],
		responsive: [
			"Flips and shifts to stay in the viewport; `side` sets the preferred edge.",
		],
		performance: [
			"Wrap a toolbar in TooltipProvider so moving between its triggers skips the open delay.",
		],
		ai: [
			"Never put essential information only in a tooltip.",
			"The default delay is 400ms; lower it only for dense toolbars.",
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
			entry: "Tooltip",
			files: [
				{ path: "tooltip/tooltip.tsx", type: "registry:ui" },
				{ path: "lib/anchor.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["tailwind-variants", "clsx", "tailwind-merge", "@base-ui/react"],
		},
		svelte: {
			entry: "Tooltip",
			files: [
				{ path: "tooltip/tooltip.svelte", type: "registry:ui" },
				{ path: "tooltip/tooltip-trigger.svelte", type: "registry:ui" },
				{ path: "tooltip/tooltip-content.svelte", type: "registry:ui" },
				{ path: "tooltip/tooltip-provider.svelte", type: "registry:ui" },
				{ path: "lib/anchor.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["tailwind-variants", "clsx", "tailwind-merge", "bits-ui"],
		},
	},
	keywords: ["tooltip", "overlay"],
});
