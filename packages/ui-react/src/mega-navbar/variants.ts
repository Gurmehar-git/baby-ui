import { tv, type VariantProps } from "tailwind-variants";

export const megaNavbar = tv({
	slots: {
		root: "@container w-full transition-colors duration-[var(--duration-dropdown)] motion-reduce:transition-none",
		nav: "mx-auto flex h-16 w-full max-w-6xl items-center gap-2 px-6",
		trigger:
			"inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-2 font-medium text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
		chevron:
			"size-3.5 transition-transform duration-[var(--duration-dropdown)] motion-reduce:transition-none",
		menu: "relative flex items-center gap-1",
		center: "hidden flex-1 items-center justify-center @3xl:flex",
		capsule: "relative flex items-center",
		// Slides to the hovered link and rests on the current one; capsule variant only.
		capsulePill:
			"pointer-events-none absolute top-0 left-0 rounded-full bg-background opacity-0 shadow-xs ring-1 ring-border transition-[translate,width,height,opacity] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) data-[on=true]:opacity-100 motion-reduce:transition-none",
		// Recast's morph: one panel resizes and slides between groups on a long, soft settle.
		panel: [
			// box-content: the measured size is the content box, so the border must sit outside it.
			"absolute top-full left-0 z-50 box-content origin-top overflow-hidden rounded-xl border border-border bg-card shadow-2xl",
			"transition-[width,height,transform,opacity] duration-300 ease-[cubic-bezier(0.625,0.05,0,1)] motion-reduce:transition-none",
		],
		pane: "absolute inset-x-0 top-0 w-max transition-opacity duration-[var(--duration-dropdown)] motion-reduce:transition-none",
		item: "flex gap-3 rounded-lg p-3 transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none aria-[current=page]:bg-foreground/[0.06] motion-reduce:transition-none",
		footer:
			"group/cta flex items-center justify-between gap-4 border-border border-t px-5 py-3 transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none motion-reduce:transition-none",
		link: "inline-flex items-center whitespace-nowrap rounded-full px-3.5 py-2 font-medium text-sm transition-colors hover:text-foreground motion-reduce:transition-none",
		mobileChevron:
			"size-4 shrink-0 text-muted-foreground transition-transform duration-[var(--duration-dropdown)] motion-reduce:transition-none",
		mobileItem:
			"flex min-h-12 items-center gap-3 rounded-lg px-2 py-2 transition-colors motion-reduce:transition-none",
		mobileLink:
			"flex min-h-12 items-center rounded-lg px-2 font-medium text-foreground transition-colors motion-reduce:transition-none",
		list: "grid w-[34rem] grid-cols-2 gap-1 p-2",
		// Secondary links: one line each, several columns, so a long group stays short.
		more: "border-border border-t p-2",
		moreHeading: "px-3 pt-1 pb-1.5 font-medium text-muted-foreground text-xs",
		moreList: "grid grid-cols-3 gap-0.5",
		moreLink:
			"flex items-center rounded-md px-3 py-1.5 text-foreground text-sm transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none motion-reduce:transition-none",
		sheet: "w-full gap-0 p-0 sm:max-w-sm",
		menuButton:
			"grid size-9 cursor-pointer place-items-center rounded-lg text-foreground transition-colors hover:bg-accent @3xl:hidden motion-reduce:transition-none",
		shelf: "pointer-events-auto hidden @3xl:block",
		shelfBar: "flex h-16 items-center gap-4 px-5 @5xl:gap-6 @5xl:px-6",
		mobileBar:
			"pointer-events-auto flex h-16 items-center justify-between gap-2 bg-card px-4 transition-[background-color,backdrop-filter] duration-[var(--duration-dropdown)] @3xl:hidden motion-reduce:transition-none",
		rule: "pointer-events-none block h-px w-full bg-border transition-opacity duration-[var(--duration-dropdown)] @3xl:hidden motion-reduce:transition-none",
		// Expand: the bar itself grows down into the open section's panel.
		expandBar: [
			// Concentric: a 16px bar round 8px padding round the ladder's 8px-radius h-9 controls.
			"absolute inset-x-0 top-0 mx-auto grid w-full max-w-6xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 overflow-hidden rounded-2xl border border-border bg-background/85 p-2 backdrop-blur-xl backdrop-saturate-150 @3xl:gap-x-6",
			// A bright top edge reads as light catching the material; the cast shadow lands once raised.
			"shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] transition-shadow duration-300 ease-(--ease-ui-out) data-[raised=true]:shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_28px_56px_-28px_rgb(0_0_0/0.4)] motion-reduce:transition-none",
		],
		// Holds the resting bar's height (1px border, 8px padding, 36px controls) so the panel
		// grows over the page instead of pushing it down.
		expandFrame: "relative h-[3.375rem]",
		expandScrim:
			"pointer-events-none fixed inset-0 -z-10 bg-background/45 opacity-0 backdrop-blur-[6px] backdrop-saturate-50 transition-opacity duration-200 ease-out data-[open=true]:pointer-events-auto data-[open=true]:opacity-100 motion-reduce:backdrop-blur-none",
		expandTriggers: "relative hidden min-w-0 items-center gap-1 @3xl:flex",
		expandPill:
			"pointer-events-none absolute top-0 left-0 rounded-lg bg-foreground/[0.06] opacity-0 transition-[translate,width,height,opacity] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) data-[on=true]:opacity-100 motion-reduce:transition-none",
		expandTrigger:
			"relative z-1 inline-flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg px-3 font-medium text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
		expandChevron:
			"size-3 opacity-60 transition-transform duration-300 ease-(--ease-ui-out) data-[open=true]:rotate-180 motion-reduce:transition-none",
		expandBrand:
			"relative z-1 flex h-9 shrink-0 items-center gap-2.5 justify-self-start px-1",
		expandActions: "relative z-1 col-start-3 flex items-center gap-2 justify-self-end",
		// Height eases to the open pane: slower growing than shrinking, so closing feels quick.
		expandPanel:
			"relative col-span-full grid overflow-hidden transition-[height] duration-[420ms] ease-(--ease-ui-out) data-[open=false]:duration-[280ms] motion-reduce:transition-none",
		expandDivider:
			"pointer-events-none absolute inset-x-0 top-2 h-px scale-x-[0.96] bg-border opacity-0 transition-[opacity,scale] duration-200 ease-out data-[open=true]:scale-x-100 data-[open=true]:opacity-100 motion-reduce:scale-x-100",
		expandPanes: "hidden grid-cols-1 @3xl:grid",
		// Every pane shares one cell; `data-side` slides it in from the way the pointer travelled.
		expandPane: [
			"group/pane col-start-1 row-start-1 grid grid-cols-[minmax(11rem,14rem)_minmax(0,1fr)] gap-x-10 self-start pt-6 pb-1 transition-[opacity,translate,filter] @5xl:gap-x-14",
			"data-[side=on]:duration-[320ms] data-[side=on]:ease-(--ease-ui-out)",
			"data-[side=end]:pointer-events-none data-[side=end]:translate-x-7 data-[side=end]:opacity-0 data-[side=end]:duration-150",
			"data-[side=start]:pointer-events-none data-[side=start]:-translate-x-7 data-[side=start]:opacity-0 data-[side=start]:duration-150",
			"data-[side=off]:pointer-events-none data-[side=off]:translate-y-1 data-[side=off]:opacity-0 data-[side=off]:blur-[2px] data-[side=off]:duration-150",
			"motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:blur-none",
		],
		expandIntro: "flex flex-col gap-3 px-1 pt-3",
		expandEyebrow: "font-medium text-muted-foreground text-xs",
		expandBlurb: "text-pretty text-[0.9375rem] text-foreground leading-relaxed",
		expandCta:
			"group/cta mt-1 inline-flex w-fit items-center gap-1.5 rounded-md font-medium text-foreground text-sm outline-none underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring",
		expandGrid: "relative grid content-start gap-1 @3xl:grid-cols-2 @6xl:grid-cols-3",
		expandHighlight:
			"pointer-events-none absolute top-0 left-0 rounded-xl bg-foreground/[0.045] opacity-0 ring-1 ring-border/60 transition-[translate,width,height,opacity] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) data-[on=true]:opacity-100 motion-reduce:transition-none",
		// Items rise in a 35ms stagger as their pane arrives; `--i` is each one's place.
		expandItem: [
			"group/item relative z-1 grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-start gap-3 rounded-xl p-3 outline-none focus-visible:ring-2 focus-visible:ring-ring data-[icon=false]:grid-cols-[minmax(0,1fr)_auto]",
			"translate-y-2 opacity-0 blur-[3px] transition-[opacity,translate,filter] duration-[360ms] ease-(--ease-ui-out) [transition-delay:calc(var(--i,0)*35ms)]",
			"group-data-[side=on]/pane:translate-y-0 group-data-[side=on]/pane:opacity-100 group-data-[side=on]/pane:blur-none",
			"motion-reduce:translate-y-0 motion-reduce:blur-none motion-reduce:[transition-delay:0ms]",
		],
		expandIcon:
			"grid size-9 place-items-center rounded-lg border border-border bg-muted/60 text-foreground shadow-xs transition-transform duration-(--duration-fast) ease-out group-hover/item:scale-105 group-active/item:scale-95 motion-reduce:transition-none [&_svg]:size-[1.125rem]",
		expandLabel:
			"flex items-center gap-1 font-medium text-foreground text-sm leading-tight",
		expandDetail: "mt-1 text-pretty text-[0.8125rem] text-muted-foreground leading-snug",
		expandArrow:
			"mt-0.5 size-3.5 text-muted-foreground transition-transform duration-(--duration-fast) ease-out group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5 motion-reduce:transition-none",
		expandMore:
			"col-start-2 mt-2 flex flex-wrap items-center gap-1 border-border border-t pt-3",
		expandMoreLink:
			"rounded-lg px-2.5 py-1 text-muted-foreground text-sm outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
		expandMobile:
			"group/pane col-span-full row-start-1 flex max-h-[calc(100dvh-7rem)] flex-col gap-2 self-start overflow-y-auto pt-5 transition-opacity duration-200 data-[side=off]:pointer-events-none data-[side=off]:opacity-0 @3xl:hidden",
		expandMobileGroup: "border-border/60 border-t pt-3 first:border-t-0 first:pt-0",
	},
	variants: {
		/** Solid spans the page; floating is an inset bar; notched hangs a shelf; capsule gathers links
		 * in a pill track; expand grows the bar itself into each section's panel. */
		variant: {
			solid: { root: "border-b" },
			floating: {
				root: "px-3 pt-3",
				nav: "h-14 rounded-2xl border px-4 transition-[background,border-color,box-shadow,backdrop-filter] duration-[var(--duration-dropdown)] motion-reduce:transition-none",
			},
			capsule: {
				root: "border-b",
				capsule: "rounded-full border border-border bg-muted/40 p-1",
				trigger: "relative z-1",
				link: "relative z-1",
			},
			// Floats inset; positioned so its scrim layers under the bar even when not sticky.
			expand: { root: "relative z-50 px-2 pt-2 @3xl:px-3 @3xl:pt-3" },
			// The root spans the page but only the shelf and bar catch the pointer.
			notched: {
				root: "pointer-events-none",
				list: "w-[32rem]",
				sheet: "h-dvh max-h-dvh sm:max-w-none",
			},
		},
		/** Resting, scrolled over content with blur, scrolled without blur. */
		surface: { clear: {}, blurred: {}, opaque: {} },
		sticky: {
			true: { root: "sticky inset-x-0 top-0 z-50" },
			false: { root: "relative" },
		},
		current: {
			true: {
				trigger: "text-foreground",
				expandTrigger: "text-foreground",
				link: "text-foreground",
				mobileItem: "bg-foreground/[0.06]",
				mobileLink: "bg-foreground/[0.06]",
			},
			false: {
				trigger: "text-muted-foreground hover:text-foreground",
				expandTrigger: "text-muted-foreground hover:text-foreground",
				link: "text-muted-foreground",
				mobileItem: "hover:bg-accent",
				mobileLink: "hover:bg-accent",
			},
		},
		open: {
			true: {
				chevron: "rotate-180",
				mobileChevron: "rotate-180",
				panel: "pointer-events-auto opacity-100",
				pane: "opacity-100",
			},
			false: {
				panel: "pointer-events-none opacity-0",
				pane: "pointer-events-none opacity-0",
			},
		},
	},
	compoundVariants: [
		{ variant: "capsule", surface: "clear", class: { root: "border-transparent" } },
		{
			variant: "capsule",
			surface: "blurred",
			class: { root: "border-border bg-background/85 backdrop-blur" },
		},
		{
			variant: "capsule",
			surface: "opaque",
			class: { root: "border-border bg-background/85" },
		},
		{ variant: "solid", surface: "clear", class: { root: "border-transparent" } },
		{
			variant: "solid",
			surface: "blurred",
			class: { root: "border-border bg-background/85 backdrop-blur" },
		},
		{
			variant: "solid",
			surface: "opaque",
			class: { root: "border-border bg-background/85" },
		},
		{
			variant: "floating",
			surface: "clear",
			class: { nav: "border-border bg-background/60" },
		},
		{
			variant: "floating",
			surface: "blurred",
			class: { nav: "border-border bg-background/85 shadow-lg backdrop-blur" },
		},
		{
			variant: "floating",
			surface: "opaque",
			class: { nav: "border-border bg-background/85 shadow-lg" },
		},
		{ variant: "notched", surface: "clear", class: { rule: "opacity-0" } },
		{
			variant: "notched",
			surface: "blurred",
			class: { mobileBar: "bg-card/85 backdrop-blur", rule: "opacity-100" },
		},
		{ variant: "notched", surface: "opaque", class: { rule: "opacity-100" } },
	],
	defaultVariants: {
		variant: "solid",
		surface: "clear",
		sticky: true,
		current: false,
		open: false,
	},
});

export type MegaNavbarVariant = NonNullable<VariantProps<typeof megaNavbar>["variant"]>;
