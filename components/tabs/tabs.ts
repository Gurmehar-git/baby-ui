import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { tabsFrame as tabsFrameVariants } from "./react/variants";

export const tabs = defineComponent({
	slug: "tabs",
	name: "Tabs",
	description:
		"Panel switcher with a sliding indicator and a list that scrolls when it overflows.",
	category: "base",
	status: "stable",
	variants: variantsOf(tabsFrameVariants, ["variant", "size"]),
	props: [
		{
			name: "value",
			type: "string",
			description: "Active tab id. Bindable.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: '"pill" | "underline" | "segment" | "soft" | "outline" | "enclosed"',
			description: "Indicator treatment.",
			default: "pill",
			control: {
				kind: "select",
				options: ["pill", "underline", "segment", "soft", "outline", "enclosed"],
			},
		},
		{
			name: "size",
			type: '"xs" | "sm" | "default" | "lg" | "xl"',
			description: "Control size.",
			default: "default",
			control: { kind: "select", options: ["xs", "sm", "default", "lg", "xl"] },
		},
		{
			name: "orientation",
			type: '"horizontal" | "vertical"',
			description:
				"Vertical stacks the triggers, grows the list with them and moves arrow keys to up and down. Underline and enclosed drop their edge marker when vertical.",
			default: "horizontal",
			control: { kind: "select", options: ["horizontal", "vertical"] },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The indicator jumps between tabs; labels still change colour.",
		behaviour: [
			"The indicator is measured from the active tab's box and slides over 200ms, so it tracks font loading and resize.",
			"A duplicate label clipped to the indicator carries the active colour, so the text recolours exactly as the indicator passes rather than cross-fading.",
			"When the list is wider than its container it scrolls, the overflowing edges fade under a mask, and arrow buttons appear over the fade.",
			"Selecting or focusing a tab scrolls it clear of those arrows rather than under them.",
		],
	},
	a11y: {
		role: "tablist",
		keyboard: [
			{ keys: ["Arrow keys"], action: "Moves between tabs" },
			{ keys: ["Home", "End"], action: "Jumps to the first and last tab" },
		],
		notes: [
			"Each tab is aria-controls linked to its panel, and the panel is aria-labelledby its tab.",
			"Selection follows focus (arrow keys switch immediately, not just Enter/Space): Base UI's List has `activateOnFocus` set explicitly since it otherwise defaults to manual activation, unlike bits-ui which defaults to automatic.",
			"Positioning, roving focus, keyboard nav and panel mount/hide are delegated to Base UI (React) and bits-ui (Svelte); this component only owns the sliding-indicator measurement, overflow-scroll arrows and data-slots.",
		],
	},
	guidance: {
		when: [
			"Switching between views of one subject: Overview, Activity, Settings.",
			"Peer panels where only one needs to be visible at a time.",
		],
		whenNot: [
			{
				text: "Moving between pages: use links in site navigation.",
				use: "navigation-menu",
			},
			{ text: "Choosing a value for a form or a filter.", use: "toggle-group" },
			{ text: "Sections a reader may want open side by side.", use: "accordion" },
		],
		responsive: [
			"When triggers overflow, the list scrolls horizontally, with scroll buttons, and keeps the active tab in view.",
		],
		performance: [
			"Every panel stays mounted so switching is instant; load heavy panel content lazily yourself.",
		],
		ai: [
			"Give every TabsTrigger and TabsContent the same `value`; the active one comes from `value` or `defaultValue`.",
			"Keep labels short and parallel; tabs are for views, not steps in a flow.",
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
			entry: "Tabs",
		},
		svelte: {
			entry: "Tabs",
		},
	},
	keywords: ["tabs", "navigation", "segmented"],
});
