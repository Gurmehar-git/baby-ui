"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Card } from "../card/card";
import { cn } from "../lib/cn";
import { bindScrollProgress, scrollToProgress } from "../lib/scroll-frame";
import { activeFlipCard, type CaseStudyFlipItem, flipCardOffsets } from "./types";
import {
	type CaseStudyFlipStackSize,
	type CaseStudyFlipStackTone,
	caseStudyFlipStack,
} from "./variants";

export type { CaseStudyFlipItem, CaseStudyFlipStackSize, CaseStudyFlipStackTone };

export interface CaseStudyFlipStackProps {
	items: CaseStudyFlipItem[];
	/** The card facing the reader; setting it scrolls there. */
	index?: number;
	defaultIndex?: number;
	onIndexChange?: (index: number) => void;
	/** Shown between two bobbing arrows above the stack. */
	hint?: string;
	heading?: string;
	/** Closes the scroll once every card has flipped away. */
	endLabel?: string;
	/** Accessible name of the scroll region. */
	label?: string;
	tone?: CaseStudyFlipStackTone;
	size?: CaseStudyFlipStackSize;
	className?: string;
}

function ArrowDown({ className }: { className: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			className={className}
		>
			<path d="M12 5l0 14" />
			<path d="M18 13l-6 6" />
			<path d="M6 13l6 6" />
		</svg>
	);
}

export function CaseStudyFlipStack({
	items,
	index: indexProp,
	defaultIndex = 0,
	onIndexChange,
	hint = "Scroll down",
	heading,
	endLabel,
	label = "Case studies",
	tone = "card",
	size = "default",
	className,
}: CaseStudyFlipStackProps) {
	const rootRef = useRef<HTMLElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const [internal, setInternal] = useState(defaultIndex);
	const active = indexProp ?? internal;
	const emitted = useRef(0);
	const mounted = useRef(false);
	const onChange = useRef(onIndexChange);
	onChange.current = onIndexChange;
	const total = items.length;
	const s = caseStudyFlipStack({ size, tone });

	useEffect(() => {
		const root = rootRef.current;
		const track = trackRef.current;
		if (!root || !track || !total) return;
		return bindScrollProgress(root, track, (progress) => {
			const next = activeFlipCard(progress, total);
			if (next === emitted.current) return;
			emitted.current = next;
			setInternal(next);
			onChange.current?.(next);
		});
	}, [total]);

	useEffect(() => {
		const root = rootRef.current;
		const track = trackRef.current;
		const first = !mounted.current;
		mounted.current = true;
		if (!root || !track || !total || active === emitted.current) return;
		emitted.current = active;
		const still = first || matchMedia("(prefers-reduced-motion: reduce)").matches;
		scrollToProgress(root, track, active / total, still ? "auto" : "smooth");
	}, [active, total]);

	return (
		<section
			ref={rootRef}
			data-slot="case-study-flip-stack"
			aria-label={label}
			// biome-ignore lint/a11y/noNoninteractiveTabindex: the scroll box needs focus for keyboard scrolling.
			tabIndex={0}
			className={cn(s.root(), className)}
		>
			<div className={s.intro()}>
				{hint && (
					<p className={s.hint()}>
						<ArrowDown className={s.arrow()} />
						<span>{hint}</span>
						<ArrowDown className={cn(s.arrow(), "[animation-delay:180ms]")} />
					</p>
				)}
				{heading && <h2 className={s.heading()}>{heading}</h2>}
			</div>
			<div
				ref={trackRef}
				className={s.track()}
				style={{ height: `calc(${total + 1} * 100cqh)` }}
			>
				<div className={s.stage()}>
					<div className={s.deck()}>
						{items.map((item, i) => {
							const { stack, restY, restS } = flipCardOffsets(i, total);
							return (
								<article
									// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
									key={`${i}-${item.title}`}
									data-active={i === active || undefined}
									className={s.article()}
									style={
										{
											"--i": i,
											"--n": total,
											"--stack": stack,
											"--rest-y": restY,
											"--rest-s": restS,
											"--tint": `var(--chart-${(i % 5) + 1})`,
											zIndex: total - i,
										} as CSSProperties
									}
								>
									<Card className={s.card()}>
										<div className={s.copy()}>
											<span className={s.number()}>
												{item.number ?? String(i + 1).padStart(2, "0")}
											</span>
											<div className="mt-auto pt-6">
												<p className={s.eyebrow()}>{item.eyebrow}</p>
												<h3 className={s.title()}>{item.title}</h3>
												<p className={s.description()}>{item.description}</p>
											</div>
										</div>
										<div className={s.media()}>
											<img
												src={item.image}
												alt={item.imageAlt}
												className={s.image()}
												loading={i < 2 ? "eager" : "lazy"}
												draggable={false}
											/>
										</div>
									</Card>
								</article>
							);
						})}
					</div>
				</div>
			</div>
			{endLabel && <p className={s.end()}>{endLabel}</p>}
		</section>
	);
}
