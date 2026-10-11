import { defineComponent } from "../index.ts";

export const recommendationCard = defineComponent({
	slug: "recommendation-card",
	name: "Recommendation Card",
	description:
		"A single recommendation that holds its shape while switching between options.",
	category: "agents",
	status: "stable",
	props: [
		{
			name: "title",
			type: "string",
			description: "The question or framing above the active option's body.",
			control: { kind: "text" },
		},
		{
			name: "options",
			type: "RecommendationOption[]",
			description:
				"Every candidate option, including the one shown first. Picking an alternative from the drawer promotes it in place.",
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "Partial<RecommendationLabels>",
			description:
				"UI copy: the alternatives toggle, the drawer heading, and the accepted state's label.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The active option's body swap is opacity-only already; no travel to drop.",
		behaviour: [
			"Switching the active option re-triggers the body's fade-in (keyed by the option, not animated between old/new content).",
			"The alternatives drawer collapses via `grid-template-rows` (1fr → 0fr) rather than unmounting, so the transition animates.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Tab"],
				action: "Reaches the alternatives toggle, each alternative row, and the CTA",
			},
		],
		notes: [
			"The alternatives toggle carries `aria-expanded` reflecting the drawer's open state.",
			'Confidence is shown as a 3-bar meter plus a text label ("High confidence"/"Needs review"/"No signal"), never colour alone.',
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
			entry: "RecommendationCard",
			files: [
				{ path: "recommendation-card/recommendation-card.tsx", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge"],
			registryDependencies: ["button"],
		},
		svelte: {
			entry: "RecommendationCard",
			files: [
				{ path: "recommendation-card/recommendation-card.svelte", type: "registry:ui" },
				{ path: "recommendation-card/types.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge"],
			registryDependencies: ["button"],
		},
	},
	keywords: ["recommendation", "confidence", "agent", "suggestion"],
});
