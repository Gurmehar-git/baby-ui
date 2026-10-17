"use client";

import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";

export type LoadingStateVariant = "drive" | "dots" | "orbit" | "surfer";

const CHEVRON = Array.from({ length: 9 }, (_, i) => {
	const row = Math.floor(i / 3);
	const col = i % 3;
	return (col + Math.abs(row - 1)) * 90;
});

const ORBIT_ORDER = [0, 1, 2, 5, 8, 7, 6, 3];
const ORBIT = Array.from({ length: 9 }, (_, i) => {
	const step = ORBIT_ORDER.indexOf(i);
	return step === -1 ? null : step * 110;
});

type Pattern = { delays: (number | null)[]; duration: number; round: boolean };

const PATTERNS: Record<Exclude<LoadingStateVariant, "surfer">, Pattern> = {
	drive: { delays: CHEVRON, duration: 650, round: false },
	dots: { delays: CHEVRON, duration: 650, round: true },
	orbit: { delays: ORBIT, duration: 950, round: false },
};

function LoaderGrid({ delays, duration, round }: Pattern) {
	return (
		<span aria-hidden className="grid shrink-0 grid-cols-[repeat(3,4px)] gap-[1.5px]">
			{delays.map((delay, index) => (
				<span
					// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
					key={index}
					className={cn(
						"size-[4px] bg-foreground",
						round ? "rounded-full" : "rounded-[1px]",
						delay !== null && "pixel-cell",
					)}
					style={{
						opacity: delay === null ? 0.07 : 0.15,
						animationDuration: delay === null ? undefined : `${duration}ms`,
						animationDelay: delay === null ? undefined : `${delay}ms`,
					}}
				/>
			))}
		</span>
	);
}

function useElapsed() {
	const [deciseconds, setDeciseconds] = useState(0);
	useEffect(() => {
		const id = setInterval(() => setDeciseconds((d) => d + 1), 100);
		return () => clearInterval(id);
	}, []);
	const total = deciseconds / 10;
	if (total < 60) return `${total.toFixed(1)}s`;
	return `${Math.floor(total / 60)}m ${(total % 60).toFixed(1)}s`;
}

export interface LoadingStateProps {
	label?: string;
	variant?: LoadingStateVariant;
	/** Surfer variant only; falls back to a "Video unavailable" placeholder without one. */
	videoSrc?: string;
}

/** Pixel-grid loader paired with a shimmering label and a live elapsed timer. Reduced
 * motion freezes the grid to its dim state; the timer still ticks. */
export function LoadingState({ label, variant = "drive", videoSrc }: LoadingStateProps) {
	const elapsed = useElapsed();
	const surfer = variant === "surfer";
	const resolvedLabel = label ?? (surfer ? "Subway surfing" : "Churning");
	const [videoOk, setVideoOk] = useState(true);
	const pattern = PATTERNS[surfer ? "drive" : variant];

	const labelEl = (
		<span className="reasoning-shimmer font-medium text-sm">{resolvedLabel}</span>
	);
	const elapsedEl = (
		<span className="font-mono text-xs text-muted-foreground tabular-nums">
			{elapsed}
		</span>
	);

	if (surfer) {
		return (
			<div role="status" className="flex w-fit flex-col items-start">
				<div className="flex items-center gap-2.5">
					<LoaderGrid {...PATTERNS.drive} />
					{labelEl}
					{elapsedEl}
				</div>
				<div
					className="pop-in mt-2 w-56 overflow-hidden rounded-[10px] shadow-2xl"
					style={{ transformOrigin: "top left" }}
				>
					<div className="relative aspect-video w-full bg-muted">
						{videoOk && videoSrc ? (
							<video
								src={videoSrc}
								autoPlay
								muted
								loop
								playsInline
								onError={() => setVideoOk(false)}
								className="h-full w-full object-cover"
							/>
						) : (
							<div className="flex h-full w-full flex-col items-center justify-center gap-1.5">
								<LoaderGrid {...PATTERNS.drive} />
								<span className="px-3 text-center font-mono text-xs text-muted-foreground">
									Video unavailable
								</span>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div role="status" className="flex w-fit items-center gap-2.5">
			<LoaderGrid {...pattern} />
			{labelEl}
			{elapsedEl}
		</div>
	);
}
