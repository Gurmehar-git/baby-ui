import { tv } from "tailwind-variants";

export const billingToggle = tv({
	slots: {
		item: "gap-2",
		badge: "pointer-events-none",
		price: "inline-flex flex-wrap items-baseline gap-x-2",
		amount: "font-semibold text-4xl tracking-tight",
		period: "text-muted-foreground text-sm",
		was: "text-muted-foreground text-sm line-through decoration-1",
	},
});
