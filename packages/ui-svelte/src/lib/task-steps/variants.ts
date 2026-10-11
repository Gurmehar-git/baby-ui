import { tv, type VariantProps } from "tailwind-variants";

export const taskSteps = tv({
	slots: {
		root: "flex flex-col",
		item: "relative flex",
		connector: "absolute bottom-0 w-px",
		marker:
			"relative z-10 grid shrink-0 place-items-center rounded-full border bg-background",
		icon: "",
		dot: "rounded-full bg-current",
		text: "min-w-0 flex-1",
		label: "",
	},
	variants: {
		/** Timeline ticks down a connector; capsules and list are expandable rows with details. */
		variant: {
			timeline: {},
			capsules: {},
			list: {},
		},
		size: {
			sm: {
				item: "gap-2",
				connector: "top-5 left-[0.5625rem]",
				marker: "size-4.5",
				icon: "size-2.5",
				dot: "size-1",
				text: "text-xs leading-[1.125rem]",
			},
			md: {
				item: "gap-3",
				connector: "top-6 left-[0.6875rem]",
				marker: "size-5.5",
				icon: "size-3",
				dot: "size-1.5",
				text: "text-sm",
			},
		},
		compact: {
			true: { item: "py-1" },
			false: { item: "py-1.5" },
		},
		status: {
			pending: {
				connector: "bg-border",
				marker: "border-border text-muted-foreground",
				label: "text-muted-foreground",
			},
			active: {
				connector: "bg-border",
				marker: "border-primary text-primary",
				label: "text-foreground",
			},
			done: {
				connector: "bg-[var(--success)]",
				marker: "border-[var(--success)] text-success-strong",
				label: "text-foreground line-through decoration-muted-foreground/40",
			},
			failed: {
				connector: "bg-border",
				marker: "border-[var(--destructive)] text-destructive-strong",
				label: "text-foreground",
			},
		},
	},
	defaultVariants: { variant: "timeline", size: "md", compact: false, status: "pending" },
});

export type TaskStepsVariant = NonNullable<VariantProps<typeof taskSteps>["variant"]>;
export type TaskStepsSize = NonNullable<VariantProps<typeof taskSteps>["size"]>;
export type TaskStatus = NonNullable<VariantProps<typeof taskSteps>["status"]>;

/** Screen-reader status words; override per language with `labels`. */
export const TASK_STEP_LABELS: Record<TaskStatus, string> = {
	pending: "Pending",
	active: "In progress",
	done: "Done",
	failed: "Failed",
};

export type TaskStepDetail = { label: string; meta: string };

export type TaskStep = {
	id: string;
	label: string;
	status: TaskStatus;
	/** Rows: a right-aligned figure, e.g. an amount. */
	meta?: string;
	/** Rows: the number shown in the pending or active ring. */
	step?: number;
	/** Rows: label/meta pairs revealed when the row expands. */
	details?: TaskStepDetail[];
};

export const taskStepRows = tv({
	slots: {
		root: "flex w-full max-w-[27.5rem] flex-col",
		item: "card-fade-up self-stretch overflow-hidden transition-[border-radius,background-color] duration-(--duration-slow) hover:bg-accent",
		trigger: "flex h-11 min-w-0 flex-1 items-center gap-2.5 px-2.5 text-left",
		badge: "flex size-6 shrink-0 items-center justify-center",
		label: "min-w-0 flex-1 truncate font-medium text-foreground text-sm",
		meta: "text-muted-foreground text-xs tabular-nums",
		chevron:
			"-ml-2 flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground",
		retry:
			"grid size-5.5 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
		details: "mb-2.5 grid grid-cols-[24px_1fr] gap-2.5 px-2.5",
		detail: "flex items-center justify-between text-muted-foreground text-xs",
		statusDot:
			"pop-in flex size-5.5 shrink-0 items-center justify-center rounded-full text-white",
	},
	variants: {
		variant: {
			capsules: {
				root: "gap-2",
				item: "rounded-[22px] border border-border bg-background",
			},
			list: {
				root: "gap-0 self-start overflow-hidden rounded-2xl border border-border bg-background",
				item: "border-border border-b last:border-0",
			},
		},
		tone: {
			destructive: { statusDot: "bg-destructive" },
			success: { statusDot: "bg-success text-success-foreground" },
		},
		open: {
			true: {},
			false: {},
		},
	},
	compoundVariants: [
		{ variant: "capsules", open: true, class: { item: "rounded-[14px]" } },
	],
	defaultVariants: { variant: "capsules", tone: "success", open: false },
});
