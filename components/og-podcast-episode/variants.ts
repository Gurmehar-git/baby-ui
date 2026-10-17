import { tv, type VariantProps } from "tailwind-variants";

export const ogPodcastEpisode = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] items-center gap-[56px] overflow-hidden bg-background p-[64px] font-sans text-foreground",
		dots: "absolute inset-0 bg-[radial-gradient(var(--border)_2px,transparent_2px)] bg-[size:32px_32px] opacity-70",
		glow: "absolute top-[40px] h-[560px] w-[560px] rounded-full opacity-50 blur-[140px]",
		art: "relative flex h-[420px] w-[460px] shrink-0",
		disc: "absolute top-[20px] flex h-[380px] w-[380px] items-center justify-center rounded-full border-[18px] border-border bg-muted",
		discRing:
			"flex h-[250px] w-[250px] items-center justify-center rounded-full border-2 border-border",
		discLabel: "h-[96px] w-[96px] rounded-full",
		cover:
			"absolute top-0 flex h-[420px] w-[380px] overflow-hidden rounded-[36px] border border-border bg-card [box-shadow:0_32px_96px_-12px_rgb(0_0_0/0.35)]",
		coverImage: "h-full w-full object-cover",
		coverFallback: "flex h-full w-full items-center justify-center",
		content: "relative flex h-full min-w-0 flex-1 flex-col",
		header: "flex items-center gap-4",
		show: "line-clamp-1 font-semibold text-[28px] tracking-tight",
		episode: "shrink-0 rounded-full px-4 py-1.5 font-semibold text-[22px]",
		body: "mt-auto flex flex-col gap-6",
		title:
			"line-clamp-3 font-bold font-heading text-[56px] leading-[1.05] tracking-tight",
		guest: "flex items-center gap-4 text-[26px] text-muted-foreground",
		guestAvatar: "h-12 w-12 rounded-full border-2 border-background object-cover",
		guestName: "line-clamp-1 font-semibold text-foreground",
		player: "mt-auto flex items-center gap-6 pt-10",
		play: "flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full",
		wave: "flex h-[72px] min-w-0 flex-1 items-center gap-[5px] overflow-hidden",
		bar: "w-[6px] shrink-0 rounded-full",
		duration: "shrink-0 font-semibold text-[26px] text-muted-foreground tabular-nums",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
		tone: {
			chart: {
				glow: "bg-chart-1",
				discLabel: "bg-chart-1",
				coverFallback: "bg-chart-1 text-background",
				episode: "bg-chart-1/15 text-chart-1",
				play: "bg-chart-1 text-background",
				bar: "bg-chart-1",
			},
			primary: {
				glow: "bg-primary",
				discLabel: "bg-primary",
				coverFallback: "bg-primary text-primary-foreground",
				episode: "bg-primary/15 text-primary",
				play: "bg-primary text-primary-foreground",
				bar: "bg-primary",
			},
			neutral: {
				glow: "bg-foreground/25",
				discLabel: "bg-foreground",
				coverFallback: "bg-foreground text-background",
				episode: "bg-foreground/10 text-foreground",
				play: "bg-foreground text-background",
				bar: "bg-foreground",
			},
		},
		layout: {
			left: { glow: "-left-[120px]", disc: "left-[80px]", cover: "left-0" },
			right: {
				root: "flex-row-reverse",
				glow: "-right-[120px]",
				disc: "right-[80px]",
				cover: "right-0",
			},
		},
	},
	defaultVariants: { mode: "light", tone: "neutral", layout: "left" },
});

export type OgPodcastEpisodeMode = NonNullable<
	VariantProps<typeof ogPodcastEpisode>["mode"]
>;
export type OgPodcastEpisodeTone = NonNullable<
	VariantProps<typeof ogPodcastEpisode>["tone"]
>;
export type OgPodcastEpisodeLayout = NonNullable<
	VariantProps<typeof ogPodcastEpisode>["layout"]
>;
