"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { createReel } from "../reel";
import { type TextReelOrientation, type TextReelSize, textReel } from "../variants";

export type { TextReelOrientation, TextReelSize };

export interface TextReelProps {
	items: string[];
	/** Small caption above the reel. */
	prefix?: string;
	/** Drift in px per frame while the page is still; scrolling boosts and steers it. */
	speed?: number;
	paused?: boolean;
	orientation?: TextReelOrientation;
	size?: TextReelSize;
	className?: string;
}

export function TextReel({
	items,
	prefix,
	speed = 0.6,
	paused = false,
	orientation = "vertical",
	size = "default",
	className,
}: TextReelProps) {
	const viewportRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const reelRef = useRef<ReturnType<typeof createReel>>(null);
	const [copies, setCopies] = useState(2);
	const s = textReel({ orientation, size });
	const axis = orientation === "horizontal" ? "x" : "y";

	// biome-ignore lint/correctness/useExhaustiveDependencies: items only re-run it on change; paused, speed left out on purpose, the listed values decide when it runs.
	useEffect(() => {
		if (!viewportRef.current || !trackRef.current) return;
		const reel = createReel(viewportRef.current, trackRef.current, {
			speed,
			paused,
			axis,
			onCopies: setCopies,
		});
		reelRef.current = reel;
		return () => reel.destroy();
		// Speed and pause flow through update(); recreating would reset the reel's position.
	}, [items, axis]);

	useEffect(() => {
		reelRef.current?.update({ speed, paused, axis, onCopies: setCopies });
	}, [speed, paused, axis]);

	return (
		<div data-slot="text-reel" className={cn(s.root(), className)}>
			{prefix ? <p className={s.prefix()}>{prefix}</p> : null}
			<div ref={viewportRef} className={s.viewport()}>
				<div ref={trackRef} className={s.track()}>
					{Array.from({ length: copies }, (_, copy) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: generated from a count, so position is the identity.
						<div key={copy} aria-hidden={copy > 0 || undefined} className={s.copy()}>
							{items.map((item, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
								<div key={i} className={s.item()}>
									{item}
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
