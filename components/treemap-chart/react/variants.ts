import { tv, type VariantProps } from "tailwind-variants";

// Tiles are absolutely placed HTML so labels wrap and truncate; the engine writes their rects.
export const treemapChart = tv({
	slots: {
		bar: "flex min-w-0 items-baseline justify-between gap-3 pb-2",
		total: "font-medium text-foreground text-sm tabular-nums",
		crumb: "max-w-40 truncate",
		tile: [
			"group/tile absolute top-0 left-0 flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-[4px] bg-(--treemap-fill) px-2 py-1.5 text-left will-change-transform",
			"text-foreground outline-offset-[-2px] transition-[background-color,box-shadow,filter] duration-(--duration-fast)",
			"data-[branch=true]:bg-transparent data-[branch=true]:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--treemap-hue)_30%,transparent)] data-[level=2]:rounded-[3px]",
			"data-[active=true]:shadow-[inset_0_0_0_2px_var(--color-foreground)] data-[dim=true]:[filter:opacity(0.45)]",
		],
		label: "truncate font-medium text-xs leading-4 group-data-[room=none]/tile:hidden",
		value:
			"truncate text-[11px] text-foreground/65 tabular-nums leading-4 group-data-[room=name]/tile:hidden group-data-[room=none]/tile:hidden group-data-[branch=true]/tile:hidden",
		scale: "flex items-center gap-2 pt-2 text-muted-foreground text-xs",
		steps: "flex h-2 w-24 overflow-hidden rounded-full",
		step: "flex-1 bg-(--treemap-fill)",
	},
	variants: {
		variant: {
			default: {},
			flat: { tile: "rounded-none data-[level=2]:rounded-none" },
		},
	},
	defaultVariants: { variant: "default" },
});

export type TreemapVariant = NonNullable<VariantProps<typeof treemapChart>["variant"]>;
