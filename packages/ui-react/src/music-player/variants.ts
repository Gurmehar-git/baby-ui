import { tv, type VariantProps } from "tailwind-variants";

export const musicPlayer = tv({
	slots: {
		root: "@container w-full rounded-2xl border border-border bg-background p-5 text-foreground",
		frame: "grid items-center gap-5",
		deck: "relative mx-auto aspect-square shrink-0",
		disc: "absolute inset-0 overflow-hidden rounded-full border-foreground/10 bg-foreground shadow-lg [animation:spin_4s_linear_infinite] data-[playing=false]:[animation-play-state:paused] motion-reduce:[animation:none]",
		cover: "absolute inset-0 size-full object-cover",
		grooves:
			"absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle,transparent_0_5px,color-mix(in_oklch,var(--background)_22%,transparent)_5px_6px)]",
		label:
			"absolute top-1/2 left-1/2 flex size-1/3 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background",
		pin: "size-[12%] rounded-full bg-foreground/60",
		sheen:
			"pointer-events-none absolute inset-0 rounded-full bg-[conic-gradient(from_45deg,transparent,color-mix(in_oklch,var(--background)_28%,transparent)_12%,transparent_25%,transparent_50%,color-mix(in_oklch,var(--background)_20%,transparent)_62%,transparent_75%)]",
		arm: "pointer-events-none absolute z-10 origin-top-right rotate-[10deg] transition-[rotate] duration-500 ease-[var(--ease-ui-in-out)] data-[playing=true]:rotate-[-18deg] motion-reduce:transition-none",
		armBase:
			"absolute top-0 right-0 size-7 translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-card bg-muted-foreground shadow-sm",
		armStick:
			"absolute top-0 right-2 flex h-2 w-[92%] origin-right -rotate-12 items-center rounded-full bg-muted-foreground shadow-sm",
		needle: "size-4 -translate-x-1/2 rounded-full bg-foreground shadow-sm",
		body: "flex min-w-0 flex-col gap-3",
		meta: "flex min-w-0 flex-col gap-0.5",
		title: "truncate font-semibold text-base text-foreground",
		artist: "truncate text-muted-foreground text-sm",
		scrub: "flex flex-col",
		times:
			"-mt-2 flex justify-between font-mono text-xs text-muted-foreground tabular-nums",
		controls: "flex items-center justify-between gap-3",
		transport: "flex items-center gap-1",
		volume: "flex w-32 items-center gap-1",
	},
	variants: {
		layout: {
			vinyl: {
				frame: "@xl:grid-cols-[auto_1fr]",
				deck: "size-52 @xl:size-56",
				disc: "border-4",
				arm: "-top-[4%] -right-[8%] h-[14%] w-[58%]",
				meta: "text-center @xl:text-left",
			},
			compact: {
				frame: "grid-cols-[auto_1fr]",
				deck: "size-16",
				disc: "border-2",
				arm: "hidden",
				label: "size-2/5",
			},
		},
	},
	defaultVariants: { layout: "vinyl" },
});

export type MusicPlayerLayout = NonNullable<VariantProps<typeof musicPlayer>["layout"]>;
