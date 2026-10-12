"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";
import { cn } from "../lib/cn";
import type { ImageSlotProps } from "../lib/image";
import {
	cardLayout,
	type StickyScrollCardItem,
	type StickyScrollCardsSize,
	type StickyScrollCardsVariant,
	scrubStack,
	stickyScrollCards,
} from "./variants";

export type { StickyScrollCardItem, StickyScrollCardsSize, StickyScrollCardsVariant };

export interface StickyScrollCardsProps {
	cards: readonly StickyScrollCardItem[];
	/** Hint shown above the stack; empty hides it. */
	hint?: string;
	/** Multiplier on each card's resting tilt; 0 keeps them straight. */
	tilt?: number;
	size?: StickyScrollCardsSize;
	variant?: StickyScrollCardsVariant;
	/** Accessible name of the stack. */
	label?: string;
	/** Renders each image, e.g. through your framework's image component; defaults to `<img>`. */
	image?: (props: ImageSlotProps) => ReactNode;
	className?: string;
}

/** Photo cards that pin as they scroll in and shrink back into a stack as later ones land. */
export function StickyScrollCards({
	cards,
	hint = "Scroll to explore",
	tilt = 1,
	size = "default",
	variant,
	label = "Photo stack",
	image,
	className,
}: StickyScrollCardsProps) {
	const root = useRef<HTMLElement>(null);
	const stack = useRef<HTMLDivElement>(null);
	const s = stickyScrollCards({ size, variant });

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: size.
	useEffect(() => {
		if (!root.current || !stack.current) return;
		return scrubStack(root.current, stack.current);
	}, [size]);

	return (
		<section
			ref={root}
			data-slot="sticky-scroll-cards"
			aria-label={label}
			tabIndex={size === "auto" ? undefined : 0}
			className={cn(s.root(), className)}
		>
			<div ref={stack} className={s.stack()}>
				{hint ? (
					<div className={s.hint()}>
						<p className={s.hintText()}>{hint}</p>
						<span aria-hidden className={s.hintLine()} />
					</div>
				) : null}
				{cards.map((card, i) => {
					const layout = cardLayout(i, cards.length, tilt);
					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
						<div key={`${card.src}-${i}`} className={s.section()}>
							<figure
								className={s.card()}
								style={
									{
										top: `${layout.offset}px`,
										"--sticky-scroll-start": layout.start,
										"--sticky-scroll-rest": layout.rest,
										"--sticky-scroll-rotate": `${layout.rotate}deg`,
									} as CSSProperties
								}
							>
								{image ? (
									image({
										src: card.src,
										alt: card.alt ?? card.title,
										className: s.image(),
										loading: i < 2 ? "eager" : "lazy",
									})
								) : (
									<img
										src={card.src}
										alt={card.alt ?? card.title}
										className={s.image()}
										loading={i < 2 ? "eager" : "lazy"}
										decoding="async"
										draggable={false}
									/>
								)}
								<figcaption className={s.caption()}>{card.title}</figcaption>
							</figure>
						</div>
					);
				})}
			</div>
		</section>
	);
}
