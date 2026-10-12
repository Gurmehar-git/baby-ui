import { tv, type VariantProps } from "tailwind-variants";
import { controlSize, fieldFrame } from "../lib/control";

export const combobox = tv({
	slots: {
		trigger: [
			fieldFrame({ kind: "trigger" }),
			"inline-flex w-full items-center justify-between font-normal",
		],
		// As wide as its trigger: Base UI sets --anchor-width, bits-ui --bits-popover-anchor-width.
		content:
			"w-[var(--anchor-width,var(--bits-popover-anchor-width))] overflow-hidden p-0",
		list: [
			"rounded-none border-none bg-transparent shadow-none",
			"[&_[data-slot=command-input]]:h-full [&_[data-slot=command-input]]:text-base",
		],
	},
	variants: {
		// Rows match Select's (xs 24 to xl 40); rows keep one inline padding, so headings align.
		size: {
			xs: {
				trigger: [controlSize({ size: "xs" }), "gap-1 px-2"],
				list: [
					"max-h-56 [&_[data-slot=command-empty]]:text-xs",
					"[&_[data-slot=command-input-wrapper]]:h-7 md:[&_[data-slot=command-input]]:text-xs",
					"[&_[data-slot=command-item]]:py-1 [&_[data-slot=command-item]]:text-xs",
				],
			},
			sm: {
				trigger: [controlSize({ size: "sm" }), "gap-1.5 px-2.5"],
				list: [
					"max-h-64 [&_[data-slot=command-empty]]:text-xs",
					"[&_[data-slot=command-input-wrapper]]:h-8 md:[&_[data-slot=command-input]]:text-xs",
					"[&_[data-slot=command-item]]:py-1.5 [&_[data-slot=command-item]]:text-xs",
				],
			},
			default: {
				trigger: [controlSize({ size: "default" }), "gap-2 px-3"],
				list: [
					"max-h-72 [&_[data-slot=command-empty]]:text-sm",
					"[&_[data-slot=command-input-wrapper]]:h-8 md:[&_[data-slot=command-input]]:text-sm",
					"[&_[data-slot=command-item]]:py-1.5 [&_[data-slot=command-item]]:text-sm",
				],
			},
			lg: {
				trigger: [controlSize({ size: "lg" }), "gap-2 px-3.5 [&_svg]:size-4"],
				list: [
					"max-h-80 [&_[data-slot=command-empty]]:text-sm",
					"[&_[data-slot=command-input-wrapper]]:h-9 md:[&_[data-slot=command-input]]:text-sm",
					"[&_[data-slot=command-item]]:py-2 [&_[data-slot=command-item]]:text-sm",
				],
			},
			xl: {
				trigger: [controlSize({ size: "xl" }), "gap-2.5 px-4 [&_svg]:size-4.5"],
				list: [
					"max-h-96 [&_[data-slot=command-empty]]:text-base",
					"[&_[data-slot=command-input-wrapper]]:h-10",
					"[&_[data-slot=command-item]]:py-2 [&_[data-slot=command-item]]:text-base",
				],
			},
		},
	},
	defaultVariants: { size: "default" },
});

export type ComboboxSize = NonNullable<VariantProps<typeof combobox>["size"]>;
