import { tv, type VariantProps } from "tailwind-variants";

export const attachment = tv({
	slots: {
		root: "card-fade-up flex w-full items-center gap-3 rounded-xl border border-border bg-background p-2.5 transition-[border-color] duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)]",
		tile: "grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-background text-muted-foreground transition-colors duration-[var(--duration-dropdown)]",
		thumb: "size-full object-cover",
		body: "min-w-0 flex-1",
		name: "truncate font-medium text-foreground text-sm",
		meta: "mt-0.5 text-muted-foreground text-xs tabular-nums",
		// Collapses by grid rows, so the row height eases instead of popping.
		progress:
			"grid transition-[grid-template-rows,opacity] ease-[var(--ease-ui-out)] motion-reduce:transition-none",
		track: "mt-1.5 h-1 w-full overflow-hidden rounded-full bg-input",
		fill: "h-full w-full origin-left rounded-full bg-primary transition-transform duration-[var(--duration-overlay)] ease-[var(--ease-ui-out)] motion-reduce:transition-none",
		action:
			"grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground outline-none transition-[background-color,color,scale] duration-[var(--duration-press)] ease-[var(--ease-ui-out)] hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] motion-reduce:transition-none",
	},
	variants: {
		status: {
			uploading: {
				tile: "text-primary",
				progress: "grid-rows-[1fr] opacity-100 duration-[var(--duration-dropdown)]",
			},
			ready: { progress: "grid-rows-[0fr] opacity-0 duration-[var(--duration-exit)]" },
			error: {
				root: "border-[color-mix(in_oklch,var(--destructive)_35%,transparent)]",
				tile: "text-destructive-strong",
				meta: "text-destructive-strong",
				progress: "grid-rows-[0fr] opacity-0 duration-[var(--duration-exit)]",
			},
		},
	},
	defaultVariants: { status: "ready" },
});

export type AttachmentStatus = NonNullable<VariantProps<typeof attachment>["status"]>;

/** File outline, and a warning for failed uploads; stroke paths on a 16px grid. */
export const ATTACHMENT_ICON: Record<"file" | "error", string> = {
	file: "M9 1.5H4A1.5 1.5 0 0 0 2.5 3v10A1.5 1.5 0 0 0 4 14.5h8a1.5 1.5 0 0 0 1.5-1.5V6L9 1.5zM9 1.5V6h4.5",
	error: "M8 5v3.5M8 11h.01M14.5 8a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z",
};
