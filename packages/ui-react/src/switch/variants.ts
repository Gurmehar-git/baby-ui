import { tv, type VariantProps } from "tailwind-variants";

export const switchTrack = tv({
	base: [
		"group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent bg-(--track) p-px",
		"transition-[background-color,box-shadow] duration-(--duration-slow) ease-[var(--ease-smooth)] motion-reduce:transition-none",
		"outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
		"aria-checked:bg-primary aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
		"aria-invalid:border-destructive data-[invalid]:border-destructive",
	],
	variants: {
		size: {
			sm: "h-4 w-8",
			default: "h-5 w-10",
			lg: "h-6 w-12",
			xl: "h-7 w-14",
		},
	},
	defaultVariants: { size: "default" },
});

// A pill thumb that stretches toward its travel while pressed, as iOS switches do.
export const switchThumb = tv({
	base: [
		"switch-thumb rounded-full bg-background shadow-sm",
		"origin-left data-[checked]:origin-right group-active/switch:scale-x-[1.15] motion-reduce:group-active/switch:scale-x-100",
	],
	variants: {
		size: {
			sm: "h-3 w-[17px] data-[checked]:translate-x-[11px]",
			default: "h-4 w-[22px] data-[checked]:translate-x-3.5",
			lg: "h-5 w-7 data-[checked]:translate-x-4",
			xl: "h-6 w-8 data-[checked]:translate-x-5",
		},
	},
	defaultVariants: { size: "default" },
});

export type SwitchSize = NonNullable<VariantProps<typeof switchTrack>["size"]>;
