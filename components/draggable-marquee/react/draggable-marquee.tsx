"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { createMarquee } from "../marquee";
import {
	type DraggableMarqueeDirection,
	type DraggableMarqueeGap,
	draggableMarquee,
} from "../variants";

export type { DraggableMarqueeDirection, DraggableMarqueeGap };

export interface DraggableMarqueeProps {
	/** One set of items; it repeats as often as the width needs. */
	children: ReactNode;
	/** Drift in px per frame; 0 holds still until dragged. */
	speed?: number;
	direction?: DraggableMarqueeDirection;
	gap?: DraggableMarqueeGap;
	pauseOnHover?: boolean;
	/** Share of a throw's velocity kept each frame, 0 to 1. */
	friction?: number;
	/** Accessible name of the region. */
	label?: string;
	className?: string;
}

export function DraggableMarquee({
	children,
	speed = 1,
	direction = "left",
	gap = "md",
	pauseOnHover = false,
	friction = 0.975,
	label = "Scrolling gallery. Drag, or use the left and right arrow keys.",
	className,
}: DraggableMarqueeProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const marqueeRef = useRef<ReturnType<typeof createMarquee>>(null);
	const [copies, setCopies] = useState(2);
	const s = draggableMarquee({ gap, direction });
	const options = { speed, direction, pauseOnHover, friction, onCopies: setCopies };

	// biome-ignore lint/correctness/useExhaustiveDependencies: options left out on purpose, the listed values decide when it runs.
	useEffect(() => {
		if (!rootRef.current || !trackRef.current) return;
		const marquee = createMarquee(rootRef.current, trackRef.current, options);
		marqueeRef.current = marquee;
		return () => marquee.destroy();
		// Options flow through update(); recreating would reset the track's position.
	}, []);

	useEffect(() => {
		marqueeRef.current?.update(options);
	});

	return (
		<section
			ref={rootRef}
			data-slot="draggable-marquee"
			aria-label={label}
			aria-roledescription="marquee"
			// biome-ignore lint/a11y/noNoninteractiveTabindex: focus is how arrow keys reach the track
			tabIndex={0}
			className={cn(s.root(), className)}
		>
			<div ref={trackRef} className={s.track()}>
				{Array.from({ length: copies }, (_, copy) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: generated from a count, so position is the identity.
						key={copy}
						aria-hidden={copy > 0 || undefined}
						inert={copy > 0}
						className={s.copy()}
					>
						{children}
					</div>
				))}
			</div>
		</section>
	);
}
