"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "../../button/react/button";
import { Checkbox } from "../../checkbox/react/checkbox";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../../hover-card/react/hover-card";
import { cn } from "../../lib/cn";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover/react/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../select/react/select";
import { Switch } from "../../switch/react/switch";
import { NEW_PROPERTY_TYPES, TYPE_GLYPHS, toggleIn } from "../model";
import type {
	Glyph,
	RecordsColumnConfig,
	RecordsColumnSettings,
	RecordsColumnType,
	RecordsTableLabels,
	RecordsToolKind,
	ResolvedColumn,
} from "../types";

export function Icon({ children, size = 14 }: { children: ReactNode; size?: number }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			{children}
		</svg>
	);
}

export function GlyphIcon({ glyphs, size = 14 }: { glyphs: Glyph[]; size?: number }) {
	return (
		<span className="shrink-0 text-muted-foreground">
			<Icon size={size}>
				{glyphs.map((g, i) => {
					const { kind, ...attrs } = g;
					const Tag = kind;
					// biome-ignore lint/suspicious/noArrayIndexKey: characters of one string never reorder, so position is the identity.
					return <Tag key={i} {...attrs} />;
				})}
			</Icon>
		</span>
	);
}

const TOOL_GLYPHS: Record<RecordsToolKind, ReactNode> = {
	model: (
		<path d="M12 3l1.7 5.1a2 2 0 0 0 1.2 1.2L20 11l-5.1 1.7a2 2 0 0 0-1.2 1.2L12 19l-1.7-5.1a2 2 0 0 0-1.2-1.2L4 11l5.1-1.7a2 2 0 0 0 1.2-1.2z" />
	),
	web: (
		<g>
			<circle cx="12" cy="12" r="9" />
			<path d="M3 12h18M12 3a13.5 13.5 0 0 1 3.5 9 13.5 13.5 0 0 1-3.5 9 13.5 13.5 0 0 1-3.5-9A13.5 13.5 0 0 1 12 3z" />
		</g>
	),
	user: (
		<g>
			<circle cx="12" cy="8" r="4" />
			<path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
		</g>
	),
};

function ConfigRow({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className="relative flex h-8 items-center justify-between">
			<span className="text-sm text-muted-foreground">{label}</span>
			{children}
		</div>
	);
}

const ACTION_ROW =
	"flex h-8 items-center gap-2.5 rounded-md px-1.5 text-left text-sm text-foreground transition-colors hover:bg-accent";
const PICKER_TRIGGER =
	"h-7 w-auto min-w-0 gap-1.5 border-none bg-transparent px-1.5 font-medium text-sm text-foreground hover:bg-accent";

export interface ConfigPopoverProps {
	title: string;
	labels: RecordsTableLabels;
	column: ResolvedColumn;
	onChange: (patch: RecordsColumnConfig) => void;
	inputOptions: string[];
	modelOptions: string[];
	pinned: boolean;
	onTogglePin: () => void;
	onHide?: () => void;
	onCalculate: () => void;
	calculating: boolean;
}

