"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import {
	type CSSProperties,
	type ReactNode,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import { cn } from "../../lib/cn";
import { glideHighlight } from "../../lib/glide";
import { trackActiveWidth } from "../../lib/morph";
import {
	flatOptions,
	type MorphSelectGroup,
	type MorphSelectItem,
	type MorphSelectOption,
	sections,
} from "../options";
import { type MorphSelectSize, type MorphSelectVariant, morphSelect } from "../variants";

export type {
	MorphSelectGroup,
	MorphSelectItem,
	MorphSelectOption,
	MorphSelectSize,
	MorphSelectVariant,
};

export interface MorphSelectProps {
	/** Visible label, also the accessible name of the trigger and the list. */
	label: string;
	/** Keeps the label for assistive tech only. */
	hideLabel?: boolean;
	items: MorphSelectItem[];
	value?: string | null;
	defaultValue?: string | null;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	/** Width of the open surface in px; never narrower than the trigger. */
	panelWidth?: number;
	/** Tallest the list gets before it scrolls, in px. */
	maxListHeight?: number;
	variant?: MorphSelectVariant;
	size?: MorphSelectSize;
	/** Adds a hidden input for native form submission. */
	name?: string;
	disabled?: boolean;
	className?: string;
}

const Chevron = ({ className }: { className: string }) => (
	<svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
		<path
			d="m4 6 4 4 4-4"
			stroke="currentColor"
			strokeWidth="1.4"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

/**
 * A select whose trigger is the list: opening grows the trigger into the options surface, a
 * highlight glides between rows, and the chosen label rolls into the trigger as it resizes.
 */
export function MorphSelect({
	label,
	hideLabel = false,
	items,
	value,
	defaultValue = null,
	onValueChange,
	placeholder = "Select",
	panelWidth = 272,
	maxListHeight = 296,
	variant = "default",
	size = "default",
	name,
	disabled = false,
	className,
}: MorphSelectProps) {
	const labelId = useId();
	const [inner, setInner] = useState(defaultValue);
	const selected = value !== undefined ? value : inner;
	const [open, setOpen] = useState(false);
	const all = useMemo(() => flatOptions(items), [items]);
	const groups = useMemo(() => sections(items), [items]);
	const current = all.find((option) => option.value === selected);
	const frameRef = useRef<HTMLSpanElement>(null);
	const [list, setList] = useState<HTMLDivElement | null>(null);
	const pillRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (frameRef.current) return trackActiveWidth(frameRef.current);
	}, []);
	useEffect(() => {
		if (list && pillRef.current) return glideHighlight(list, pillRef.current);
	}, [list]);

	const s = morphSelect({ size, variant });
	const shown = (option: MorphSelectOption | undefined): ReactNode =>
		option ? option.label : <span className={s.placeholder()}>{placeholder}</span>;

	return (
		<div data-slot="morph-select" className={cn(s.root(), className)}>
			<span id={labelId} className={hideLabel ? "sr-only" : s.label()}>
				{label}
			</span>
			<SelectPrimitive.Root<string>
				value={selected}
				onValueChange={(next) => {
					if (next === null) return;
					if (value === undefined) setInner(next);
					onValueChange?.(next);
				}}
				open={open}
				onOpenChange={setOpen}
				items={all}
				name={name}
				disabled={disabled}
			>
				<SelectPrimitive.Trigger aria-labelledby={labelId} className={s.trigger()}>
					<span ref={frameRef} className={s.frame()}>
						<span key={selected ?? ""} data-on="true" className={s.value()}>
							{shown(current)}
						</span>
					</span>
					<Chevron className={s.chevron()} />
				</SelectPrimitive.Trigger>
				<SelectPrimitive.Portal>
					<SelectPrimitive.Positioner
						side="bottom"
						align="start"
						sideOffset={({ anchor }) => -anchor.height}
						alignItemWithTrigger={false}
						collisionAvoidance={{
							side: "shift",
							align: "shift",
							fallbackAxisSide: "none",
						}}
						className="isolate z-50"
					>
						<SelectPrimitive.Popup
							className={s.popup()}
							// Portaled, so the sizes ride on the popup itself.
							style={
								{
									"--ms-panel": `${panelWidth}px`,
									"--ms-list": `${maxListHeight}px`,
								} as CSSProperties
							}
						>
							{/* The lid repeats the trigger, so the surface reads as the trigger growing. */}
							<div aria-hidden className={s.lid()} onClick={() => setOpen(false)}>
								<span className="truncate">{shown(current)}</span>
								<Chevron className={cn(s.chevron(), "rotate-180")} />
							</div>
							<SelectPrimitive.List ref={setList} className={s.list()}>
								<span ref={pillRef} aria-hidden className={s.pill()} />
								{groups.map((section) => {
									const rows = section.options.map((option) => (
										<SelectPrimitive.Item
											key={option.value}
											value={option.value}
											label={option.label}
											disabled={option.disabled}
											className={s.item()}
										>
											<SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
											{option.meta && <span className={s.meta()}>{option.meta}</span>}
											<svg
												viewBox="0 0 14 14"
												fill="none"
												aria-hidden
												data-on={option.value === selected}
												className={cn(s.check(), !option.meta && "ml-auto")}
											>
												<path
													d="M3 7.4 5.6 10 11 4.2"
													pathLength={1}
													stroke="currentColor"
													strokeWidth="1.6"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</SelectPrimitive.Item>
									));
									return section.label ? (
										<SelectPrimitive.Group key={section.key}>
											<SelectPrimitive.GroupLabel className={s.groupLabel()}>
												{section.label}
											</SelectPrimitive.GroupLabel>
											{rows}
										</SelectPrimitive.Group>
									) : (
										<div key={section.key} role="presentation">
											{rows}
										</div>
									);
								})}
							</SelectPrimitive.List>
						</SelectPrimitive.Popup>
					</SelectPrimitive.Positioner>
				</SelectPrimitive.Portal>
			</SelectPrimitive.Root>
		</div>
	);
}
