import { tv, type VariantProps } from "tailwind-variants";

export const ogAppIcon = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] items-center justify-center overflow-hidden bg-background font-sans text-foreground",
		doodle: "absolute border-[3px] border-foreground/10",
		tile: "relative flex h-[340px] w-[340px] items-center justify-center rounded-[76px] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.45)]",
		sheen:
			"absolute inset-0 rounded-[76px] bg-[linear-gradient(160deg,rgb(255_255_255/0.28),transparent_45%)]",
		logo: "relative h-[170px] w-[170px] object-contain",
	},
	variants: {
		mode: {
			// The light field carries a faint doodle scatter; the dark one stays plain.
			light: {},
			dark: { root: "dark", doodle: "hidden" },
		},
	},
	defaultVariants: { mode: "light" },
});

export type OgAppIconMode = NonNullable<VariantProps<typeof ogAppIcon>["mode"]>;

type Doodle = {
	left: number;
	top: number;
	size: number;
	shape: "ring" | "square" | "dot";
	turn: number;
};

/** Hand-placed scatter around the icon, kept clear of the centre 420px. */
export const OG_APP_ICON_DOODLES: Doodle[] = [
	{ left: 96, top: 72, size: 26, shape: "ring", turn: 0 },
	{ left: 248, top: 168, size: 22, shape: "square", turn: 18 },
	{ left: 132, top: 316, size: 14, shape: "dot", turn: 0 },
	{ left: 64, top: 472, size: 30, shape: "square", turn: 32 },
	{ left: 236, top: 548, size: 20, shape: "ring", turn: 0 },
	{ left: 330, top: 404, size: 12, shape: "dot", turn: 0 },
	{ left: 352, top: 52, size: 16, shape: "dot", turn: 0 },
	{ left: 820, top: 64, size: 24, shape: "square", turn: 12 },
	{ left: 980, top: 150, size: 28, shape: "ring", turn: 0 },
	{ left: 1104, top: 64, size: 14, shape: "dot", turn: 0 },
	{ left: 1060, top: 330, size: 22, shape: "square", turn: 40 },
	{ left: 880, top: 470, size: 26, shape: "ring", turn: 0 },
	{ left: 1110, top: 540, size: 16, shape: "dot", turn: 0 },
	{ left: 820, top: 300, size: 12, shape: "dot", turn: 0 },
	{ left: 560, top: 28, size: 18, shape: "ring", turn: 0 },
	{ left: 610, top: 578, size: 20, shape: "square", turn: 24 },
];

export const ogAppIconDoodle = tv({
	variants: {
		shape: {
			ring: "rounded-full",
			square: "rounded-[6px]",
			dot: "rounded-full border-0 bg-foreground/10",
		},
	},
});
