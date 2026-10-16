"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../../hover-card/react/hover-card";
import { cn } from "../../lib/react/cn";
import { type ToolChipsSize, toolChips } from "./variants";

export type { ToolChipsSize };

export type ToolDetailLine = { text: string; tone?: "add" };

export type ToolStep = {
	icon?: ReactNode;
	label: string;
	chip: string;
	mono?: boolean;
	detailMono?: boolean;
	detail: ToolDetailLine[];
};

export type ToolDiffLine = { text: string; tone: "add" | "del" | "ctx" };

export type ToolDiff = {
	file: string;
	add: number;
	del: number;
	lines?: ToolDiffLine[];
};

export type ToolChipsLabels = {
	header?: string;
};

function DotIcon() {
	return <span aria-hidden className="size-1.5 rounded-full bg-current" />;
}

export interface ToolChipsProps {
	/** Every tool-call row, already known: the reveal is a mount-time stagger, not live progress. */
	steps: ToolStep[];
	/** File-diff chips shown below the steps; omit or pass `[]` to hide the row entirely. */
	diffs?: ToolDiff[];
	/** Count folded behind a "+N more" chip after the visible diffs; omit to hide it. */
	hiddenDiffCount?: number;
	labels?: ToolChipsLabels;
	size?: ToolChipsSize;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	onToggleRow?: (label: string, open: boolean) => void;
	className?: string;
}

/** An agent run as compact rows: tool calls with inline chips, then file-diff chips.
 * Hover a diff chip for its preview; every row expands to show what the tool did. */
