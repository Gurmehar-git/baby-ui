import { tv, type VariantProps } from "tailwind-variants";

/** The row that holds attachments: one scrolling line in a composer, or wrapped in a message. */
export const attachments = tv({
	base: "flex w-full min-w-0 gap-2",
	variants: {
		variant: {
			scroll:
				"snap-x snap-mandatory overflow-x-auto overscroll-x-contain py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
			wrap: "flex-wrap",
		},
	},
	defaultVariants: { variant: "scroll" },
});

export const attachment = tv({
	slots: {
		// Arrives by unfolding its width (rows for `card`) and folds shut before a removal,
		// so neighbours glide instead of jumping.
		root: [
			"group/attachment relative grid shrink-0 snap-start transition-[grid-template-columns,grid-template-rows,opacity,scale,margin] duration-(--duration-base) ease-(--ease-ui-out)",
			"starting:opacity-0 starting:scale-96 data-[leaving=true]:pointer-events-none data-[leaving=true]:opacity-0 data-[leaving=true]:scale-96 data-[leaving=true]:duration-(--duration-fast)",
			"motion-reduce:transition-none",
		],
		clip: "min-h-0 min-w-0 overflow-hidden",
		surface:
			"relative flex items-center border border-border bg-background transition-[border-color,background-color] duration-(--duration-dropdown) ease-(--ease-ui-out)",
		preview:
			"relative grid shrink-0 place-items-center overflow-hidden border border-border bg-card text-muted-foreground transition-colors duration-(--duration-dropdown) [&_svg]:size-4",
		image: "size-full object-cover",
		type: "font-semibold text-xs uppercase",
		// The upload ring sits over a dimmed preview, so progress reads at chip size.
		ring: "pointer-events-none absolute inset-0 grid place-items-center bg-background/60 text-primary",
		ringTrack: "stroke-(--track)",
		ringFill:
			"transition-[stroke-dashoffset] duration-(--duration-overlay) ease-(--ease-ui-out) motion-reduce:transition-none",
		text: "min-w-0 flex-1",
		name: "truncate font-medium text-foreground text-sm",
		meta: "truncate text-muted-foreground text-xs tabular-nums",
		// Card only: a bar that folds away once the upload settles.
		progress:
			"grid transition-[grid-template-rows,opacity] ease-(--ease-ui-out) motion-reduce:transition-none",
		track: "mt-1.5 h-1 w-full overflow-hidden rounded-full bg-(--track)",
		fill: "h-full w-full origin-left rounded-full bg-primary transition-[scale] duration-(--duration-overlay) ease-(--ease-ui-out) motion-reduce:transition-none",
		action: [
			"grid shrink-0 place-items-center rounded-lg text-muted-foreground outline-none",
			"transition-[background-color,color,scale,opacity] duration-(--duration-press) ease-(--ease-ui-out)",
			"hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:scale-[var(--press-scale-icon)] motion-reduce:transition-none [&_svg]:size-3.5",
		],
	},
	variants: {
		/** `chip`: a compact pill for a composer; `card`: a full-width row with a bar; `tile`: an
		 * image square whose remove button shows on hover or focus. */
		variant: {
			chip: {
				root: "grid-cols-[1fr] starting:grid-cols-[0fr] data-[leaving=true]:-me-2 data-[leaving=true]:grid-cols-[0fr]",
				surface: "h-11 max-w-60 gap-2 rounded-xl py-1 pr-1 pl-1",
				preview: "size-9 rounded-lg",
				action: "size-7",
			},
			card: {
				root: "w-full grid-rows-[1fr] starting:grid-rows-[0fr] data-[leaving=true]:grid-rows-[0fr]",
				surface: "w-full gap-3 rounded-xl p-2.5",
				preview: "size-9 rounded-lg",
				meta: "mt-0.5",
				action: "size-7",
			},
			tile: {
				root: "grid-cols-[1fr] starting:grid-cols-[0fr] data-[leaving=true]:-me-2 data-[leaving=true]:grid-cols-[0fr]",
				surface: "size-20 overflow-hidden rounded-xl",
				preview: "absolute inset-0 size-full rounded-[inherit] border-0",
				text: "sr-only",
				action:
					"absolute top-1 right-1 size-6 rounded-full bg-background/85 opacity-0 backdrop-blur-sm group-hover/attachment:opacity-100 group-focus-within/attachment:opacity-100 pointer-coarse:opacity-100",
			},
		},
		status: {
			uploading: {
				preview: "text-primary",
				progress: "grid-rows-[1fr] opacity-100 duration-(--duration-dropdown)",
			},
			ready: { progress: "grid-rows-[0fr] opacity-0 duration-(--duration-exit)" },
			error: {
				surface: "border-[color-mix(in_oklch,var(--destructive)_35%,transparent)]",
				preview: "text-destructive-strong",
				meta: "text-destructive-strong",
				progress: "grid-rows-[0fr] opacity-0 duration-(--duration-exit)",
			},
		},
	},
	defaultVariants: { variant: "chip", status: "ready" },
});

export type AttachmentsVariant = NonNullable<VariantProps<typeof attachments>["variant"]>;
export type AttachmentVariant = NonNullable<VariantProps<typeof attachment>["variant"]>;
export type AttachmentStatus = NonNullable<VariantProps<typeof attachment>["status"]>;

/** File outline, and a warning for failed uploads; stroke paths on a 16px grid. */
export const ATTACHMENT_ICON: Record<"file" | "error", string> = {
	file: "M9 1.5H4A1.5 1.5 0 0 0 2.5 3v10A1.5 1.5 0 0 0 4 14.5h8a1.5 1.5 0 0 0 1.5-1.5V6L9 1.5zM9 1.5V6h4.5",
	error: "M8 5v3.5M8 11h.01M14.5 8a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z",
};

/** The upper-cased extension, e.g. "PDF", shown when there is no image preview. */
export const fileType = (name: string) => {
	const dot = name.lastIndexOf(".");
	return dot > 0 && dot < name.length - 1
		? name.slice(dot + 1, dot + 5).toUpperCase()
		: "";
};
