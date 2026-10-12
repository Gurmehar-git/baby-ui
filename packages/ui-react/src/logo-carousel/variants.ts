import { tv, type VariantProps } from "tailwind-variants";

export const logoCarousel = tv({
	slots: {
		root: "relative w-full",
		columns: "grid",
		// Edges fade out so logos drift in and out rather than clip.
		strip:
			"[mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)]",
		footer: "flex items-center justify-end gap-2 pt-2",
		pause: "text-muted-foreground",
	},
	variants: {
		variant: {
			columns: {},
			marquee: {},
		},
		/** `mono` greys the logos until hovered; `color` leaves them as given. */
		tone: {
			color: {},
			mono: {
				columns:
					"opacity-75 grayscale transition-[filter,opacity] duration-(--duration-base) hover:opacity-100 hover:grayscale-0",
				strip:
					"opacity-75 grayscale transition-[filter,opacity] duration-(--duration-base) hover:opacity-100 hover:grayscale-0",
			},
		},
	},
	defaultVariants: { variant: "columns", tone: "color" },
});

export type LogoCarouselVariant = NonNullable<
	VariantProps<typeof logoCarousel>["variant"]
>;
export type LogoCarouselTone = NonNullable<VariantProps<typeof logoCarousel>["tone"]>;
