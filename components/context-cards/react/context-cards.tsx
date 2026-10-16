"use client";

import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import { cn } from "../../lib/react/cn";
import { type ContextChunkTone, contextChunkBadge } from "./variants";

export type { ContextChunkTone };

export type ContextChunk = {
	title: string;
	chars: string;
	body: string;
	source: string;
	badge: string;
	tone: ContextChunkTone;
};

export interface ContextCardsProps extends Omit<ComponentProps<"div">, "children"> {
	chunks: ContextChunk[];
	header?: string;
	count?: string | number;
}

/** Retrieved chunks enter once, then remain available; the source chip fades in
 * shortly after so it reads as a follow-up confirmation, not part of the initial reveal. */
export function ContextCards({
	className,
	chunks,
	header = "All chunks",
	count = chunks.length,
	...props
}: ContextCardsProps) {
	const [chipsShown, setChipsShown] = useState(false);

	useEffect(() => {
		const id = setTimeout(() => setChipsShown(true), 700);
		return () => clearTimeout(id);
	}, []);

	return (
		<div
			data-slot="context-cards"
			className={cn("flex w-full max-w-sm flex-col gap-2", className)}
			{...props}
		>
			<div className="fade-in flex items-center gap-2 px-0.5">
				<span className="text-sm font-semibold text-foreground">{header}</span>
				<span className="inline-flex h-5 items-center rounded-md bg-muted px-1.5 text-xs font-medium text-muted-foreground shadow-xs tabular-nums">
					{count}
				</span>
			</div>

			{chunks.map((chunk, i) => (
				<div
					key={chunk.title}
					data-slot="context-card"
					className="card-fade-up overflow-hidden rounded-2xl bg-card shadow-sm"
					style={{ animationDelay: `calc(var(--stagger-step) * ${i})` }}
				>
					<div className="flex items-center gap-2.5 border-border border-b px-3 py-2">
						<span className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground">
							<svg
								width="11"
								height="11"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								aria-hidden
							>
								<path d="M4 6h16M4 12h16M4 18h10" />
							</svg>
							<span className="truncate">{chunk.title}</span>
						</span>
						<span className="ml-auto shrink-0 text-xs text-muted-foreground tabular-nums">
							{chunk.chars}
						</span>
					</div>
					<p className="px-3 pt-2 pb-1 text-xs text-muted-foreground leading-relaxed">
						{chunk.body}
					</p>
					<div className="px-3 pb-3">
						<span
							className="inline-flex h-6 items-center gap-1.5 rounded-full bg-muted px-2 text-xs text-muted-foreground transition-[opacity,transform,background-color] duration-(--duration-slow) ease-[var(--ease-ui-out)] hover:bg-accent"
							style={{
								opacity: chipsShown ? 1 : 0,
								transform: chipsShown ? "scale(1)" : "scale(0.95)",
								transitionDelay: `${i * 80}ms`,
							}}
						>
							<span className={contextChunkBadge({ tone: chunk.tone })}>
								{chunk.badge}
							</span>
							{chunk.source}
							<svg
								width="9"
								height="9"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden
							>
								<path d="M7 17L17 7M7 7h10v10" />
							</svg>
						</span>
					</div>
				</div>
			))}
		</div>
	);
}