export function ToolChips({
	steps,
	diffs = [],
	hiddenDiffCount = 0,
	labels,
	size = "default",
	open,
	defaultOpen = true,
	onOpenChange,
	onToggleRow,
	className,
}: ToolChipsProps) {
	const [internalOpen, setInternalOpen] = useState(defaultOpen);
	const [openRows, setOpenRows] = useState<Set<string>>(new Set());
	const isOpen = open ?? internalOpen;
	const { root } = toolChips({ size });
	const header =
		labels?.header ?? `${steps.length} tool call${steps.length === 1 ? "" : "s"}`;

	function setOpen(next: boolean) {
		if (open === undefined) setInternalOpen(next);
		onOpenChange?.(next);
	}

	function toggleRow(label: string) {
		setOpenRows((current) => {
			const next = new Set(current);
			if (next.has(label)) next.delete(label);
			else next.add(label);
			onToggleRow?.(label, next.has(label));
			return next;
		});
	}

	return (
		<div data-slot="tool-chips" className={cn(root(), className)}>
			<button
				type="button"
				aria-expanded={isOpen}
				onClick={() => setOpen(!isOpen)}
				className="-mx-1.5 flex w-fit items-center gap-1.5 rounded-md px-1.5 py-1 text-xs text-muted-foreground transition-colors duration-(--duration-instant) hover:bg-accent"
			>
				<svg
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden
					className="transition-transform duration-(--duration-base)"
					style={{ transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)" }}
				>
					<path d="M6 9l6 6 6-6" />
				</svg>
				<span className="tabular-nums">{header}</span>
			</button>

			<div
				className="grid transition-[grid-template-rows,opacity] duration-(--duration-slow)"
				style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
			>
				<div className="-mx-1 overflow-hidden px-1.5 pb-1">
					<div className="mt-1.5 flex flex-col gap-1">
						{steps.map((row, index) => {
							const rowOpen = openRows.has(row.label);
							return (
								<div
									key={row.label}
									className="card-fade-up"
									style={{ animationDelay: `calc(var(--stagger-step) * ${index})` }}
								>
									<button
										type="button"
										aria-expanded={rowOpen}
										onClick={() => toggleRow(row.label)}
										className="group/row -mx-[3px] flex h-7 w-[calc(100%+6px)] min-w-0 items-center gap-2 rounded-md px-[3px] text-left transition-colors duration-(--duration-instant) hover:bg-accent"
									>
										<span className="relative flex size-4 shrink-0 items-center justify-center text-muted-foreground">
											<span
												aria-hidden
												className={cn(
													"transition-opacity duration-(--duration-instant) group-hover/row:opacity-0",
													rowOpen && "opacity-0",
												)}
											>
												{row.icon ?? <DotIcon />}
											</span>
											<svg
												width="12"
												height="12"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2.2"
												strokeLinecap="round"
												strokeLinejoin="round"
												aria-hidden
												className={cn(
													"absolute transition-[opacity,transform] duration-(--duration-fast) group-hover/row:opacity-100",
													rowOpen ? "opacity-100" : "opacity-0",
												)}
												style={{ transform: rowOpen ? "rotate(0deg)" : "rotate(-90deg)" }}
											>
												<path d="M6 9l6 6 6-6" />
											</svg>
										</span>
										<span className="shrink-0 font-medium text-xs text-foreground">
											{row.label}
										</span>
										<span
											className={cn(
												"h-5.5 min-w-0 flex-1 cursor-pointer truncate rounded-full bg-muted px-1.5 text-xs text-muted-foreground shadow-xs transition-colors duration-(--duration-instant) hover:bg-accent",
												"inline-flex items-center",
												row.mono && "font-mono",
											)}
										>
											{row.chip}
										</span>
									</button>

									<div
										className="grid transition-[grid-template-rows,opacity] duration-(--duration-slow) ease-[var(--ease-ui-out)]"
										style={{
											gridTemplateRows: rowOpen ? "1fr" : "0fr",
											opacity: rowOpen ? 1 : 0,
										}}
									>
										<div className="min-h-0 overflow-hidden">
											<div className="mt-0.5 mb-1 ml-2 flex flex-col gap-0.5 border-border border-l py-0.5 pl-3.5">
												{row.detail.map((line) => (
													<span
														key={line.text}
														className={cn(
															"truncate text-xs leading-[1.6]",
															row.detailMono && "font-mono",
															line.tone === "add"
																? "text-success-strong"
																: "text-muted-foreground",
														)}
													>
														{line.text}
													</span>
												))}
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>

					{diffs.length > 0 ? (
						<div className="mt-2.5 flex max-w-full flex-wrap gap-1.5 border-border border-t pt-2.5">
							{diffs.map((diff, index) => (
								<HoverCard key={diff.file}>
									<HoverCardTrigger
										aria-label={`Show diff for ${diff.file}`}
										className="card-fade-up inline-flex h-7 max-w-full items-center gap-2 rounded-full bg-card px-2 font-mono text-xs text-foreground shadow-sm transition-colors duration-(--duration-instant) hover:bg-accent"
										style={{
											animationDelay: `calc(var(--stagger-step) * ${steps.length + index})`,
										}}
									>
										<span className="min-w-0 truncate">{diff.file}</span>
										<span className="shrink-0 text-success-strong tabular-nums">
											+{diff.add}
										</span>
										{diff.del > 0 ? (
											<span className="shrink-0 text-destructive-strong tabular-nums">
												−{diff.del}
											</span>
										) : null}
									</HoverCardTrigger>
									{diff.lines?.length ? (
										<HoverCardContent
											align="start"
											className="w-72 overflow-hidden rounded-[10px] border-none p-0 shadow-2xl"
										>
											<div className="flex items-center justify-between border-border border-b px-2.5 py-1.5 font-mono text-xs">
												<span className="min-w-0 truncate text-muted-foreground">
													{diff.file}
												</span>
												<span className="shrink-0 tabular-nums">
													<span className="text-success-strong">+{diff.add}</span>
													{diff.del > 0 ? (
														<span className="text-destructive-strong"> −{diff.del}</span>
													) : null}
												</span>
											</div>
											<div className="py-1 font-mono text-xs leading-[1.8]">
												{diff.lines.map((line, lineIndex) => (
													<div
														// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
														key={`${lineIndex}-${line.text}`}
														className={cn(
															"flex gap-2 whitespace-pre px-2.5",
															line.tone === "add"
																? "bg-success/10 text-success-strong"
																: line.tone === "del"
																	? "bg-destructive/10 text-destructive-strong"
																	: "text-muted-foreground",
														)}
													>
														<span className="w-3 shrink-0 select-none">
															{line.tone === "add"
																? "+"
																: line.tone === "del"
																	? "−"
																	: " "}
														</span>
														<span className="min-w-0 truncate">{line.text}</span>
													</div>
												))}
											</div>
										</HoverCardContent>
									) : null}
								</HoverCard>
							))}
							{hiddenDiffCount > 0 ? (
								<span className="inline-flex h-7 items-center rounded-full px-1.5 font-mono text-xs text-muted-foreground">
									+{hiddenDiffCount} more
								</span>
							) : null}
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}
