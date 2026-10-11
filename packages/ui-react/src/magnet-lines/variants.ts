import { tv, type VariantProps } from "tailwind-variants";

export const magnetLines = tv({
	slots: {
		root: "relative grid shrink-0 place-items-center",
		line: "rounded-full rotate-[var(--ml-angle,var(--ml-base))] transition-[rotate] duration-[var(--duration-overlay)] ease-[var(--ease-ui-out)] motion-reduce:transition-none",
	},
	variants: {
		size: {
			sm: { root: "size-48", line: "h-3 w-0.5" },
			md: { root: "size-72", line: "h-5 w-1" },
			lg: { root: "size-96", line: "h-7 w-1.5" },
		},
		tone: {
			muted: { line: "bg-muted-foreground/60" },
			foreground: { line: "bg-foreground" },
			primary: { line: "bg-primary" },
			chart: { line: "bg-[var(--chart-1)]" },
		},
	},
	defaultVariants: { size: "md", tone: "muted" },
});

export type MagnetLinesSize = NonNullable<VariantProps<typeof magnetLines>["size"]>;
export type MagnetLinesTone = NonNullable<VariantProps<typeof magnetLines>["tone"]>;
