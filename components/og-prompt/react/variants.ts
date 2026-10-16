import { tv, type VariantProps } from "tailwind-variants";

export const ogPrompt = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] flex-col items-center overflow-hidden bg-background pt-[150px] font-sans text-foreground",
		// A tall soft band of colour that rises behind the prompt box.
		aura: "absolute bottom-[-140px] left-[40px] h-[470px] w-[1120px] rounded-[220px] opacity-90 blur-[64px]",
		wash: "absolute inset-x-0 top-0 h-[420px] opacity-40",
		brand: "relative flex items-center gap-6",
		logo: "h-[104px] w-[104px] shrink-0 object-contain",
		name: "line-clamp-1 max-w-[760px] font-heading font-bold text-[124px] leading-none tracking-[-0.045em]",
		description:
			"relative mt-8 line-clamp-1 max-w-[1000px] text-center font-semibold text-[38px] tracking-[-0.01em]",
		box: "absolute bottom-[-56px] left-[120px] h-[250px] w-[960px] rounded-[48px] border border-border bg-card px-[44px] pt-[46px] shadow-[0_-10px_40px_-10px_rgb(0_0_0/0.4)]",
		field: "flex items-center gap-1 text-[34px] text-foreground",
		caret: "h-[44px] w-[3px] rounded-full bg-primary",
		send: "absolute top-[34px] right-[34px] flex h-[76px] w-[76px] items-center justify-center rounded-full bg-foreground text-background",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
		tone: {
			chart: {
				aura: "bg-[linear-gradient(180deg,var(--chart-1),var(--chart-5)_55%,var(--chart-2))]",
				wash: "bg-[linear-gradient(180deg,transparent,var(--chart-1))]",
			},
			primary: {
				aura: "bg-[linear-gradient(180deg,var(--primary),color-mix(in_oklab,var(--primary)_40%,white))]",
				wash: "bg-[linear-gradient(180deg,transparent,var(--primary))]",
			},
		},
	},
	defaultVariants: { mode: "dark", tone: "chart" },
});

export type OgPromptMode = NonNullable<VariantProps<typeof ogPrompt>["mode"]>;
export type OgPromptTone = NonNullable<VariantProps<typeof ogPrompt>["tone"]>;
