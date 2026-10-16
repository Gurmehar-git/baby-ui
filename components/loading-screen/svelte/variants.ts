import { tv, type VariantProps } from "tailwind-variants";

/** Hidden screens fade and turn invisible after the fade, so they stop catching clicks. */
export const loadingScreen = tv({
	slots: {
		root: [
			"inset-0 z-50 grid place-content-center justify-items-center gap-5 bg-background text-foreground",
			"transition-[opacity,visibility] ease-[var(--ease-ui-out)] motion-reduce:transition-none",
		],
		logo: "grid size-10 place-items-center [&_svg]:size-full",
		indicator: "flex items-center justify-center",
		dots: "flex items-center gap-1.5",
		dot: "loading-screen-dot size-1.5 rounded-full bg-current",
		caption: "text-muted-foreground text-sm",
		srOnly: "sr-only",
	},
	variants: {
		position: {
			fixed: { root: "fixed" },
			absolute: { root: "absolute" },
		},
		logoMotion: {
			breathe: { logo: "loading-screen-breathe" },
			none: {},
		},
		indicator: {
			bar: {},
			spinner: {},
			dots: {},
			none: {},
		},
		open: {
			true: { root: "visible opacity-100 duration-[var(--duration-overlay)]" },
			false: { root: "invisible opacity-0 delay-0 duration-[var(--duration-exit)]" },
		},
	},
	defaultVariants: {
		position: "fixed",
		logoMotion: "breathe",
		indicator: "bar",
		open: true,
	},
});

export type LoadingScreenPosition = NonNullable<
	VariantProps<typeof loadingScreen>["position"]
>;
export type LoadingScreenLogoMotion = NonNullable<
	VariantProps<typeof loadingScreen>["logoMotion"]
>;
export type LoadingScreenIndicator = NonNullable<
	VariantProps<typeof loadingScreen>["indicator"]
>;

/** Screen-reader status text, with the percent when progress is known. */
export function statusLabel(label: string, progress: number | undefined): string {
	return progress === undefined ? label : `${label} ${Math.round(progress)}%`;
}
