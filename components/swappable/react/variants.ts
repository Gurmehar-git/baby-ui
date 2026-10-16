import { tv, type VariantProps } from "tailwind-variants";

/** Swapy marks the slot under the pointer `data-swapy-highlighted` and the lifted item `data-swapy-dragging`. */
export const swappable = tv({
	slots: {
		root: "",
		slot: [
			"rounded-xl outline-2 outline-transparent -outline-offset-2 outline-dashed",
			"transition-[background-color,outline-color] duration-(--duration-fast) ease-[var(--ease-ui-out)] motion-reduce:transition-none",
			"data-[swapy-highlighted]:bg-primary/5 data-[swapy-highlighted]:outline-primary/40",
		],
		// Without a SwappableHandle inside, the whole item is the grip.
		item: [
			"relative h-full cursor-grab touch-none select-none outline-none has-[[data-swapy-handle]]:cursor-auto",
			"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
			"data-[swapy-dragging]:z-10 data-[swapy-dragging]:cursor-grabbing",
		],
		handle: [
			"inline-flex shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground",
			"transition-colors hover:bg-accent hover:text-accent-foreground active:cursor-grabbing [&_svg]:size-4",
		],
	},
	variants: {
		variant: {
			// Items read as cards that lift while dragged.
			card: {
				item: [
					"rounded-xl border border-border bg-card shadow-sm",
					"transition-[box-shadow,border-color] duration-(--duration-fast) ease-[var(--ease-ui-out)] motion-reduce:transition-none",
					"data-[swapy-dragging]:border-border-strong data-[swapy-dragging]:shadow-2xl",
				],
			},
			// No chrome: the item is whatever you put in it.
			plain: { item: "rounded-xl" },
		},
	},
	defaultVariants: { variant: "card" },
});

export type SwappableVariant = NonNullable<VariantProps<typeof swappable>["variant"]>;
