import { tv, type VariantProps } from "tailwind-variants";

// Closed state is `data-closed` in Base UI and `data-state=closed` in bits-ui; both are listed
// so this file stays byte-identical across ports.
export const fullscreenNav = tv({
	slots: {
		popup: [
			"fixed inset-0 z-50 flex flex-col bg-background outline-none",
			"transition-[opacity,visibility,translate,clip-path] duration-[var(--duration-overlay)] ease-[var(--ease-ui-out)]",
			"starting:opacity-0 data-[closed]:invisible data-[closed]:opacity-0 data-[closed]:duration-[var(--duration-exit)]",
			"data-[state=closed]:invisible data-[state=closed]:opacity-0 data-[state=closed]:duration-[var(--duration-exit)]",
			"motion-reduce:transition-[opacity,visibility] motion-reduce:!delay-0",
		],
		header: "flex h-14 shrink-0 items-center justify-between px-4 md:px-6",
		title: "font-semibold text-foreground text-sm",
		nav: "group/nav flex flex-1 flex-col justify-center gap-1 overflow-y-auto px-6 py-8 md:px-10",
		// The anchor carries the entrance (with its stagger delay); the inner row carries hover,
		// so dimming siblings is not held back by that delay.
		link: [
			"group/link outline-none transition-[opacity,translate] duration-[var(--duration-drawer)] ease-[var(--ease-ui-out)]",
			"starting:translate-y-[0.3em] starting:opacity-0",
			"data-[state=closed]:translate-y-[0.3em] data-[state=closed]:opacity-0 data-[state=closed]:duration-[var(--duration-exit)]",
			"motion-reduce:transition-opacity motion-reduce:!delay-0 motion-reduce:starting:translate-y-0 motion-reduce:data-[state=closed]:translate-y-0",
		],
		row: [
			"flex items-baseline gap-4 rounded-lg transition-opacity duration-(--duration-fast)",
			"group-has-[a:hover]/nav:opacity-45 hover:!opacity-100 group-has-[:focus-visible]/nav:opacity-45 group-focus-visible/link:!opacity-100",
			"group-focus-visible/link:ring-2 group-focus-visible/link:ring-ring group-focus-visible/link:ring-offset-4 group-focus-visible/link:ring-offset-background",
		],
		index: "w-8 shrink-0 font-mono text-muted-foreground text-xs tabular-nums",
		text: "flex min-w-0 flex-col",
		label:
			"font-heading font-semibold text-foreground tracking-tight decoration-2 underline-offset-8 group-aria-[current=page]/link:underline",
		description: "mt-1 text-muted-foreground text-sm",
		footer:
			"shrink-0 border-border border-t px-6 py-5 text-muted-foreground text-sm md:px-10",
	},
	variants: {
		/** Fade dissolves in place; slide drops from the top; clip grows from the top-right corner. */
		variant: {
			fade: {},
			slide: {
				popup: [
					"duration-[var(--duration-drawer)] ease-[var(--ease-drawer)]",
					"starting:-translate-y-full data-[closed]:-translate-y-full data-[state=closed]:-translate-y-full",
					"motion-reduce:starting:translate-y-0 motion-reduce:data-[closed]:translate-y-0 motion-reduce:data-[state=closed]:translate-y-0",
				],
			},
			clip: {
				popup: [
					"duration-[var(--duration-drawer)] ease-[var(--ease-drawer)] [clip-path:circle(150%_at_calc(100%-2.5rem)_1.75rem)]",
					"starting:[clip-path:circle(0%_at_calc(100%-2.5rem)_1.75rem)] data-[closed]:[clip-path:circle(0%_at_calc(100%-2.5rem)_1.75rem)] data-[state=closed]:[clip-path:circle(0%_at_calc(100%-2.5rem)_1.75rem)]",
					"motion-reduce:[clip-path:none]",
				],
			},
		},
		align: {
			start: { nav: "items-start" },
			center: { nav: "items-center text-center", row: "justify-center" },
		},
		size: {
			md: { label: "text-3xl sm:text-4xl" },
			lg: { label: "text-4xl sm:text-6xl" },
		},
	},
	defaultVariants: { variant: "fade", align: "start", size: "md" },
});

export type FullscreenNavVariant = NonNullable<
	VariantProps<typeof fullscreenNav>["variant"]
>;
export type FullscreenNavAlign = NonNullable<VariantProps<typeof fullscreenNav>["align"]>;
export type FullscreenNavSize = NonNullable<VariantProps<typeof fullscreenNav>["size"]>;

/** "01", "02"… for numbered links. */
export function linkIndex(i: number): string {
	return String(i + 1).padStart(2, "0");
}

const ENTER_LEAD = 60;
const ENTER_STEP = 45;
const EXIT_STEP = 35;

/** Links stagger in top-down on open and out bottom-up on close, so the exit mirrors the entrance. */
export function linkDelay(index: number, count: number, open: boolean): string {
	return `${open ? ENTER_LEAD + index * ENTER_STEP : (count - 1 - index) * EXIT_STEP}ms`;
}

/** The panel holds until the last link has mostly left, then fades out itself. */
export function panelDelay(count: number, open: boolean): string {
	return open ? "0ms" : `${Math.max(0, count - 1) * EXIT_STEP + 80}ms`;
}
