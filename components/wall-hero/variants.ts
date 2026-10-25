import { tv, type VariantProps } from "tailwind-variants";

/** `split` sets the copy beside a tilted wall of cards; `backdrop` runs the wall behind centred
 * copy. Each wall column drifts on the `wall-drift` loop and fades out at the edges. */
export const wallHero = tv({
	slots: {
		root: "@container relative isolate w-full overflow-hidden text-foreground",
		content: "relative flex flex-col gap-6 px-6",
		brand:
			"flex items-center gap-2.5 font-semibold text-xl [&_svg]:size-7 [&_svg]:shrink-0",
		title:
			"m-0 text-balance font-heading font-medium text-[clamp(2.5rem,1.4rem+4cqi,4.5rem)] leading-[1.04] tracking-tight",
		description: "m-0 max-w-136 text-pretty text-lg text-muted-foreground",
		command:
			"inline-flex h-12 max-w-full items-center gap-3 rounded-full bg-card ps-5 pe-1.5 font-mono text-sm",
		prompt: "shrink-0 select-none text-muted-foreground",
		commandText: "min-w-0 truncate",
		copy: "size-9 shrink-0 rounded-full border-0 bg-transparent hover:bg-foreground/[0.06]",
		actions: "flex flex-wrap items-center gap-3",
		wall: "pointer-events-none relative select-none overflow-hidden [perspective:1800px]",
		plane:
			"absolute top-1/2 left-1/2 grid w-[150%] -translate-1/2 grid-cols-3 items-start gap-5 [transform:rotateX(30deg)_rotateZ(-14deg)]",
		column: "min-w-0",
		track: "wall-drift flex flex-col",
		group: "flex flex-col gap-5 pb-5",
		card: "overflow-hidden rounded-2xl bg-card p-1.5",
		cardBody: "rounded-xl bg-background p-4 shadow-surface dark:bg-popover",
	},
	variants: {
		variant: {
			split: {
				root: "grid @4xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] @4xl:items-center",
				content: "items-start py-14 @4xl:py-28 @4xl:ps-14 @4xl:pe-4",
				wall: [
					"h-104 @4xl:h-auto @4xl:min-h-160 @4xl:self-stretch",
					"[mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent),linear-gradient(to_right,transparent,black_22%,black_90%,transparent)] [mask-composite:intersect]",
				],
			},
			backdrop: {
				root: "grid min-h-160 place-items-center",
				content: [
					"z-10 max-w-3xl items-center py-24 text-center [&>p]:mx-auto",
					"before:-inset-x-24 before:-inset-y-16 before:-z-10 before:absolute before:rounded-full before:bg-background/85 before:blur-3xl",
				],
				wall: "absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]",
			},
		},
	},
	defaultVariants: { variant: "split" },
});

export type WallHeroVariant = NonNullable<VariantProps<typeof wallHero>["variant"]>;
export type WallHeroDirection = "up" | "down";
