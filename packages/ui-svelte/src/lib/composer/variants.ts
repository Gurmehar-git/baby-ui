import { tv, type VariantProps } from "tailwind-variants";

export const composer = tv({
	slots: {
		root: "relative w-full rounded-2xl border border-input bg-(--field) p-2 transition-colors focus-within:border-ring",
		textarea:
			"scrollbar-none block w-full resize-none overflow-y-auto bg-transparent text-foreground outline-none placeholder:text-muted-foreground",
		toolbar: "mt-1 flex min-h-8 items-center gap-1",
	},
	variants: {
		size: {
			sm: { textarea: "px-1.5 pt-1 text-xs leading-5" },
			default: { textarea: "px-2 pt-1.5 text-sm leading-6" },
			lg: { textarea: "px-2.5 pt-2 text-base leading-7" },
		},
	},
	defaultVariants: { size: "default" },
});

export type ComposerSize = NonNullable<VariantProps<typeof composer>["size"]>;

export const COMPOSER_LINE_HEIGHT: Record<ComposerSize, number> = {
	sm: 20,
	default: 24,
	lg: 28,
};
