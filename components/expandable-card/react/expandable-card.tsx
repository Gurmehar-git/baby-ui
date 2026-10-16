"use client";

import { type CSSProperties, type ReactNode, useRef, useState } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../../collapsible/react/collapsible";
import { cn } from "../../lib/react/cn";
import {
	type ExpandableCardSize,
	type ExpandableCardVariant,
	expandableCard,
} from "./variants";

export type { ExpandableCardSize, ExpandableCardVariant };

export interface ExpandableCardProps {
	title: string;
	/** A summary under the title; changed words rise in when it updates. */
	description?: string;
	children: ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** Closed width cap in px; never wider than the container. Fills it when omitted. */
	width?: number;
	/** Open width cap in px, so the card can grow sideways. Defaults to `width`. */
	expandedWidth?: number;
	variant?: ExpandableCardVariant;
	size?: ExpandableCardSize;
	className?: string;
}

/**
 * A card that opens in place: width and height grow on one spring, the details fade in once
 * there is room, and Escape closes it back to the header.
 */
export function ExpandableCard({
	title,
	description,
	children,
	open: openProp,
	defaultOpen = false,
	onOpenChange,
	width,
	expandedWidth,
	variant = "default",
	size = "default",
	className,
}: ExpandableCardProps) {
	const [ownOpen, setOwnOpen] = useState(defaultOpen);
	const open = openProp ?? ownOpen;
	const cardRef = useRef<HTMLDivElement>(null);
	const setOpen = (next: boolean) => {
		if (openProp === undefined) setOwnOpen(next);
		onOpenChange?.(next);
	};
	const s = expandableCard({ variant, size });
	// Position plus word: an unchanged word keeps its node, a changed one remounts and rises in.
	const words = (description ?? "")
		.split(/(\s+)/)
		.map((word, index) => ({ word, key: `${index}:${word}` }));
	const closedCap = width ? `${width}px` : "100%";
	const vars = {
		"--ec-w": closedCap,
		"--ec-xw": expandedWidth ? `${expandedWidth}px` : closedCap,
	} as CSSProperties;

	return (
		<div data-slot="expandable-card" className={s.track()} style={vars}>
			<Collapsible
				ref={cardRef}
				open={open}
				onOpenChange={setOpen}
				className={cn(s.card(), className)}
				onKeyDown={(event) => {
					if (event.key !== "Escape" || !open) return;
					event.preventDefault();
					setOpen(false);
					cardRef.current
						?.querySelector<HTMLElement>("[data-slot=collapsible-trigger]")
						?.focus();
				}}
			>
				<CollapsibleTrigger className={s.trigger()}>
					<span className="min-w-0">
						<span className={s.title()}>{title}</span>
						{description && (
							<span className={s.description()}>
								<span className="sr-only">{description}</span>
								<span aria-hidden>
									{words.map((entry) => (
										<span key={entry.key} className={s.word()}>
											{entry.word}
										</span>
									))}
								</span>
							</span>
						)}
					</span>
				</CollapsibleTrigger>
				<CollapsibleContent className={s.panel()}>{children}</CollapsibleContent>
			</Collapsible>
		</div>
	);
}
