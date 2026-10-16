"use client";

import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
import { cn } from "../../lib/react/cn";
import type { WheelCarouselItem } from "./types";
import {
	type WheelCarouselAspect,
	type WheelCarouselPhotoSide,
	type WheelCarouselSize,
	wheelCarousel,
} from "./variants";
import { createWheel } from "./wheel";

export type {
	WheelCarouselAspect,
	WheelCarouselItem,
	WheelCarouselPhotoSide,
	WheelCarouselSize,
};

export interface WheelCarouselProps {
	items: WheelCarouselItem[];
	/** Controlled selection; pair with `onActiveIndexChange`. */
	activeIndex?: number;
	defaultIndex?: number;
	onActiveIndexChange?: (index: number, item: WheelCarouselItem) => void;
	photoSide?: WheelCarouselPhotoSide;
	aspect?: WheelCarouselAspect;
	size?: WheelCarouselSize;
	/** Photo column width, as a share of the row, 0 to 100. */
	photoWidth?: number;
	/** Distance from the apex to the wheel's centre, px. */
	radius?: number;
	/** Degrees between neighbouring labels. */
	spacing?: number;
	/** Labels drawn either side of the selected one. */
	visibleItems?: number;
	/** Horizontal position of the apex, as a share of the list's width. */
	apexInset?: number;
	showMarker?: boolean;
	/** Rotation per wheel pixel; 0 leaves page scroll alone over the carousel. */
	scrollSpeed?: number;
	dragSpeed?: number;
	snap?: boolean;
	momentum?: boolean;
	/** Accessible name of the list. */
	label?: string;
	className?: string;
}

const LEAVE_MS = 320;

export function WheelCarousel({
	items,
	activeIndex,
	defaultIndex = 0,
	onActiveIndexChange,
	photoSide = "left",
	aspect = "3/4",
	size = "default",
	photoWidth = 24,
	radius = 320,
	spacing = 14,
	visibleItems = 7,
	apexInset = 34,
	showMarker = true,
	scrollSpeed = 0.008,
	dragSpeed = 0.02,
	snap = true,
	momentum = true,
	label = "Carousel",
	className,
}: WheelCarouselProps) {
	const id = useId();
	const stageRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const wheelRef = useRef<ReturnType<typeof createWheel>>(null);
	const [current, setCurrent] = useState(activeIndex ?? defaultIndex);
	const [layers, setLayers] = useState([
		{ index: activeIndex ?? defaultIndex, leaving: false },
	]);
	const s = wheelCarousel({ photoSide, aspect, size });
	const onSelect = (index: number) => {
		setCurrent(index);
		const item = items[index];
		if (item) onActiveIndexChange?.(index, item);
	};
	const options = {
		radius,
		spacing,
		visibleItems,
		apexInset,
		scrollSpeed,
		dragSpeed,
		snap,
		momentum,
		onSelect,
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: activeIndex, defaultIndex, options left out on purpose, the listed values decide when it runs.
	useEffect(() => {
		if (!stageRef.current || !listRef.current) return;
		const wheel = createWheel(
			stageRef.current,
			listRef.current,
			activeIndex ?? defaultIndex,
			options,
		);
		wheelRef.current = wheel;
		return () => wheel.destroy();
		// Options flow through update(); recreating would drop the wheel's position.
	}, []);

	useEffect(() => {
		wheelRef.current?.update(options);
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: items.
	useEffect(() => {
		wheelRef.current?.refresh();
	}, [items]);

	useEffect(() => {
		if (activeIndex !== undefined && activeIndex !== current)
			wheelRef.current?.goTo(activeIndex);
	}, [activeIndex, current]);

	// Crossfade: the new photo fades in over the old, which fades out and is then dropped.
	useEffect(() => {
		setLayers((prev) =>
			prev.at(-1)?.index === current
				? prev
				: [
						...prev.map((layer) => ({ ...layer, leaving: true })),
						{ index: current, leaving: false },
					],
		);
		const timer = setTimeout(
			() => setLayers((prev) => prev.filter((layer) => !layer.leaving)),
			LEAVE_MS,
		);
		return () => clearTimeout(timer);
	}, [current]);

	const selected = items[current];

	return (
		<div
			data-slot="wheel-carousel"
			className={cn(s.root(), className)}
			style={{ "--photo-width": `${photoWidth}%` } as CSSProperties}
		>
			{/* The stage takes drag, wheel and keys; the listbox is the labels alone, so it owns only options. */}
			<div ref={stageRef} className={s.stage()}>
				<div className={s.photoCol()}>
					<div className={s.photo()}>
						{layers.map((layer) => {
							const item = items[layer.index];
							return item ? (
								<img
									key={`${layer.index}-${item.image}`}
									src={item.image}
									alt={layer.leaving ? "" : (item.imageAlt ?? item.label)}
									draggable={false}
									data-leaving={layer.leaving || undefined}
									className={s.image()}
								/>
							) : null;
						})}
					</div>
				</div>
				<div
					ref={listRef}
					role="listbox"
					aria-label={label}
					aria-activedescendant={selected ? `${id}-${current}` : undefined}
					tabIndex={0}
					className={s.list()}
				>
					{showMarker ? (
						<span
							aria-hidden="true"
							className={s.marker()}
							style={{ left: `calc(${apexInset}% - 20px)` }}
						/>
					) : null}
					{items.map((item, index) => (
						// biome-ignore lint/a11y/useFocusableInteractive: aria-activedescendant keeps focus on the listbox
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
							key={index}
							id={`${id}-${index}`}
							role="option"
							aria-selected={index === current}
							data-wheel-item=""
							className={s.item()}
						>
							{item.label}
						</div>
					))}
				</div>
			</div>
			<span className="sr-only" aria-live="polite">
				{selected ? `${selected.label}, ${current + 1} of ${items.length}` : ""}
			</span>
		</div>
	);
}
