import { tv, type VariantProps } from "tailwind-variants";
import { controlSize, fieldFrame } from "../../lib/react/control";

// Open state is `data-popup-open` from Base UI and `data-state=open` from bits-ui.
export const selectTrigger = tv({
	base: "inline-flex items-center justify-between",
	variants: {
		variant: {
			default: [fieldFrame({ kind: "trigger" }), "w-full"],
			// Text and a chevron: a compact switch beside a heading, not a form field.
			ghost: [
				"w-auto font-medium text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring",
				"transition-[color,background-color,scale] duration-(--duration-fast) ease-(--ease-ui-out) motion-reduce:transition-none",
				"hover:bg-accent hover:text-accent-foreground active:scale-[var(--press-scale-sm)]",
				"data-[popup-open]:bg-accent data-[popup-open]:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground",
				"disabled:cursor-not-allowed disabled:opacity-50",
			],
		},
		// The chevron stays a step under the ladder's icon at lg and xl.
		size: {
			xs: [controlSize({ size: "xs" }), "gap-1 px-2"],
			sm: [controlSize({ size: "sm" }), "gap-1.5 px-2.5"],
			default: [controlSize({ size: "default" }), "gap-2 px-3"],
			lg: [controlSize({ size: "lg" }), "gap-2 px-3.5 [&_svg]:size-4"],
			xl: [controlSize({ size: "xl" }), "gap-2.5 px-4 [&_svg]:size-4.5"],
		},
	},
	defaultVariants: { variant: "default", size: "default" },
});

// Pair with the trigger's size. Rows: xs 24, sm 28, default 32, lg 36, xl 40; the xs surface
// drops to rounded-lg so its rows stay concentric.
export const selectContent = tv({
	variants: {
		size: {
			xs: [
				"rounded-lg",
				"**:data-[slot=select-item]:gap-1.5 **:data-[slot=select-item]:rounded-sm **:data-[slot=select-item]:px-2 **:data-[slot=select-item]:py-1 **:data-[slot=select-item]:text-xs",
				"[&_[data-slot=select-item]_svg]:size-3",
			],
			sm: "**:data-[slot=select-item]:text-xs [&_[data-slot=select-item]_svg]:size-3",
			default: "",
			lg: "**:data-[slot=select-item]:py-2 [&_[data-slot=select-item]_svg]:size-4",
			xl: [
				"**:data-[slot=select-item]:px-3 **:data-[slot=select-item]:py-2 **:data-[slot=select-item]:text-base",
				"[&_[data-slot=select-item]_svg]:size-4",
			],
		},
	},
	defaultVariants: { size: "default" },
});

export type SelectContentSize = NonNullable<VariantProps<typeof selectContent>["size"]>;

export type SelectTriggerVariant = NonNullable<
	VariantProps<typeof selectTrigger>["variant"]
>;
export type SelectTriggerSize = NonNullable<VariantProps<typeof selectTrigger>["size"]>;
