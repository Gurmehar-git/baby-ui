"use client";

import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	paginationRange,
	ScrollArea,
	Shortcut,
	ShowMore,
	ShowMoreContent,
	ShowMoreTrigger,
	Spinner,
	Toggle,
	ToggleGroup,
	ToggleGroupItem,
	Typography,
} from "@baby-ui/react";
import { type ComponentProps, useEffect, useState } from "react";
import { controlProps } from "../data/preview-props";
import { ALIGNMENTS, TEXT_MARKS, TOGGLE_BOOKMARK } from "../data/toggle";

type Props = Record<string, unknown>;

const LOREM =
	"Components here are copied into your project rather than installed, which means you own the source and can change anything. The registry only decides what the first version looks like. Every port satisfies the same ComponentSpec, so the React and Svelte builds behave identically even though neither is generated from the other.";

export function SpinnerDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Spinner>>(props);
	const label = p.label || "Checking availability";
	return (
		<div className="flex w-64 flex-col items-center gap-4">
			<div className="flex items-center gap-2.5 text-muted-foreground">
				<Spinner size={p.size ?? "default"} label={label} />
				<span className="text-sm">{label}</span>
			</div>
			<Button loading loadingLabel="Reserving…" className="w-full">
				Reserve name
			</Button>
		</div>
	);
}

export function ToggleDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Toggle>>(props);
	const [pressed, setPressed] = useState(false);
	useEffect(() => setPressed(Boolean(props.pressed)), [props.pressed]);

	return (
		<Toggle
			pressed={pressed}
			onPressedChange={setPressed}
			variant={p.variant ?? "default"}
			size={p.size ?? "default"}
			disabled={p.disabled ?? false}
		>
			{/* The outline fills once pressed, so the state reads from the glyph as well as the fill. */}
			<svg
				viewBox="0 0 16 16"
				fill="none"
				aria-hidden
				className="size-4 fill-transparent transition-[fill] duration-(--duration-fast) in-aria-pressed:fill-current"
			>
				<path
					d={TOGGLE_BOOKMARK.path}
					stroke="currentColor"
					strokeWidth="1.4"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
			{TOGGLE_BOOKMARK.label}
		</Toggle>
	);
}

