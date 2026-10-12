"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn";
import { type CompareOrientation, createImageCompare } from "./compare";
import {
	type ImageCompareSize,
	type ImageCompareVariant,
	imageCompare,
} from "./variants";

export type { CompareOrientation, ImageCompareSize, ImageCompareVariant };

export interface ImageCompareProps {
	/** The original, left (or top). Pass an image with its own alt; it covers the frame. */
	before: ReactNode;
	/** The result, right (or bottom). */
	after: ReactNode;
	/** Divider position in percent from the left (or top). Pair with `onPositionChange`. */
	position?: number;
	defaultPosition?: number;
	onPositionChange?: (position: number) => void;
	/** `vertical` stacks the images; changing it swings the divider a quarter turn. */
	orientation?: CompareOrientation;
	/** Captions over each side, fading as the divider reaches them; `false` hides them. */
	labels?: [string, string] | false;
	/** Accessible name of the divider. */
	label?: string;
	/** Frame proportions, as a CSS aspect-ratio. */
	aspectRatio?: string;
	/** `default` capsule handle, `line` a small ring on the line, `overlay` larger captions. */
	variant?: ImageCompareVariant;
	size?: ImageCompareSize;
	/** A mouse moves the divider by hovering, without pressing; touch still drags. */
	hover?: boolean;
	className?: string;
}

const clamp = (v: number) => Math.min(100, Math.max(0, v));

function Chevron({ d }: { d: string }) {
	return (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden>
			<path
				d={d}
				stroke="currentColor"
				strokeWidth="1.75"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

/**
 * Before and after, split by a divider. Drag anywhere: the handle follows 1:1, rubber-bands past
 * the edges and stays where released; a tap springs it there; double-click the handle to centre.
 */
export function ImageCompare({
	before,
	after,
	position,
	defaultPosition = 50,
	onPositionChange,
	orientation = "horizontal",
	labels = ["Before", "After"],
	label = "Before and after",
	aspectRatio = "3 / 2",
	variant = "default",
	size = "default",
	hover = false,
	className,
}: ImageCompareProps) {
	const [internal, setInternal] = useState(defaultPosition);
	const current = clamp(position ?? internal);
	const afterShare = Math.round(100 - current);
	const [dragging, setDragging] = useState(false);
	const [quiet, setQuiet] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);
	const engine = useRef<ReturnType<typeof createImageCompare> | null>(null);
	const latest = useRef({ position, onPositionChange });
	latest.current = { position, onPositionChange };
	const vertical = orientation === "vertical";
	// Server and first paint only; after that the engine owns every inline style.
	const [first] = useState(() => ({ p: current, v: vertical }));

	const options = {
		orientation,
		onCommit: (next: number) => {
			if (latest.current.position === undefined) setInternal(next);
			latest.current.onPositionChange?.(next);
		},
		onDragChange: setDragging,
		onQuietChange: setQuiet,
		hover,
	};
	const optionsRef = useRef(options);
	optionsRef.current = options;

	// biome-ignore lint/correctness/useExhaustiveDependencies: the engine is created once; changes flow in through set and update.
	useEffect(() => {
		if (!rootRef.current) return;
		engine.current = createImageCompare(rootRef.current, current, optionsRef.current);
		return () => {
			engine.current?.destroy();
			engine.current = null;
		};
	}, []);
	useEffect(() => {
		engine.current?.update(options);
	});
	useEffect(() => {
		engine.current?.set(current);
	}, [current]);

	const s = imageCompare({ variant, size });
	return (
		<div
			ref={rootRef}
			data-slot="image-compare"
			data-orientation={orientation}
			data-dragging={dragging || undefined}
			className={cn(s.root(), className)}
			style={{ aspectRatio }}
		>
			<div className={s.layer()}>{after}</div>
			<div
				data-compare="before"
				className={s.layer()}
				style={{
					clipPath: first.v
						? `inset(0 0 ${100 - first.p}% 0)`
						: `inset(0 ${100 - first.p}% 0 0)`,
				}}
			>
				{before}
			</div>
			{labels ? (
				<>
					<span data-compare="chip-before" className={s.chip()} aria-hidden>
						{labels[0]}
					</span>
					<span
						data-compare="chip-after"
						data-place="end"
						className={s.chip()}
						style={{ opacity: first.v ? 0 : 1 }}
						aria-hidden
					>
						{labels[1]}
					</span>
					<span
						data-compare="chip-bottom"
						data-place="bottom"
						className={s.chip()}
						style={{ opacity: first.v ? 1 : 0 }}
						aria-hidden
					>
						{labels[1]}
					</span>
				</>
			) : null}
			<div
				data-compare="pivot"
				className={s.pivot()}
				style={{ translate: first.v ? `50% ${first.p}%` : `${first.p}% 50%` }}
			>
				<span
					data-compare="rotor"
					className={s.rotor()}
					style={{ rotate: first.v ? "90deg" : "0deg" }}
				>
					<span className={s.line()} />
				</span>
				<span data-compare="handle-slot" className={s.slot()}>
					<div
						data-compare="handle"
						data-quiet={quiet || undefined}
						className={s.handle()}
						role="slider"
						tabIndex={0}
						aria-label={label}
						aria-orientation={orientation}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={afterShare}
						aria-valuetext={`${afterShare}% after`}
					>
						<span
							data-compare="chevrons"
							className={s.chevrons()}
							style={{ rotate: first.v ? "90deg" : "0deg" }}
							aria-hidden
						>
							<span className={s.chevron()}>
								<Chevron d="M10 3.5 5.5 8l4.5 4.5" />
							</span>
							<span className={s.chevron()}>
								<Chevron d="m6 3.5 4.5 4.5L6 12.5" />
							</span>
						</span>
					</div>
				</span>
			</div>
		</div>
	);
}
