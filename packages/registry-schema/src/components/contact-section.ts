import { defineComponent } from "../index.ts";

const VARIANTS = ["form", "channels", "offices"];

const files = (main: string) => [
	{ path: `contact-section/${main}`, type: "registry:ui" as const },
	{ path: "contact-section/contact.ts", type: "registry:ui" as const },
	{ path: "contact-section/variants.ts", type: "registry:ui" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
];

const deps = ["badge", "button", "field", "input", "textarea", "toggle-group"];

export const contactSection = defineComponent({
	slug: "contact-section",
	name: "Contact Section",
	description:
		"A contact section as a validated message form with a confirmation, a channel picker with details, or offices with live local times.",
	category: "blocks",
	status: "stable",
	variants: { variant: VARIANTS },
	props: [
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "A message form, ways to reach you, or office cards.",
			default: "form",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "onSubmit",
			type: "(message: ContactMessage) => void",
			description: "Form: called with name, email, topic and message once valid.",
			control: { kind: "none" },
		},
		{
			name: "status",
			type: '"idle" | "submitting" | "success" | "error"',
			description:
				"Form: success folds the form into a confirmation; error shows `error`.",
			default: "idle",
			control: { kind: "none" },
		},
		{
			name: "topics",
			type: "string[]",
			description: "Form: topic chips; the first starts chosen.",
			control: { kind: "none" },
		},
		{
			name: "channels",
			type: "{ value: string; label: string; meta?: string; detail: ReactNode | Snippet }[]",
			description:
				"Channels: the list and each one's detail panel. `channel` is bindable.",
			control: { kind: "none" },
		},
		{
			name: "offices",
			type: "ContactOffice[]",
			description: "Offices: city, IANA time zone, address, email and opening hours.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Faces swap without folding.",
		behaviour: [
			"On success the form folds into its confirmation in the same cell.",
			"Choosing a channel folds the old detail out as the new one opens.",
			"Office clocks tick each minute.",
		],
	},
	a11y: {
		keyboard: [{ keys: ["ArrowUp", "ArrowDown"], action: "Move between channels" }],
		notes: [
			"Validation waits for the first submit; messages are linked alerts.",
			"The confirmation is a polite live region; inactive faces are inert.",
			"Office open state pairs its colour with the word Open or Closed.",
		],
	},
	guidance: {
		when: ["A contact page, or the end of a sales or support page."],
		whenNot: [{ text: "A single email signup.", use: "newsletter-signup" }],
		responsive: ["Intro above the content under 48rem of container, beside it above."],
		performance: [
			"Office clocks start after mount, so server and client render the same.",
		],
		ai: ["Drive `status` from your request; keep topics to three to five."],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "ContactSection",
			files: files("contact-section.tsx"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: deps,
		},
		svelte: {
			entry: "ContactSection",
			files: files("contact-section.svelte"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: deps,
		},
	},
	keywords: ["contact", "form", "support", "offices", "channels", "section"],
});
