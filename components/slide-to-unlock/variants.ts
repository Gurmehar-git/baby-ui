import { tv, type VariantProps } from "tailwind-variants";

// Root is the padded pill; the control is exactly the handle's travel, so it never clips at either end.
export const slideToUnlock = tv({
	slots: {
		root: "group/slide relative grid min-w-0 rounded-full inset-ring-1 data-disabled:pointer-events-none data-disabled:opacity-50 data-[loading]:opacity-100",
		control:
			"relative flex h-(--slide-handle) touch-none select-none items-center rounded-full has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-background",
		track: "absolute inset-0 overflow-hidden rounded-full",
		range:
			"slider-glide absolute inset-y-0 left-0 rounded-full transition-colors duration-(--duration-fast)",
		text: "pointer-events-none absolute inset-y-0 right-3 left-[calc(var(--slide-handle)+--spacing(2))] grid place-items-center truncate font-medium transition-opacity duration-(--duration-fast)",
		thumb: [
			"slider-glide z-1 grid size-(--slide-handle) cursor-grab place-items-center rounded-full shadow-sm outline-none",
			"transition-[scale,box-shadow] duration-(--duration-fast) ease-(--ease-ui-out) active:cursor-grabbing active:scale-(--press-scale) data-[dragging]:scale-(--press-scale) motion-reduce:transition-none",
		],
	},
	variants: {
		variant: {
			default: {
				root: "bg-primary/10 inset-ring-primary/15",
				range: "bg-primary/15",
				text: "text-primary",
				thumb: "bg-primary text-primary-foreground",
			},
			secondary: {
				root: "bg-muted inset-ring-foreground/10",
				range: "bg-foreground/[0.08]",
				text: "text-muted-foreground",
				thumb: "bg-background text-foreground",
			},
			destructive: {
				root: "bg-destructive/10 inset-ring-destructive/20",
				range: "bg-destructive/15",
				text: "text-destructive-strong",
				thumb: "bg-destructive text-destructive-foreground",
			},
			success: {
				root: "bg-success/10 inset-ring-success/20",
				range: "bg-success/15",
				text: "text-success-strong",
				thumb: "bg-success text-success-foreground",
			},
			warning: {
				root: "bg-warning/10 inset-ring-warning/20",
				range: "bg-warning/15",
				text: "text-warning-strong",
				thumb: "bg-warning text-warning-foreground",
			},
			info: {
				root: "bg-info/10 inset-ring-info/20",
				range: "bg-info/15",
				text: "text-info-strong",
				thumb: "bg-info text-info-foreground",
			},
		},
		// Outer heights match Button's control ladder: 24, 32, 36, 40 and 48px.
		size: {
			xs: {
				root: "w-48 max-w-full p-0.5 text-xs [--slide-handle:--spacing(5)]",
				thumb: "[&_svg]:size-3",
			},
			sm: {
				root: "w-56 max-w-full p-0.5 text-xs [--slide-handle:--spacing(7)]",
				thumb: "[&_svg]:size-3.5",
			},
			default: {
				root: "w-64 max-w-full p-0.5 text-sm [--slide-handle:--spacing(8)]",
				thumb: "[&_svg]:size-4",
			},
			lg: {
				root: "w-72 max-w-full p-1 text-sm [--slide-handle:--spacing(8)]",
				thumb: "[&_svg]:size-4.5",
			},
			xl: {
				root: "w-80 max-w-full p-1 text-base [--slide-handle:--spacing(10)]",
				thumb: "[&_svg]:size-5",
			},
		},
	},
	defaultVariants: { variant: "default", size: "xl" },
});

export type SlideToUnlockVariant = NonNullable<
	VariantProps<typeof slideToUnlock>["variant"]
>;
export type SlideToUnlockSize = NonNullable<VariantProps<typeof slideToUnlock>["size"]>;
