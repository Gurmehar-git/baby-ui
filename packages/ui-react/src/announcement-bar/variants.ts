import { tv, type VariantProps } from "tailwind-variants";

// Faces share one grid cell, so the bar holds the tallest message and never jumps on rotation;
// --ab-dir flips which way the leaving and waiting faces sit.
export const announcementBar = tv({
	slots: {
		collapse: [
			"@container grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-(--duration-collapse) ease-(--ease-out-quad)",
			"data-[open=false]:grid-rows-[0fr] data-[open=false]:opacity-0 motion-reduce:transition-none",
		],
		clip: "min-h-0 overflow-hidden",
		bar: "grid grid-cols-[var(--ab-side)_minmax(0,1fr)_auto] items-center gap-x-3 border-b py-1 pr-2 pl-2 @max-[35rem]:grid-cols-[0_minmax(0,1fr)_auto] @max-[35rem]:gap-x-2 @max-[35rem]:pl-3.5",
		viewport: "grid min-h-8 overflow-hidden [&>*]:col-start-1 [&>*]:row-start-1",
		face: [
			"flex min-h-8 items-center justify-center @max-[35rem]:justify-start",
			"transition-[translate,opacity,filter] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) motion-reduce:transition-none",
			"data-[face=gone]:pointer-events-none data-[face=gone]:translate-y-[calc(var(--ab-dir)*-60%)] data-[face=gone]:opacity-0 data-[face=gone]:blur-[3px] data-[face=gone]:duration-(--duration-fast)",
			"data-[face=wait]:pointer-events-none data-[face=wait]:translate-y-[calc(var(--ab-dir)*70%)] data-[face=wait]:opacity-0 data-[face=wait]:transition-none",
		],
		message:
			"m-0 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-0.5 py-1.5 text-center text-sm text-balance @max-[35rem]:justify-start @max-[35rem]:gap-x-2.5 @max-[35rem]:text-left",
		countdownLabel: "text-(--ab-muted)",
		cta: "group/cta inline-flex items-center gap-1 whitespace-nowrap font-medium underline-offset-4 outline-none hover:underline focus-visible:underline [&_svg]:size-3.5 [&_svg]:transition-transform [&_svg]:duration-(--duration-fast) hover:[&_svg]:translate-x-0.5",
		controls: "flex items-center gap-0.5",
		icon: "rounded-full text-(--ab-muted) hover:bg-current/10 hover:text-current",
		ring: "size-5 -rotate-90 overflow-visible",
		ringTrack: "fill-none stroke-current stroke-[1.75] opacity-22",
		ringFill:
			"fill-none stroke-current stroke-[1.75] [stroke-dasharray:1] [stroke-linecap:round]",
	},
	variants: {
		variant: {
			default: {
				bar: "bg-background text-foreground [--ab-muted:var(--color-muted-foreground)]",
			},
			inverted: {
				bar: "border-transparent bg-foreground text-background [--ab-muted:color-mix(in_oklab,var(--color-background)_66%,transparent)]",
			},
		},
	},
	defaultVariants: { variant: "default" },
});

export type AnnouncementBarVariant = NonNullable<
	VariantProps<typeof announcementBar>["variant"]
>;
