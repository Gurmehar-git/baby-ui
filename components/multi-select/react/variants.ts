import { tv, type VariantProps } from "tailwind-variants";
import type { BadgeSize } from "../../badge/react/variants";

export const multiSelect = tv({
	slots: {
		// The whole field anchors the list, so it drops straight below at full width.
		root: [
			"flex w-full min-w-0 flex-wrap items-center gap-1 border border-input bg-(--field)",
			"transition-[box-shadow,border-color] duration-[var(--duration-press)] ease-[var(--ease-ui-out)] motion-reduce:transition-none",
			"hover:border-border-strong has-[[role=combobox]:focus-visible]:border-ring",
			"has-[[role=combobox][data-popup-open]]:border-border-strong has-[[role=combobox][data-state=open]]:border-border-strong",
			"has-[[aria-invalid=true]]:border-destructive data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
		],
		chip: "pop-in max-w-40 gap-1 pr-0.5",
		chipLabel: "min-w-0 truncate",
		chipRemove:
			"relative inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground outline-none after:absolute after:-inset-1 transition-colors hover:bg-foreground/[0.08] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-3",
		trigger: [
			"group/trigger flex min-w-16 flex-1 cursor-pointer items-center justify-between gap-2 self-stretch rounded-md text-left text-foreground outline-none",
			"data-[placeholder]:text-muted-foreground",
		],
		chevron: [
			"size-3.5 shrink-0 text-muted-foreground transition-transform duration-[var(--duration-exit)] ease-[var(--ease-ui-out)] motion-reduce:transition-none",
			"group-data-[popup-open]/trigger:rotate-180 group-data-[state=open]/trigger:rotate-180 group-data-[popup-open]/trigger:duration-[var(--duration-dropdown)] group-data-[state=open]/trigger:duration-[var(--duration-dropdown)]",
		],
		// As wide as the field: Base UI sets --anchor-width, bits-ui --bits-popover-anchor-width.
		content:
			"w-[var(--anchor-width,var(--bits-popover-anchor-width))] min-w-56 overflow-hidden p-0",
		list: "rounded-none border-none bg-transparent shadow-none",
		// Choices read at full contrast; Command's own muted rows suit a palette, not a picker.
		item: "justify-start gap-2 text-foreground",
		box: [
			"flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input",
			"transition-[background-color,border-color] duration-(--duration-fast) ease-[var(--ease-smooth)] motion-reduce:transition-none",
			"data-[checked=true]:border-primary data-[checked=true]:bg-primary data-[checked=true]:text-primary-foreground",
		],
		check: "menu-check size-3 shrink-0",
	},
	variants: {
		// Field height on the control ladder: inner rows are the height minus the rim (border + padding),
		// so chips never push it taller. Popup rows match Select (xs 24 to xl 40).
		size: {
			xs: {
				root: "min-h-6 rounded-sm px-0.5 py-0 text-xs",
				trigger: "h-5.5 px-1",
				list: [
					"max-h-56 [&_[data-slot=command-empty]]:text-xs",
					"[&_[data-slot=command-input-wrapper]]:h-7 [&_[data-slot=command-input]]:h-full [&_[data-slot=command-input]]:text-base md:[&_[data-slot=command-input]]:text-xs",
					"[&_[data-slot=command-item]]:py-1 [&_[data-slot=command-item]]:text-xs",
				],
			},
			sm: {
				root: "min-h-8 rounded-md px-1 py-0.5 text-xs",
				trigger: "h-6.5 px-1.5",
				list: [
					"max-h-64 [&_[data-slot=command-empty]]:text-xs",
					"[&_[data-slot=command-input-wrapper]]:h-8 [&_[data-slot=command-input]]:h-full [&_[data-slot=command-input]]:text-base md:[&_[data-slot=command-input]]:text-xs",
					"[&_[data-slot=command-item]]:py-1.5 [&_[data-slot=command-item]]:text-xs",
				],
			},
			default: {
				root: "min-h-9 rounded-lg px-1 py-0.5 text-sm",
				trigger: "h-7.5 px-2",
				list: [
					"max-h-72 [&_[data-slot=command-empty]]:text-sm",
					"[&_[data-slot=command-input-wrapper]]:h-8 [&_[data-slot=command-input]]:h-full [&_[data-slot=command-input]]:text-base md:[&_[data-slot=command-input]]:text-sm",
					"[&_[data-slot=command-item]]:py-1.5 [&_[data-slot=command-item]]:text-sm",
				],
			},
			lg: {
				root: "min-h-10 rounded-lg px-1 py-0.5 text-sm",
				trigger: "h-8.5 px-2.5",
				list: [
					"max-h-80 [&_[data-slot=command-empty]]:text-sm",
					"[&_[data-slot=command-input-wrapper]]:h-9 [&_[data-slot=command-input]]:h-full [&_[data-slot=command-input]]:text-base md:[&_[data-slot=command-input]]:text-sm",
					"[&_[data-slot=command-item]]:py-2 [&_[data-slot=command-item]]:text-sm",
				],
			},
			xl: {
				root: "min-h-12 rounded-xl px-1.5 py-1 text-base",
				trigger: "h-9.5 px-2.5",
				list: [
					"max-h-96 [&_[data-slot=command-empty]]:text-base",
					"[&_[data-slot=command-input-wrapper]]:h-10 [&_[data-slot=command-input]]:h-full [&_[data-slot=command-input]]:text-base md:[&_[data-slot=command-input]]:text-base",
					"[&_[data-slot=command-item]]:py-2 [&_[data-slot=command-item]]:text-base",
				],
			},
		},
	},
	defaultVariants: { size: "default" },
});

export type MultiSelectSize = NonNullable<VariantProps<typeof multiSelect>["size"]>;

export interface MultiSelectOption {
	value: string;
	label: string;
	/** Extra words the search matches. */
	keywords?: string;
	disabled?: boolean;
}

export interface MultiSelectLabels {
	placeholder: string;
	search: string;
	empty: string;
	selectAll: string;
	clear: string;
	remove: string;
	/** Read after a chosen option, as the list's own highlight uses aria-selected. */
	selected: string;
	/** `{count}` hidden chips. */
	more: string;
}

export const MULTI_SELECT_LABELS: MultiSelectLabels = {
	placeholder: "Select…",
	search: "Search…",
	empty: "No matches",
	selectAll: "Select all",
	clear: "Clear selection",
	remove: "Remove",
	selected: "selected",
	more: "+{count}",
};

/** Toggles one value, keeping the options' order. */
export function toggleValue(
	options: MultiSelectOption[],
	value: string[],
	item: string,
): string[] {
	const next = new Set(value);
	if (next.has(item)) next.delete(item);
	else next.add(item);
	return options.filter((o) => next.has(o.value)).map((o) => o.value);
}

/** The chip Badge size for each field size: chips fit the field's inner row. */
export const MULTI_SELECT_CHIP: Record<MultiSelectSize, BadgeSize> = {
	xs: "sm",
	sm: "sm",
	default: "default",
	lg: "default",
	xl: "lg",
};
