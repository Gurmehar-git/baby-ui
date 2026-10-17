import { tv } from "tailwind-variants";

export const showMore = tv({
	slots: {
		root: "w-full text-foreground",
		content: "relative",
		region:
			"scroll-area overscroll-contain rounded-sm outline-none transition-[height] duration-[var(--duration-overlay)] ease-[var(--ease-ui-out)] focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
		fade: "pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background to-transparent opacity-0 transition-opacity duration-[var(--duration-press)] ease-[var(--ease-ui-out)] motion-reduce:transition-none data-[on=true]:opacity-100",
		trigger:
			"-ml-2 mt-2 inline-flex h-8 items-center gap-1.5 rounded-md px-2 font-medium text-muted-foreground text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
		chevron:
			"size-3 transition-[rotate] duration-[var(--duration-press)] ease-[var(--ease-ui-out)] motion-reduce:transition-none data-[on=true]:rotate-180",
	},
});
