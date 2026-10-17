"use client";

import { type CSSProperties, useEffect, useRef } from "react";
import { Card, CardDescription, CardTitle } from "../../card/react/card";
import { cn } from "../../lib/cn";
import { bindScrollProgress } from "../../lib/scroll-frame";
import { type ScrollSplitCardItem, SPLIT_POSITIONS } from "../types";
import {
	type ScrollSplitCardSize,
	type ScrollSplitCardTone,
	scrollSplitCard,
} from "../variants";

export type { ScrollSplitCardItem, ScrollSplitCardSize, ScrollSplitCardTone };

export interface ScrollSplitCardProps {
	/** One image, split into three panels that flip over to reveal `cards`. */
	image: string;
	imageAlt: string;
	/** The first three become the panels' back faces. */
	cards: ScrollSplitCardItem[];
	/** Shown until scrolling starts. */
	hint?: string;
	/** Fades in once the panels have flipped. */
	endLabel?: string;
	/** Accessible name of the scroll region. */
	label?: string;
	tone?: ScrollSplitCardTone;
	size?: ScrollSplitCardSize;
	className?: string;
}

export function ScrollSplitCard({
	image,
	imageAlt,
	cards,
	hint = "Scroll down",
	endLabel,
	label = "Scroll to flip the cards",
	tone = "card",
	size = "default",
	className,
}: ScrollSplitCardProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const s = scrollSplitCard({ size, tone });

	useEffect(() => {
		const root = rootRef.current;
		const track = trackRef.current;
		if (!root || !track) return;
		return bindScrollProgress(root, track);
	}, []);

	return (
		<section
			ref={rootRef}
			data-slot="scroll-split-card"
			aria-label={label}
			// biome-ignore lint/a11y/noNoninteractiveTabindex: the scroll box needs focus for keyboard scrolling.
			tabIndex={0}
			className={cn(s.root(), className)}
		>
			<div ref={trackRef} className={s.track()}>
				<div className={s.stage()}>
					{hint && <p className={s.hint()}>{hint}</p>}
					<div className={s.row()}>
						{cards.slice(0, 3).map((card, i) => {
							const position = SPLIT_POSITIONS[i] ?? "middle";
							const v = scrollSplitCard({ size, tone, position });
							return (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
									key={`${i}-${card.title}`}
									className={s.piece()}
									style={
										{
											"--i": i,
											"--side": i - 1,
											"--tint": `var(--chart-${i + 1})`,
											zIndex: i,
										} as CSSProperties
									}
								>
									<div className={v.front()}>
										<img
											src={image}
											alt={i === 0 ? imageAlt : ""}
											aria-hidden={i === 0 ? undefined : true}
											className={s.image()}
											draggable={false}
										/>
									</div>
									<Card className={s.back()}>
										<CardTitle className={s.title()}>{card.title}</CardTitle>
										<CardDescription className={s.description()}>
											{card.description}
										</CardDescription>
									</Card>
								</div>
							);
						})}
					</div>
					{endLabel && <p className={s.end()}>{endLabel}</p>}
				</div>
			</div>
		</section>
	);
}
