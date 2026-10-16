import { defineComponent } from "@baby-ui/registry-schema";

const VARIANTS = ["panel", "plain"];
const SIZES = ["screen", "section"];
const union = (values: string[]) => values.map((v) => `"${v}"`).join(" | ");

export const orbitHero = defineComponent({
	slug: "orbit-hero",
	name: "Orbit Hero",
	description:
		"A hero whose headline sits over two counter-rotating rings of icons, with a centre dial that swaps the set and its colour.",
	category: "blocks",
	status: "stable",
	variants: { variant: VARIANTS, size: SIZES },
	props: [
		{
			name: "headline",
			type: "string",
			description: "The h1.",
			required: true,
			default: "Solar Icons for",
			control: { kind: "text" },
		},
		{
			name: "subheading",
			type: "string",
			description: "A second headline line, in the muted colour.",
			default: "Modern Frameworks",
			control: { kind: "text" },
		},
		{
			name: "description",
			type: "string",
			description: "Copy under the headline.",
			default:
				"1,451 unique icons in six styles, packaged for modern web and mobile frameworks.",
			control: { kind: "text" },
		},
		{
			name: "badge",
			type: "string",
			description: "Pill above the headline.",
			control: { kind: "text" },
		},
		{
			name: "actions",
			type: "OrbitHeroAction[]",
			description:
				"Buttons (label with href or onClick); the first is primary, the rest outlined.",
			control: { kind: "none" },
		},
		{
			name: "groups",
			type: "OrbitHeroGroup<T>[]",
			description:
				"Item sets `{ label, count?, outer, inner }`; the centre's top half cycles them and the rings cross-fade.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "item",
			type: "Snippet<[T]>",
			description:
				"Svelte: draws one ring item, sized to 32px. React takes `renderItem: (item: T) => ReactNode`.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "tones",
			type: "OrbitHeroTone[]",
			description:
				"Colours `{ label, color }` the items take; the centre's bottom half cycles them. Defaults to primary and chart 2 to 5.",
			control: { kind: "none" },
		},
		{
			name: "group",
			type: "number",
			description:
				"Index into `groups`. Svelte: bindable. React: controlled, with `defaultGroup` and `onGroupChange`.",
			default: 0,
			control: { kind: "none" },
		},
		{
			name: "tone",
			type: "number",
			description:
				"Index into `tones`. Svelte: bindable. React: controlled, with `defaultTone` and `onToneChange`.",
			default: 0,
			control: { kind: "none" },
		},
		{
			name: "interval",
			type: "number",
			description:
				"Ms between automatic changes, alternating group and tone; 0 stops them.",
			default: 4000,
			control: { kind: "number", min: 0, max: 10000, step: 500 },
		},
		{
			name: "labels",
			type: "Partial<OrbitHeroLabels>",
			description:
				'Accessible name prefixes for the two centre buttons: `{ group: "Change group", tone: "Change tone" }`.',
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: union(VARIANTS),
			description:
				"A rounded, tinted panel inset from the edges, or full bleed on the page.",
			default: "panel",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: union(SIZES),
			description: "The viewport's height (capped at 900px), or a fixed 48rem section.",
			default: "screen",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The rings stand still, nothing changes on its own, and swaps are a 120ms fade with no ripple.",
		behaviour: [
			"The outer ring turns once every 25s and the inner one every 10s the other way; items counter-rotate to stay upright.",
			"Scrolling speeds both up to six times and points them with the scroll direction; they only spin while on screen.",
			"A group change fades the old items out and the new ones in over 400ms, staggered 45ms each, while a ripple spreads from the centre.",
			"The centre labels slide out and in over 240ms and 360ms; readouts beside the wheel show from a 72rem container.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Tab"], action: "Reaches the actions and the two centre buttons" },
			{ keys: ["Enter", "Space"], action: "Advances each" },
		],
		notes: [
			"Rings, readouts, glows and noise are aria-hidden; the centre buttons name the current group and tone.",
			"Automatic changes never move focus; set `interval` to 0 for a still hero.",
		],
	},
	licenseOrigin: {
		source: "solar-icons",
		url: "https://github.com/saoudi-h/solar-icons",
		license: "MIT",
		copyright: "Copyright (c) 2024 Hakim Saoudi",
	},
	impl: {
		react: {
			entry: "OrbitHero",
			files: [
				{ path: "orbit-hero/orbit-hero.tsx", type: "registry:ui" },
				{ path: "orbit-hero/orbit.ts", type: "registry:ui" },
				{ path: "orbit-hero/types.ts", type: "registry:ui" },
				{ path: "orbit-hero/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["badge", "button"],
		},
		svelte: {
			entry: "OrbitHero",
			files: [
				{ path: "orbit-hero/orbit-hero.svelte", type: "registry:ui" },
				{ path: "orbit-hero/orbit.ts", type: "registry:ui" },
				{ path: "orbit-hero/types.ts", type: "registry:ui" },
				{ path: "orbit-hero/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["badge", "button"],
		},
	},
	keywords: [
		"hero",
		"landing",
		"orbit",
		"icons",
		"rings",
		"rotate",
		"showcase",
		"icon set",
	],
});
