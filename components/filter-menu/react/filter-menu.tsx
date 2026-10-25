"use client";

import {
	type ComponentProps,
	createContext,
	type ReactNode,
	useContext,
	useState,
} from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../../accordion/react/accordion";
import { Badge } from "../../badge/react/badge";
import { Button } from "../../button/react/button";
import { Checkbox } from "../../checkbox/react/checkbox";
import { cn } from "../../lib/cn";
import {
	type FilterGroup,
	type FilterOption,
	type FilterValue,
	filterChips,
	toggleFilter,
} from "../filters";
import { type FilterMenuVariant, filterMenu } from "../variants";

export type { FilterGroup, FilterMenuVariant, FilterOption, FilterValue };

type Ctx = {
	groups: FilterGroup[];
	value: FilterValue;
	open: string[];
	setValue: (next: FilterValue) => void;
	setOpen: (next: string[]) => void;
	styles: ReturnType<typeof filterMenu>;
};
const FilterMenuContext = createContext<Ctx | null>(null);

function useFilterMenu(part: string): Ctx {
	const ctx = useContext(FilterMenuContext);
	if (!ctx) throw new Error(`${part} must be used inside <FilterMenu>`);
	return ctx;
}

export interface FilterMenuProps extends Omit<ComponentProps<"div">, "defaultValue"> {
	groups: FilterGroup[];
	/** Picked option ids, by group. Controlled with onValueChange. */
	value?: FilterValue;
	defaultValue?: FilterValue;
	onValueChange?: (value: FilterValue) => void;
	/** Open groups. Controlled with onOpenChange; by default the first group starts open. */
	open?: string[];
	defaultOpen?: string[];
	onOpenChange?: (open: string[]) => void;
	variant?: FilterMenuVariant;
}

/** The root: the groups, what is picked and which groups are open. */
export function FilterMenu({
	groups,
	value: valueProp,
	defaultValue = {},
	onValueChange,
	open: openProp,
	defaultOpen,
	onOpenChange,
	variant = "card",
	className,
	...props
}: FilterMenuProps) {
	const [internalValue, setInternalValue] = useState(defaultValue);
	const [internalOpen, setInternalOpen] = useState(
		() => defaultOpen ?? groups.slice(0, 1).map((g) => g.id),
	);
	const value = valueProp ?? internalValue;
	const open = openProp ?? internalOpen;
	const setValue = (next: FilterValue) => {
		if (valueProp === undefined) setInternalValue(next);
		onValueChange?.(next);
	};
	const setOpen = (next: string[]) => {
		if (openProp === undefined) setInternalOpen(next);
		onOpenChange?.(next);
	};
	const styles = filterMenu({ variant });
	return (
		<FilterMenuContext.Provider
			value={{ groups, value, open, setValue, setOpen, styles }}
		>
			<div
				data-slot="filter-menu"
				data-variant={variant}
				className={cn(styles.root(), className)}
				{...props}
			/>
		</FilterMenuContext.Provider>
	);
}

export function FilterMenuHeader({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useFilterMenu("FilterMenuHeader");
	return (
		<div
			data-slot="filter-menu-header"
			className={cn(styles.header(), className)}
			{...props}
		/>
	);
}

export function FilterMenuTitle({ className, ...props }: ComponentProps<"h2">) {
	const { styles } = useFilterMenu("FilterMenuTitle");
	return (
		<h2
			data-slot="filter-menu-title"
			className={cn(styles.title(), className)}
			{...props}
		/>
	);
}

/** Clears every pick; disabled while nothing is picked. */
export function FilterMenuClear({
	className,
	children = "Clear all",
}: {
	className?: string;
	children?: ReactNode;
}) {
	const { groups, value, setValue } = useFilterMenu("FilterMenuClear");
	const any = filterChips(groups, value).length > 0;
	return (
		<Button
			data-slot="filter-menu-clear"
			variant="ghost"
			size="sm"
			disabled={!any}
			className={className}
			onClick={() => setValue({})}
		>
			{children}
		</Button>
	);
}

/** The picked filters as removable chips; the row folds open with the first pick. */
export function FilterMenuChips({
	removeLabel = (chip) => `Remove ${chip}`,
	className,
}: {
	removeLabel?: (chip: string) => string;
	className?: string;
}) {
	const { groups, value, setValue, styles } = useFilterMenu("FilterMenuChips");
	const chips = filterChips(groups, value);
	return (
		<div
			data-slot="filter-menu-chips"
			data-shown={chips.length > 0 || undefined}
			className={cn(styles.chips(), className)}
		>
			<div className={styles.chipsClip()}>
				<div className={styles.chipList()} aria-live="polite">
					{chips.map((chip) => (
						<Badge
							key={`${chip.group}:${chip.option}`}
							variant="secondary"
							className={styles.chip()}
						>
							{chip.label}
							<button
								type="button"
								aria-label={removeLabel(chip.label)}
								className={styles.chipRemove()}
								onClick={() =>
									setValue(toggleFilter(value, chip.group, chip.option, false))
								}
							>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									aria-hidden="true"
								>
									<path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
								</svg>
							</button>
						</Badge>
					))}
				</div>
			</div>
		</div>
	);
}

/** Every group as an accordion item with its options as checkboxes and a count of picks. */
export function FilterMenuGroups({
	pickedLabel = (count) => `${count} picked`,
	className,
}: {
	pickedLabel?: (count: number) => string;
	className?: string;
}) {
	const { groups, value, open, setValue, setOpen, styles } =
		useFilterMenu("FilterMenuGroups");
	return (
		<Accordion
			type="multiple"
			value={open}
			onValueChange={(next) => setOpen(Array.isArray(next) ? next : [next])}
			className={cn(styles.groups(), className)}
		>
			{groups.map((group) => {
				const count = value[group.id]?.length ?? 0;
				return (
					<AccordionItem key={group.id} value={group.id} className={styles.item()}>
						<AccordionTrigger className={styles.trigger()}>
							<span className={styles.groupLabel()}>{group.label}</span>
							<span className={styles.groupPicked()}>
								{count > 0 ? pickedLabel(count) : ""}
							</span>
							<span className={styles.groupCount()}>{group.options.length}</span>
						</AccordionTrigger>
						<AccordionContent>
							<div className={styles.options()}>
								{group.options.map((option) => (
									<Checkbox
										key={option.id}
										label={option.label}
										checked={value[group.id]?.includes(option.id) ?? false}
										onCheckedChange={(on) =>
											setValue(toggleFilter(value, group.id, option.id, on))
										}
									/>
								))}
							</div>
						</AccordionContent>
					</AccordionItem>
				);
			})}
		</Accordion>
	);
}
