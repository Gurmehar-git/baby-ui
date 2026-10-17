import { tv, type VariantProps } from "tailwind-variants";
import type { CardVariant } from "../card/variants";

// Media-chrome draws its ranges and buttons in shadow DOM, so their look is set through its --media-* variables.
export const videoPlayer = tv({
	slots: {
		root: "group/video-player relative flex w-full flex-col overflow-hidden",
		viewport: [
			"relative block aspect-video w-full overflow-hidden",
			"[--media-control-background:transparent] [--media-control-hover-background:transparent]",
		],
		content: "block size-full object-contain",
		controlBar: [
			"relative z-10 flex min-w-0 items-center gap-1",
			"[--media-control-background:transparent] [--media-control-hover-background:transparent]",
			"[--media-focus-box-shadow:none] [--media-control-padding:0px]",
		],
		button: [
			// Set on the button itself: one portalled into a popover inherits nothing from the bar.
			"[--media-button-padding:0px] [&_svg]:size-4",
			"[--media-control-background:transparent] [--media-control-hover-background:transparent] [--media-focus-box-shadow:none]",
			"data-popup-open:bg-accent data-[state=open]:bg-accent",
		],
		iconStack: "grid place-items-center [&>svg]:col-start-1 [&>svg]:row-start-1",
		// Swapped glyphs stay mounted and cross-fade on data-shown, so a state change never pops.
		swapIcon: [
			"transition-[opacity,scale,filter] duration-(--duration-base) ease-(--ease-ui-out)",
			"data-[shown=false]:opacity-0 data-[shown=false]:duration-(--duration-exit)",
			"motion-safe:data-[shown=false]:scale-50 motion-safe:data-[shown=false]:blur-[2px]",
		],
		wave: [
			"origin-left [transform-box:fill-box] transition-[opacity,scale] duration-(--duration-base) ease-(--ease-ui-out)",
			"data-[shown=false]:opacity-0 motion-safe:data-[shown=false]:scale-50",
		],
		seekButton: "group/seek",
		seekIcon: [
			"grid place-items-center transition-[rotate] duration-(--duration-fast) ease-(--ease-ui-out) motion-reduce:transition-none",
			"group-active/seek:data-[direction=backward]:-rotate-45 group-active/seek:data-[direction=forward]:rotate-45",
		],
		loopButton: "group/loop",
		loopDot: [
			"pointer-events-none absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-current",
			"scale-0 opacity-0 transition-[opacity,scale] duration-(--duration-base) ease-(--ease-ui-out)",
			"group-aria-pressed/loop:scale-100 group-aria-pressed/loop:opacity-100",
		],
		loopIcon: [
			"transition-[rotate] duration-(--duration-slow) ease-(--ease-ui-out) motion-reduce:transition-none",
			"group-aria-pressed/loop:rotate-180",
		],
		range: [
			"h-8 min-w-0 bg-transparent [--media-range-padding:7px]",
			"[--media-range-track-height:4px] [--media-range-track-border-radius:9999px] hover:[--media-range-track-height:6px]",
			"[--media-range-track-transition:height_var(--duration-fast)_var(--ease-ui-out)]",
			"[--media-range-thumb-width:14px] [--media-range-thumb-height:14px] [--media-range-thumb-border-radius:9999px]",
			"[--media-range-thumb-transition:transform_var(--duration-fast)_var(--ease-ui-out)]",
			"hover:[--media-range-thumb-transform:scale(1.15)] active:[--media-range-thumb-transform:scale(0.9)]",
			"motion-reduce:[--media-range-thumb-transition:none] motion-reduce:[--media-range-track-transition:none]",
		],
		// The hover time mirrors the Slider value bubble: a rounded pill with a pointer, quick to appear.
		timeRange: [
			"flex-1 [--media-box-arrow-display:inline-block] [--media-box-arrow-height:6px] [--media-box-arrow-width:10px]",
			"[--media-preview-box-margin:0_0_2px] [--media-preview-transition-delay-in:0s]",
			"[--media-preview-transition-duration-in:var(--duration-fast)] [--media-preview-transition-duration-out:var(--duration-exit)]",
		],
		preview: [
			"rounded-xl px-2.5 py-1 shadow-md [--media-preview-time-padding:0] [--media-preview-time-margin:0] [--media-preview-time-text-shadow:none]",
			"[--media-font-family:var(--font-sans)] [--media-font-size:13px] [--media-font-weight:500]",
		],
		time: "inline-flex shrink-0 items-center gap-1 px-1.5 font-mono text-xs tabular-nums",
		timeValue: "inline-flex overflow-hidden",
		// A changed character remounts and rises in from @starting-style, so the time ticks instead of repainting.
		timeChar: [
			"inline-block transition-[opacity,translate] duration-(--duration-base) ease-(--ease-ui-out)",
			"starting:opacity-0 motion-safe:starting:translate-y-[0.6em]",
		],
		separator: "",
		menuTrigger: "min-w-10 px-2 font-mono tabular-nums",
		menuValue: [
			"inline-block transition-[opacity,translate] duration-(--duration-base) ease-(--ease-ui-out)",
			"starting:opacity-0 motion-safe:starting:translate-y-1",
		],
		menu: "w-44 p-1.5",
		menuLabel: "px-2 pt-1 pb-1.5 font-medium text-muted-foreground text-xs",
		menuHint: "ml-auto pl-2 font-normal text-muted-foreground text-xs",
		volumeMenu: "w-auto p-1",
		volumePanel: "flex items-center gap-1 pr-2",
		volumeRange: "w-28",
		volumeValue:
			"w-7 text-right font-mono text-[11px] text-muted-foreground tabular-nums",
		loading:
			"pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
		loadingIcon: [
			"grid size-12 place-items-center rounded-full backdrop-blur-sm",
			"[&_svg]:size-6 [&_svg]:animate-spin motion-reduce:[&_svg]:animate-none",
		],
		error: [
			"absolute inset-0 z-20 grid place-content-center justify-items-center gap-3 p-6 text-center backdrop-blur-sm",
			"transition-opacity duration-(--duration-base) ease-(--ease-ui-out) starting:opacity-0",
		],
		errorMessage: "max-w-[34ch] text-balance text-sm",
		// Stays mounted so closing fades out the way it came in; a large play button joins its flow.
		endScreen: [
			"group/end-screen absolute inset-0 z-[15] grid place-items-center overflow-y-auto bg-black/65 p-6 text-center text-white backdrop-blur-md",
			"transition-[opacity] duration-(--duration-slow) ease-(--ease-ui-out)",
			"data-[open=false]:pointer-events-none data-[open=false]:opacity-0 data-[open=false]:duration-(--duration-panel-exit)",
			"[&_[data-size=lg]]:static [&_[data-size=lg]]:translate-x-0 [&_[data-size=lg]]:translate-y-0",
		],
		endScreenBody: [
			"flex flex-col items-center gap-3 transition-[translate,scale] duration-(--duration-slow) ease-(--ease-ui-out)",
			"motion-safe:group-data-[open=false]/end-screen:translate-y-2 motion-safe:group-data-[open=false]/end-screen:scale-[0.98]",
		],
		errorAction: "",
	},
	variants: {
		variant: {
			// An inset well on the grey card step, controls underneath.
			default: {
				root: "p-1",
				viewport:
					"rounded-xl bg-background shadow-xs ring-1 ring-foreground/5 [--media-background-color:var(--background)]",
				controlBar: "h-12 px-2",
			},
			// Edge-to-edge video with a frosted pill floating over it.
			overlay: {
				viewport: "[--media-background-color:black]",
				controlBar:
					"absolute inset-x-3 bottom-3 h-11 rounded-full bg-black/45 px-1.5 ring-1 ring-white/10 backdrop-blur-md",
			},
			// Course-player layout: a full-width scrubber over a row of controls, on a bottom scrim.
			cinema: {
				viewport: "[--media-background-color:black]",
				controlBar: [
					"absolute inset-x-0 bottom-0 flex-wrap gap-x-1 px-3 pt-14 pb-2",
					"bg-linear-to-t from-black/80 via-black/35 to-transparent",
				],
				timeRange: "order-first -mb-1 h-6 basis-full",
				time: "mr-auto",
			},
			// No frame: a rounded video with a bare control row beneath it.
			minimal: {
				root: "gap-1",
				viewport:
					"rounded-2xl bg-muted ring-1 ring-border [--media-background-color:var(--muted)]",
				controlBar: "h-10 px-0",
			},
		},
	},
	compoundVariants: [
		{
			variant: ["default", "minimal"],
			class: {
				root: "text-foreground",
				button:
					"text-muted-foreground hover:text-foreground aria-pressed:bg-foreground/[0.06] aria-pressed:text-foreground",
				range: [
					"[--media-range-track-background:color-mix(in_oklab,var(--foreground)_11%,transparent)]",
					"[--media-range-track-pointer-background:color-mix(in_oklab,var(--foreground)_10%,transparent)]",
					"[--media-time-range-buffered-color:color-mix(in_oklab,var(--foreground)_22%,transparent)]",
					"[--media-range-bar-color:var(--foreground)] [--media-range-thumb-background:var(--foreground)]",
					"[--media-box-arrow-background:var(--foreground)]",
				],
				preview:
					"bg-foreground [--media-preview-time-background:var(--foreground)] [--media-text-color:var(--background)]",
				time: "text-foreground",
				separator: "text-muted-foreground",
				loadingIcon: "bg-background/75 text-foreground",
				error: "bg-background/90 text-foreground",
			},
		},
		{
			variant: ["overlay", "cinema"],
			class: {
				root: "bg-black text-white",
				controlBar: [
					"transition-[opacity,translate] duration-(--duration-slow) ease-(--ease-ui-out)",
					// Hides with the viewport's idle state unless the row is hovered, focused or has a menu open.
					"[[userinactive]:not([mediapaused])~&:not(:hover,:focus-within,[data-menu-open=true])]:opacity-0",
					"[[userinactive]:not([mediapaused])~&:not(:hover,:focus-within,[data-menu-open=true])]:duration-(--duration-panel-exit)",
					"motion-safe:[[userinactive]:not([mediapaused])~&:not(:hover,:focus-within,[data-menu-open=true])]:translate-y-2",
				],
				button: [
					"text-white/80 hover:bg-white/15 hover:text-white aria-pressed:bg-white/15 aria-pressed:text-white",
					"data-popup-open:bg-white/15 data-[state=open]:bg-white/15 focus-visible:ring-white/70 focus-visible:ring-offset-0",
				],
				range: [
					"[--media-range-track-background:rgb(255_255_255/0.22)]",
					"[--media-range-track-pointer-background:rgb(255_255_255/0.16)]",
					"[--media-time-range-buffered-color:rgb(255_255_255/0.38)]",
					"[--media-range-bar-color:white] [--media-range-thumb-background:white] [--media-box-arrow-background:white]",
				],
				preview:
					"bg-white [--media-preview-time-background:white] [--media-text-color:black]",
				time: "text-white",
				separator: "text-white/60",
				loadingIcon: "bg-black/40 text-white",
				error: "bg-black/80 text-white",
				errorAction:
					"border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white",
			},
		},
	],
	defaultVariants: { variant: "default" },
});

