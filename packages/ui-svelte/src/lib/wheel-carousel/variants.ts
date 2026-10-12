import { tv, type VariantProps } from "tailwind-variants";

export const wheelCarousel = tv({
	slots: {
		root: "card-fade-up flex w-full items-center justify-center overflow-hidden",
		stage:
			"flex h-full w-full touch-none select-none items-stretch overflow-hidden rounded-xl has-focus-visible:ring-2 has-focus-visible:ring-ring cursor-grab active:cursor-grabbing",
		photoCol: "flex h-full w-[var(--photo-width)] shrink-0 items-center justify-center",
		photo: "relative isolate w-full max-h-full overflow-hidden rounded-[14px] bg-muted",
		image:
			"absolute inset-0 size-full object-cover transition-[opacity,scale] duration-[var(--duration-overlay)] ease-[var(--ease-ui-out)] starting:scale-[1.04] starting:opacity-0 data-[leaving]:opacity-0 motion-reduce:transition-none",
		list: "relative h-full min-w-0 flex-1 overflow-hidden outline-none mask-[linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]",
		marker:
			"absolute top-1/2 z-10 size-4 -translate-x-full -translate-y-1/2 rounded-full bg-primary",
		item: "absolute top-1/2 origin-left whitespace-nowrap font-medium leading-none text-muted-foreground transition-colors duration-(--duration-fast) data-[selected]:text-foreground",
	},
	variants: {
		photoSide: {
			left: {},
			right: { stage: "flex-row-reverse" },
		},
		aspect: {
			"3/4": { photo: "aspect-[3/4]" },
			"1/1": { photo: "aspect-square" },
			"4/3": { photo: "aspect-[4/3]" },
			"3/2": { photo: "aspect-[3/2]" },
		},
		size: {
			sm: { root: "min-h-80", item: "text-lg" },
			default: { root: "min-h-[420px]", item: "text-[clamp(1rem,2.4vw,1.625rem)]" },
			lg: { root: "min-h-[520px]", item: "text-[clamp(1.25rem,3vw,2.25rem)]" },
		},
	},
	defaultVariants: { photoSide: "left", aspect: "3/4", size: "default" },
});

export type WheelCarouselPhotoSide = NonNullable<
	VariantProps<typeof wheelCarousel>["photoSide"]
>;
export type WheelCarouselAspect = NonNullable<
	VariantProps<typeof wheelCarousel>["aspect"]
>;
export type WheelCarouselSize = NonNullable<VariantProps<typeof wheelCarousel>["size"]>;
