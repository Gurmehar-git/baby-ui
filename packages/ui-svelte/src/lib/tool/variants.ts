import { tv, type VariantProps } from "tailwind-variants";

export const tool = tv({
	slots: {
		root: "overflow-hidden rounded-xl border border-border bg-card/40",
		trigger:
			"flex w-full items-center gap-2 px-3 py-2 text-left text-sm outline-none transition-colors hover:bg-foreground/[0.03] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
		icon: "grid size-4 shrink-0 place-items-center",
		name: "flex-1 font-mono text-foreground text-xs",
		label: "shrink-0 text-xs",
		chevron:
			"size-3.5 shrink-0 text-muted-foreground transition-[transform,scale,translate,rotate] duration-[var(--duration-exit)] ease-[var(--ease-ui-out)] motion-reduce:transition-none",
		panel:
			"grid grid-rows-[0fr] transition-[grid-template-rows] duration-[var(--duration-exit)] ease-[var(--ease-ui-out)] motion-reduce:transition-none",
		body: "flex flex-col gap-2 border-border/60 border-t p-3",
		heading: "mb-1 font-medium text-xs text-muted-foreground uppercase tracking-wider",
		code: "overflow-x-auto rounded-lg bg-background p-2 font-mono text-xs",
	},
	variants: {
		status: {
			pending: { icon: "text-muted-foreground", label: "text-muted-foreground" },
			running: { icon: "text-primary", label: "text-primary" },
			done: { icon: "text-success-strong", label: "text-success-strong" },
			error: { icon: "text-destructive-strong", label: "text-destructive-strong" },
		},
		open: {
			true: {
				chevron: "rotate-180 duration-[var(--duration-dropdown)]",
				panel: "grid-rows-[1fr] duration-[var(--duration-dropdown)]",
			},
			false: {},
		},
	},
	defaultVariants: { status: "running", open: false },
});

export type ToolState = NonNullable<VariantProps<typeof tool>["status"]>;

/** Every visible string, overridable for other languages. */
export type ToolLabels = Record<ToolState | "input" | "output", string>;

export const TOOL_LABELS: ToolLabels = {
	pending: "Queued",
	running: "Running",
	done: "Completed",
	error: "Failed",
	input: "Input",
	output: "Output",
};
