import { tv, type VariantProps } from "tailwind-variants";

// Separate cards: a centred opener, numbered steps, optional resources, then a personal note.
export const emailWelcome = tv({
	slots: {
		heroImage: "mb-8 w-full rounded-lg",
		eyebrow:
			"m-0 mb-3 text-center font-semibold text-[13px] text-muted-foreground leading-[20px] dark:text-muted-foreground-dark",
		intro: "mt-3 text-center",
		action: "mt-8 text-center",
		steps: "mt-6",
		stepIndex: "w-[40px] align-top",
		stepBadge:
			"m-0 h-[26px] w-[26px] rounded-full bg-primary-soft text-center font-semibold text-[13px] text-foreground leading-[26px] dark:bg-primary-soft-dark dark:text-foreground-dark",
		stepTitle:
			"m-0 font-semibold text-[15px] text-foreground leading-[24px] dark:text-foreground-dark",
		stepBody:
			"m-0 text-[14px] text-muted-foreground leading-[22px] dark:text-muted-foreground-dark",
		stepLink:
			"m-0 mt-1 font-semibold text-[14px] leading-[22px] text-foreground dark:text-foreground-dark",
		stepGap: "h-[20px]",
		resource: "border-0 border-border border-t border-solid py-4 dark:border-border-dark",
		resourceTitle:
			"m-0 font-semibold text-[15px] text-foreground leading-[24px] dark:text-foreground-dark",
		noteAvatar: "h-[40px] w-[40px] rounded-full",
		noteAvatarCell: "w-[52px] align-middle",
		noteName:
			"m-0 font-semibold text-[14px] text-foreground leading-[20px] dark:text-foreground-dark",
		noteRole:
			"m-0 text-[13px] text-muted-foreground leading-[20px] dark:text-muted-foreground-dark",
		noteMessage: "mt-4",
		help: "mt-6 border-0 border-border border-t border-solid pt-5 dark:border-border-dark",
		link: "text-foreground underline dark:text-foreground-dark",
	},
	variants: {
		density: {
			comfortable: {},
			compact: { steps: "mt-4", stepGap: "h-[12px]", resource: "py-3" },
		},
	},
	defaultVariants: { density: "comfortable" },
});

export type EmailWelcomeDensity = NonNullable<
	VariantProps<typeof emailWelcome>["density"]
>;