/** Every picker composes the real `Select`/`Popover`; all settings live in the table's `config`. */
export function ConfigPopover({
	title,
	labels,
	column,
	onChange,
	inputOptions,
	modelOptions,
	pinned,
	onTogglePin,
	onHide,
	onCalculate,
	calculating,
}: ConfigPopoverProps) {
	const [moreOpen, setMoreOpen] = useState(false);
	const behaviour: (keyof Omit<RecordsColumnSettings, "grounding">)[] = [
		"required",
		"allowEmpty",
		"confidence",
	];

	return (
		<div data-slot="records-table-config-popover">
			<div className="pb-2 font-medium text-sm text-foreground">{title}</div>

			<ConfigRow label={labels.type}>
				<Select
					value={column.type}
					onValueChange={(v) => onChange({ type: v as RecordsColumnType })}
					items={NEW_PROPERTY_TYPES.map((type) => ({ value: type, label: type }))}
				>
					<SelectTrigger aria-label={labels.type} className={PICKER_TRIGGER}>
						<GlyphIcon glyphs={TYPE_GLYPHS[column.type]} />
						<SelectValue />
					</SelectTrigger>
					<SelectContent align="start">
						{NEW_PROPERTY_TYPES.map((type) => (
							<SelectItem key={type} value={type}>
								<span className="flex items-center gap-1.5">
									<GlyphIcon glyphs={TYPE_GLYPHS[type]} />
									{type}
								</span>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</ConfigRow>

			<ConfigRow label={labels.tool}>
				<Select
					value={column.tool}
					onValueChange={(tool) => onChange({ tool, toolKind: "model" })}
					items={modelOptions.map((model) => ({ value: model, label: model }))}
				>
					<SelectTrigger aria-label={labels.tool} className={PICKER_TRIGGER}>
						<span
							className={
								column.toolKind === "model" ? "text-primary" : "text-muted-foreground"
							}
						>
							<Icon size={14}>{TOOL_GLYPHS[column.toolKind]}</Icon>
						</span>
						<SelectValue />
					</SelectTrigger>
					<SelectContent align="start">
						{modelOptions.map((model) => (
							<SelectItem key={model} value={model}>
								{model}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</ConfigRow>

			<ConfigRow label={labels.grounding}>
				<span className="flex items-center gap-2">
					<Switch
						aria-label={labels.grounding}
						checked={column.grounding}
						onCheckedChange={(grounding) => onChange({ grounding })}
					/>
					<HoverCard>
						<HoverCardTrigger
							aria-label={labels.aboutGrounding}
							className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
						>
							<Icon size={13}>
								<circle cx="12" cy="12" r="9" />
								<path d="M12 8h.01M11 12h1v4h1" />
							</Icon>
						</HoverCardTrigger>
						<HoverCardContent side="top" className="w-56 text-xs leading-relaxed">
							{labels.groundingHelp}
						</HoverCardContent>
					</HoverCard>
				</span>
			</ConfigRow>

			<ConfigRow label={labels.inputs}>
				<Popover>
					<PopoverTrigger
						aria-label={labels.inputs}
						className="flex h-7 max-w-[220px] items-center gap-1.5 rounded-md px-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
					>
						{column.inputs.length ? (
							<span className="flex min-w-0 items-center gap-1">
								{column.inputs.slice(0, 2).map((input) => (
									<span
										key={input}
										className="max-w-[92px] truncate rounded-[5px] bg-primary/10 px-1.5 py-0.5 font-medium text-xs text-primary"
									>
										{input}
									</span>
								))}
								{column.inputs.length > 2 ? (
									<span className="font-medium text-xs text-muted-foreground">
										+{column.inputs.length - 2}
									</span>
								) : null}
							</span>
						) : (
							<span>{labels.selectInputs}</span>
						)}
					</PopoverTrigger>
					<PopoverContent align="start" className="w-56 p-1.5">
						<div className="px-1.5 pt-0.5 pb-1 font-medium text-xs text-muted-foreground">
							{labels.useValuesFrom}
						</div>
						<div className="flex flex-col gap-0.5">
							{inputOptions.map((option) => (
								<Checkbox
									key={option}
									label={option}
									checked={column.inputs.includes(option)}
									onCheckedChange={() =>
										onChange({ inputs: toggleIn(column.inputs, option) })
									}
									className="min-h-8 rounded-md px-1.5 py-1 hover:bg-accent"
								/>
							))}
						</div>
					</PopoverContent>
				</Popover>
			</ConfigRow>

			{column.prompt ? (
				<div className="mt-2 min-h-[64px] rounded-lg border border-border bg-muted p-3 text-sm leading-relaxed">
					<span className="text-foreground">
						{column.prompt.before}
						{column.prompt.chip ? (
							<span className="rounded-[5px] bg-primary/10 px-1.5 py-0.5 font-medium text-xs text-primary">
								{column.prompt.chip}
							</span>
						) : null}
						{column.prompt.after}
					</span>
				</div>
			) : null}

			<Button
				variant="secondary"
				size="sm"
				disabled={calculating}
				onClick={onCalculate}
				className="mt-2.5 w-full"
			>
				<Icon size={14}>
					<path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" />
				</Icon>
				{labels.calculate}
			</Button>

			<div className="mt-3 flex flex-col gap-0.5 border-border border-t pt-2">
				<button
					type="button"
					aria-pressed={pinned}
					onClick={onTogglePin}
					className={ACTION_ROW}
				>
					<span className={pinned ? "text-primary" : "text-muted-foreground"}>
						<Icon size={15}>
							<path d="M12 17v5M8 3h8l-1 7 3 3H6l3-3-1-7z" />
						</Icon>
					</span>
					{pinned ? labels.unpin : labels.pin}
				</button>
				<button
					type="button"
					aria-expanded={moreOpen}
					onClick={() => setMoreOpen((open) => !open)}
					className={ACTION_ROW}
				>
					<span className="text-muted-foreground">
						<Icon size={15}>
							<circle cx="12" cy="12" r="3" />
							<path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
						</Icon>
					</span>
					<span className="flex-1">{labels.moreSettings}</span>
					<span
						className={cn(
							"text-muted-foreground transition-transform duration-(--duration-fast) motion-reduce:transition-none",
							moreOpen && "rotate-90",
						)}
					>
						<Icon size={12}>
							<path d="M9 6l6 6-6 6" />
						</Icon>
					</span>
				</button>
				{onHide ? (
					<button type="button" onClick={onHide} className={ACTION_ROW}>
						<span className="text-muted-foreground">
							<Icon size={15}>
								<path d="M10.6 5.1A9.8 9.8 0 0 1 12 5c7 0 10 7 10 7a16.3 16.3 0 0 1-2.1 3M6.6 6.6A16 16 0 0 0 2 12s3 7 10 7a9.7 9.7 0 0 0 5.4-1.6M3 3l18 18" />
								<path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
							</Icon>
						</span>
						{labels.hide}
					</button>
				) : null}
			</div>

			<div
				data-slot="records-table-more-settings"
				data-open={moreOpen || undefined}
				inert={!moreOpen}
				className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] data-[open]:grid-rows-[1fr] motion-reduce:transition-none"
			>
				<div className="min-h-0 overflow-hidden">
					<div className="mt-2 border-border border-t pt-2">
						<div className="pb-1 font-medium text-xs text-muted-foreground">
							{labels.behavior}
						</div>
						{behaviour.map((key) => (
							<ConfigRow key={key} label={labels[key]}>
								<Switch
									aria-label={labels[key]}
									checked={column[key]}
									onCheckedChange={(on) => onChange({ [key]: on })}
								/>
							</ConfigRow>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
