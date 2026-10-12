"use client";

import { type CSSProperties, useEffect, useRef } from "react";
import { cn } from "../lib/cn";
import { onScrollFrame } from "../lib/scroll-frame";
import {
	type CollectionSurferItem,
	surfNearness,
	surfShift,
	wrapSurfScroll,
} from "./types";
import {
	type CollectionSurferSize,
	type CollectionSurferVariant,
	collectionSurfer,
} from "./variants";

export type { CollectionSurferItem, CollectionSurferSize, CollectionSurferVariant };

export interface CollectionSurferProps {
	items: CollectionSurferItem[];
	/** How cards react to the pointer: grow, lift, or not at all. */
	variant?: CollectionSurferVariant;
	size?: CollectionSurferSize;
	/** Scroll distance in px that moves the line one card forward. */
	scrollPerItem?: number;
	/** Overlay heading; the item count follows it. */
	title?: string;
	hint?: string;
	/** Accessible name of the scroll region. */
	label?: string;
	className?: string;
}

export function CollectionSurfer({
	items,
	variant = "magnetic",
	size = "default",
	scrollPerItem = 300,
	title,
	hint = "Scroll to surf",
	label = "Collection",
	className,
}: CollectionSurferProps) {
	const rootRef = useRef<HTMLElement>(null);
	const stageRef = useRef<HTMLDivElement>(null);
	const count = items.length;
	const loop = count * scrollPerItem;
	const s = collectionSurfer({ variant, size });

	useEffect(() => {
		const root = rootRef.current;
		const stage = stageRef.current;
		if (!root || !stage || !loop) return;
		let pointer: { x: number; y: number } | null = null;
		let raf = 0;
		const reactive = () =>
			variant !== "simple" && !matchMedia("(prefers-reduced-motion: reduce)").matches;
		const cards = () => stage.querySelectorAll<HTMLElement>("[data-surf-card]");
		const measure = () => {
			raf = 0;
			for (const card of cards()) {
				const near =
					pointer && reactive()
						? surfNearness(card.getBoundingClientRect(), pointer.x, pointer.y)
						: 0;
				card.style.setProperty("--near", near.toFixed(3));
			}
		};
		const schedule = () => {
			if (!raf) raf = requestAnimationFrame(measure);
		};
		const onMove = (event: PointerEvent) => {
			pointer = { x: event.clientX, y: event.clientY };
			schedule();
		};
		const onLeave = () => {
			pointer = null;
			schedule();
		};
		const stop = onScrollFrame(root, () => {
			const wrapped = wrapSurfScroll(root.scrollTop, loop);
			if (wrapped !== null) root.scrollTop = wrapped;
			stage.style.setProperty(
				"--cs-shift",
				surfShift(root.scrollTop, scrollPerItem, count).toFixed(4),
			);
			if (pointer) schedule();
		});
		stage.addEventListener("pointermove", onMove);
		stage.addEventListener("pointerleave", onLeave);
		measure();
		return () => {
			stop();
			cancelAnimationFrame(raf);
			stage.removeEventListener("pointermove", onMove);
			stage.removeEventListener("pointerleave", onLeave);
		};
	}, [loop, scrollPerItem, count, variant]);

	return (
		<section
			ref={rootRef}
			data-slot="collection-surfer"
			aria-label={label}
			// biome-ignore lint/a11y/noNoninteractiveTabindex: the scroll box needs focus for keyboard scrolling.
			tabIndex={0}
			className={cn(s.root(), className)}
		>
			<div ref={stageRef} className={s.stage()}>
				{title && (
					<h2 className={s.title()}>
						{title}
						<span className={s.count()}>({count})</span>
					</h2>
				)}
				{hint && <p className={s.hint()}>{hint}</p>}
				<div className={s.scene()}>
					<div className={s.track()}>
						{[...items, ...items].map((item, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
								key={`${i}-${item.src}`}
								data-surf-card=""
								aria-hidden={i >= count || undefined}
								className={s.card()}
								style={{ "--i": i } as CSSProperties}
							>
								<span className={s.number()}>
									{String((i % count) + 1).padStart(2, "0")}
								</span>
								<div className={s.frame()}>
									<img
										src={item.src}
										alt={item.alt}
										className={s.image()}
										draggable={false}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			<div aria-hidden="true" style={{ height: loop * 3 }} />
		</section>
	);
}
