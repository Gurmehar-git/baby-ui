"use client";

import { useRef, useState } from "react";
import { Badge } from "../../badge/react/badge";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "../../command/react/command";
import { cn } from "../../lib/react/cn";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover/react/popover";
import { RollingDigits } from "../../rolling-digits/react/rolling-digits";
import {
	MULTI_SELECT_CHIP,
	MULTI_SELECT_LABELS,
	type MultiSelectLabels,
	type MultiSelectOption,
	type MultiSelectSize,
	multiSelect,
	toggleValue,
} from "./variants";

export type { MultiSelectLabels, MultiSelectOption, MultiSelectSize };

export interface MultiSelectProps {
	options: MultiSelectOption[];
	/** Controlled selection, in option order. */
	value: string[];
	onValueChange: (value: string[]) => void;
	/** Chips shown before collapsing the rest into "+N". */
	maxChips?: number;
	size?: MultiSelectSize;
	disabled?: boolean;
	invalid?: boolean;
	id?: string;
	"aria-label"?: string;
	"aria-labelledby"?: string;
	labels?: Partial<MultiSelectLabels>;
	className?: string;
}

export function MultiSelect({
	options,
	value,
	onValueChange,
	maxChips = 3,
	size = "default",
	disabled = false,
	invalid = false,
	id,
	"aria-label": ariaLabel,
	"aria-labelledby": ariaLabelledBy,
	labels: labelsProp,
	className,
}: MultiSelectProps) {
	const labels = { ...MULTI_SELECT_LABELS, ...labelsProp };
	const s = multiSelect({ size });
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const field = useRef<HTMLDivElement>(null);
	const selected = options.filter((o) => value.includes(o.value));
	const shown = selected.slice(0, maxChips);
	const hidden = selected.length - shown.length;
	const enabled = options.filter((o) => !o.disabled);
	const allSelected = enabled.length > 0 && enabled.every((o) => value.includes(o.value));

	const toggle = (item: string) => onValueChange(toggleValue(options, value, item));
	const removeLast = () => {
		const last = selected.at(-1);
		if (last) toggle(last.value);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<div
				ref={field}
				data-slot="multi-select"
				data-disabled={disabled || undefined}
				className={cn(s.root(), className)}
			>
				{shown.map((option) => (
					<Badge
						key={option.value}
						variant="secondary"
						size={MULTI_SELECT_CHIP[size]}
						className={s.chip()}
					>
						<span className={s.chipLabel()}>{option.label}</span>
						<button
							type="button"
							aria-label={`${labels.remove} ${option.label}`}
							disabled={disabled}
							className={s.chipRemove()}
							onClick={() => toggle(option.value)}
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.2"
								strokeLinecap="round"
								aria-hidden
							>
								<path d="M18 6 6 18M6 6l12 12" />
							</svg>
						</button>
					</Badge>
				))}
				{hidden > 0 ? (
					<Badge size={MULTI_SELECT_CHIP[size]} variant="outline" className="pop-in">
						{labels.more.split("{count}")[0]}
						<RollingDigits value={hidden} startOnView={false} />
						{labels.more.split("{count}")[1]}
					</Badge>
				) : null}
				<PopoverTrigger
					id={id}
					role="combobox"
					aria-label={ariaLabel}
					aria-labelledby={ariaLabelledBy}
					aria-invalid={invalid || undefined}
					disabled={disabled}
					data-slot="multi-select-trigger"
					data-placeholder={selected.length ? undefined : ""}
					className={s.trigger()}
					onKeyDown={(e) => {
						if (e.key === "Backspace") {
							e.preventDefault();
							removeLast();
						}
					}}
				>
					<span className="truncate">{selected.length ? "" : labels.placeholder}</span>
					<svg viewBox="0 0 16 16" fill="none" aria-hidden className={s.chevron()}>
						<path
							d="m4 6 4 4 4-4"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</PopoverTrigger>
			</div>
			<PopoverContent anchor={field} align="start" className={s.content()}>
				<Command className={s.list()}>
					<CommandInput
						placeholder={labels.search}
						value={search}
						onValueChange={setSearch}
						onKeyDown={(e) => {
							if (e.key === "Backspace" && !search) removeLast();
						}}
					/>
					<CommandList>
						<CommandEmpty>{labels.empty}</CommandEmpty>
						<CommandGroup>
							{options.map((option) => {
								const checked = value.includes(option.value);
								return (
									<CommandItem
										key={option.value}
										value={option.value}
										keywords={`${option.label} ${option.keywords ?? ""}`}
										disabled={option.disabled}
										className={s.item()}
										onSelect={() => toggle(option.value)}
									>
										<span className="flex min-w-0 items-center gap-2">
											<span aria-hidden data-checked={checked} className={s.box()}>
												<CheckIcon on={checked} className={s.check()} />
											</span>
											<span className="truncate">{option.label}</span>
											{checked ? (
												<span className="sr-only">, {labels.selected}</span>
											) : null}
										</span>
									</CommandItem>
								);
							})}
						</CommandGroup>
						{search ? null : (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										value="__select-all"
										disabled={allSelected}
										onSelect={() =>
											onValueChange(
												options
													.filter((o) => !o.disabled || value.includes(o.value))
													.map((o) => o.value),
											)
										}
									>
										{labels.selectAll}
									</CommandItem>
									<CommandItem
										value="__clear"
										disabled={!value.length}
										onSelect={() => onValueChange([])}
									>
										{labels.clear}
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

// Always mounted: the tick draws in when the row is chosen and back out when it is not.
function CheckIcon({ on, className }: { on: boolean; className?: string }) {
	return (
		<svg viewBox="0 0 14 14" fill="none" aria-hidden data-on={on} className={className}>
			<path
				d="M3 7.4 5.6 10 11 4.2"
				pathLength={1}
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