export function ToggleGroupDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ToggleGroup>>(props);
	const type = p.type ?? "single";
	// One choice suits alignment; formatting marks combine.
	const multiple = type === "multiple";
	const glyphs = multiple ? TEXT_MARKS : ALIGNMENTS;
	const [value, setValue] = useState<string | string[]>(multiple ? ["bold"] : "left");
	useEffect(() => setValue(multiple ? ["bold"] : "left"), [multiple]);
	return (
		<ToggleGroup
			value={value}
			onValueChange={setValue}
			type={type}
			variant={p.variant ?? "default"}
			size={p.size ?? "default"}
			disabled={p.disabled ?? false}
			label={multiple ? "Text formatting" : "Text alignment"}
		>
			{glyphs.map((glyph) => (
				<ToggleGroupItem
					key={glyph.value}
					value={glyph.value}
					aria-label={glyph.label}
					className="aspect-square px-0"
				>
					<svg viewBox="0 0 16 16" fill="none" aria-hidden>
						<path
							d={glyph.path}
							stroke="currentColor"
							strokeWidth="1.4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
}

export function CollapsibleDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Collapsible>>(props);
	return (
		<div className="w-full max-w-80">
			<Collapsible defaultOpen={p.open ?? false}>
				<CollapsibleTrigger>Advanced options</CollapsibleTrigger>
				<CollapsibleContent>
					Build command, install command and the output directory. Changing these rebuilds
					every preview deployment.
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}

export function ShowMoreDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ShowMore>>(props);
	const trigger = controlProps<ComponentProps<typeof ShowMoreTrigger>>(props);
	return (
		<div className="w-full max-w-80">
			<ShowMore lines={Number(p.lines ?? 3)} maxHeight={Number(p.maxHeight ?? 320)}>
				<ShowMoreContent>
					<p>{LOREM}</p>
				</ShowMoreContent>
				<ShowMoreTrigger
					moreLabel={trigger.moreLabel || "Show more"}
					lessLabel={trigger.lessLabel || "Show less"}
				/>
			</ShowMore>
		</div>
	);
}

const ROWS: [string, string][] = [
	["Search", "cmd+k"],
	["Toggle sidebar", "cmd+b"],
	["Settings", "cmd+,"],
];

export function ShortcutDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Shortcut>>(props);
	const variant = p.variant ?? "default";
	const size = p.size ?? "default";
	const [log, setLog] = useState<string[]>([]);
	const note = (action: string) => setLog((prev) => [action, ...prev].slice(0, 3));
	return (
		<div className="flex w-full max-w-80 flex-col gap-3 text-sm">
			<div className="flex items-center gap-2">
				<Button variant="outline" size="sm" onClick={() => note("New file")}>
					New file
					<Shortcut
						shortcut={p.shortcut || "cmd+n"}
						variant={variant}
						size={size}
						joined={p.joined ?? false}
					/>
				</Button>
				<Button size="sm" onClick={() => note("Sent")}>
					Send
					<Shortcut shortcut="cmd+enter" />
				</Button>
			</div>
			<div className="divide-y divide-border rounded-xl border border-border">
				{ROWS.map(([label, keys]) => (
					<button
						key={keys}
						type="button"
						onClick={() => note(label)}
						className="flex w-full items-center justify-between px-3 py-2 text-left text-foreground transition-colors hover:bg-foreground/[0.04]"
					>
						{label}
						<Shortcut shortcut={keys} variant="ghost" />
					</button>
				))}
			</div>
			<p className="min-h-4 text-muted-foreground text-xs">
				{log.length ? `Fired: ${log.join(", ")}` : "Press a shortcut or click a row"}
			</p>
		</div>
	);
}

export function TypographyDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Typography>>(props);
	return (
		<div className="flex w-full max-w-80 flex-col gap-3">
			<Typography variant="h2">Release 0.4</Typography>
			<Typography variant="muted">Shipped 20 September 2026</Typography>
			<Typography variant={p.variant ?? "body"}>
				Overlays now animate out as well as in, and every anchored surface grows from the
				edge nearest its trigger.
			</Typography>
		</div>
	);
}

export function PaginationDemo({ props }: { props: Props }) {
	const [page, setPage] = useState(4);
	useEffect(() => setPage(Number(props.page ?? 4)), [props.page]);
	const total = Number(props.total ?? 12);
	const entries = paginationRange(page, total, Number(props.siblings ?? 1));
	const size =
		controlProps<ComponentProps<typeof PaginationLink>>(props).size ?? "default";
	return (
		<Pagination>
			<PaginationPrevious
				size={size}
				disabled={page <= 1}
				onClick={() => setPage((p) => Math.max(1, p - 1))}
			/>
			<PaginationContent>
				{entries.map((entry, i) => (
					<PaginationItem key={typeof entry === "number" ? entry : `gap-${i}`}>
						{entry === "gap" ? (
							<PaginationEllipsis />
						) : (
							<PaginationLink
								size={size}
								active={entry === page}
								onClick={() => setPage(entry)}
							>
								{entry}
							</PaginationLink>
						)}
					</PaginationItem>
				))}
			</PaginationContent>
			<PaginationNext
				size={size}
				disabled={page >= total}
				onClick={() => setPage((p) => Math.min(total, p + 1))}
			/>
		</Pagination>
	);
}

const REGIONS = [
	"Amsterdam",
	"Bengaluru",
	"Cape Town",
	"Dublin",
	"Frankfurt",
	"Hong Kong",
	"Johannesburg",
	"London",
	"Mumbai",
	"Paris",
	"São Paulo",
	"Singapore",
	"Sydney",
	"Tokyo",
	"Toronto",
	"Washington DC",
];

export function ScrollAreaDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ScrollArea>>(props);
	return (
		<div className="w-64 rounded-xl border border-border bg-card p-1">
			<ScrollArea maxHeight={p.maxHeight || "12rem"}>
				<ul className="flex flex-col">
					{REGIONS.map((region) => (
						<li
							key={region}
							className="rounded-lg px-3 py-2 text-foreground text-sm hover:bg-foreground/[0.04]"
						>
							{region}
						</li>
					))}
				</ul>
			</ScrollArea>
		</div>
	);
}
