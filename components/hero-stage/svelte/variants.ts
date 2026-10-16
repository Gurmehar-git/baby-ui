import { tv, type VariantProps } from "tailwind-variants";

export const heroStage = tv({
	slots: {
		root: "relative perspective-[1800px]",
		frame: "",
		slot: "relative rounded-2xl outline outline-border outline-offset-3 outline-dashed",
		card: "grid h-full rounded-2xl",
	},
	variants: {
		motion: {
			scroll: {
				frame: "hero-stage-frame hero-stage-tilt",
				slot: "hero-stage-slot",
				card: "hero-stage-scatter",
			},
			enter: { frame: "hero-stage-frame", slot: "hero-stage-slot" },
			none: {},
		},
	},
	defaultVariants: { motion: "scroll" },
});

export type HeroStageMotion = NonNullable<VariantProps<typeof heroStage>["motion"]>;
