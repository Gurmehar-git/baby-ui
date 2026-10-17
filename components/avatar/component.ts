import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { avatar as avatarVariants } from "./variants";

export const avatar = defineComponent({
	slug: "avatar",
	name: "Avatar",
	description: "User image with initials underneath, shown until the image really loads.",
	category: "base",
	status: "stable",
	variants: variantsOf(avatarVariants, ["size", "shape"]),
	props: [
		{
			name: "src",
			type: "string",
			description:
				"AvatarImage source. The fallback renders until it loads, and stays if it errors.",
			control: { kind: "text", placeholder: "https://…" },
		},
		{
			name: "size",
			type: '"sm" | "default" | "lg" | "xl"',
			description: "Diameter of the avatar.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg", "xl"] },
		},
		{
			name: "shape",
			type: '"circle" | "square"',
			description: "Circle for people, square for organisations.",
			default: "circle",
			control: { kind: "select", options: ["circle", "square"] },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The image appears without the fade.",
		behaviour: [
			"The image fades in over 200ms once loaded, so a cached image does not flash against the fallback.",
			"Initials are the first letter of the first and last word of `name`, uppercased.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"The image carries `name` as alt text. While it hasn't loaded (or failed), the image is aria-hidden and the initials fallback is the one thing assistive tech sees; once it loads, the fallback unmounts and the image alone is exposed.",
			"Image load/error tracking is delegated to Base UI (React) and bits-ui (Svelte); this component only owns the fade transition and data-slots.",
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
			entry: "Avatar",
		},
		svelte: {
			entry: "Avatar",
		},
	},
	keywords: [
		"avatar",
		"profile",
		"user",
		"initials",
		"avatar group",
		"presence",
		"badge",
	],
});
