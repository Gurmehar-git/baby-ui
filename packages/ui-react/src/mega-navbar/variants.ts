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
	},
	variants: {
		/** Solid spans the page; floating is an inset rounded bar; notched hangs a shelf from the top;
		 * capsule gathers the centre links in a quiet pill track. */
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
				link: "text-foreground",
				mobileItem: "bg-foreground/[0.06]",
				mobileLink: "bg-foreground/[0.06]",
			},
			false: {
				trigger: "text-muted-foreground hover:text-foreground",
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