export type VideoPlayerVariant = NonNullable<VariantProps<typeof videoPlayer>["variant"]>;

/** The Card frame each variant sits in. */
export const VIDEO_PLAYER_CARD: Record<VideoPlayerVariant, CardVariant> = {
	default: "secondary",
	overlay: "default",
	cinema: "default",
	minimal: "ghost",
};

export const videoPlayerButton = tv({
	variants: {
		size: {
			default: "",
			// A large round play control centred over the frame, gone once playback starts.
			lg: [
				"absolute top-1/2 left-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg backdrop-blur-md [&_svg]:size-6 [&_[data-glyph=fill]]:fill-current",
				"transition-[opacity,scale,background-color] duration-(--duration-base) ease-(--ease-ui-out)",
				"hover:scale-105 active:scale-[var(--press-scale-lg)]",
				"data-[playing=true]:pointer-events-none data-[playing=true]:scale-90 data-[playing=true]:opacity-0",
			],
		},
		variant: {
			default: "",
			overlay: "",
			cinema: "",
			minimal: "",
		},
	},
	compoundVariants: [
		{
			size: "lg",
			variant: ["default", "minimal"],
			class:
				"bg-background/80 text-foreground hover:bg-background/95 hover:text-foreground",
		},
		{
			size: "lg",
			variant: ["overlay", "cinema"],
			class:
				"bg-black/45 text-white ring-1 ring-white/15 hover:bg-black/60 hover:text-white",
		},
	],
	defaultVariants: { size: "default", variant: "default" },
});

export type VideoPlayerButtonSize = NonNullable<
	VariantProps<typeof videoPlayerButton>["size"]
>;
