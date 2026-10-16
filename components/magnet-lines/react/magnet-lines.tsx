"use client";

import { type CSSProperties, useEffect, useRef } from "react";
import { cn } from "../../lib/react/cn";
import { type MagnetLinesOptions, mountMagnetLines } from "./magnet";
import { type MagnetLinesSize, type MagnetLinesTone, magnetLines } from "./variants";

export type { MagnetLinesSize, MagnetLinesTone };

export interface MagnetLinesProps {
	rows?: number;
	columns?: number;
	size?: MagnetLinesSize;
	tone?: MagnetLinesTone;
	/** Degrees added to every line's pointer angle; also the resting angle. */
	baseAngle?: number;
	className?: string;
}

/** A grid of short lines that turn to face the pointer. */
export function MagnetLines({
	rows = 9,
	columns = 9,
	size = "default",
	tone = "muted",
	baseAngle = 0,
	className,
}: MagnetLinesProps) {
	const root = useRef<HTMLDivElement>(null);
	const engine = useRef<ReturnType<typeof mountMagnetLines>>(null);
	const s = magnetLines({ size, tone });
	const r = Math.max(1, Math.floor(rows));
	const c = Math.max(1, Math.floor(columns));
	const options: MagnetLinesOptions = { baseAngle };
	const latest = useRef(options);
	latest.current = options;

	useEffect(() => {
		if (!root.current) return;
		const mounted = mountMagnetLines(root.current, latest.current);
		engine.current = mounted;
		return () => {
			mounted.destroy();
			engine.current = null;
		};
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: baseAngle, r, c and more.
	useEffect(() => {
		engine.current?.update(latest.current);
	}, [baseAngle, r, c, size]);

	return (
		<div
			ref={root}
			aria-hidden
			data-slot="magnet-lines"
			className={cn(s.root(), className)}
			style={
				{
					gridTemplateColumns: `repeat(${c}, minmax(0, 1fr))`,
					gridTemplateRows: `repeat(${r}, minmax(0, 1fr))`,
					"--ml-base": `${baseAngle}deg`,
				} as CSSProperties
			}
		>
			{Array.from({ length: r * c }, (_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: generated from a count, so position is the identity.
				<span key={i} data-slot="magnet-lines-line" className={s.line()} />
			))}
		</div>
	);
}
