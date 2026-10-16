import { tv, type VariantProps } from "tailwind-variants";

export const ogPromptPhoto = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] flex-col items-center justify-center overflow-hidden bg-background font-sans text-foreground",
		image: "absolute inset-0 h-full w-full object-cover",
		// White over the photo whatever the mode: the photo, not the theme, sets the backdrop.
		title:
			"relative line-clamp-2 max-w-[1000px] text-center font-heading font-bold text-[60px] text-white leading-[1.14] tracking-[-0.025em]",
		card: "relative mt-[44px] flex h-[190px] w-[860px] flex-col justify-between rounded-[24px] bg-background p-[26px] shadow-[0_30px_60px_-24px_rgb(0_0_0/0.35)]",
		field: "flex items-center gap-1 text-[24px] text-muted-foreground",
		caret: "h-[30px] w-[2px] bg-foreground",
		row: "flex items-center gap-3",
		chip: "flex h-[44px] items-center gap-2 rounded-full border border-border px-4 text-[20px] text-foreground",
		iconChip:
			"flex h-[44px] w-[44px] items-center justify-center rounded-full border border-border text-muted-foreground",
		send: "ml-auto flex h-[44px] w-[44px] items-center justify-center text-foreground",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
	},
	defaultVariants: { mode: "light" },
});

export type OgPromptPhotoMode = NonNullable<VariantProps<typeof ogPromptPhoto>["mode"]>;
