import { tv, type VariantProps } from "tailwind-variants";

/** `framed` wraps the panel in the same inset rim as Card's framed variant; `outline` is flat. */
export const chatComposer = tv({
	slots: {
		frame: "w-full max-w-sm self-start",
		root: "flex w-full flex-col gap-0 overflow-hidden py-0",
		header:
			"flex shrink-0 items-center justify-between gap-2 border-border border-b p-1.5",
		actions: "flex items-center gap-0.5",
		thread: "flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 pt-3 pb-1",
		user: "card-fade-up ml-12 self-end rounded-xl border border-border bg-background px-3 py-1.5 text-foreground leading-snug",
		assistant:
			"card-fade-up flex flex-col gap-1 transition-[opacity,filter] duration-(--duration-slow) ease-[var(--ease-ui-out)] motion-reduce:transition-none",
		byline: "flex items-center gap-1 text-xs leading-tight",
		author: "font-medium text-foreground",
		meta: "text-muted-foreground",
		body: "text-foreground leading-normal",
		composer: "mt-auto flex shrink-0 items-end gap-2 border-border border-t p-2",
	},
	variants: {
		variant: {
			framed: {
				frame: "rounded-2xl border border-border bg-background p-1",
				root: "rounded-[11px] border-0",
			},
			outline: { root: "rounded-2xl" },
		},
		size: {
			sm: { root: "h-72", user: "text-sm", body: "text-sm" },
			default: { root: "h-96", user: "text-sm", body: "text-sm" },
		},
		resolving: {
			true: { assistant: "opacity-55 blur-[0.5px]" },
			false: {},
		},
	},
	defaultVariants: { variant: "framed", size: "sm", resolving: false },
});

export type ChatComposerVariant = NonNullable<
	VariantProps<typeof chatComposer>["variant"]
>;
export type ChatComposerSize = NonNullable<VariantProps<typeof chatComposer>["size"]>;
