"use client";

import {
	type ComponentProps,
	type CSSProperties,
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
} from "react";
import { cn } from "../../lib/cn";
import type { ImageSlotProps } from "../../lib/image";
import { onScrollFrame } from "../../lib/scroll-frame";
import {
	type CollectionSurferItem,
	surfNearness,
	surfShift,
	wrapSurfScroll,
} from "../types";
import {
	type CollectionSurferSize,
	type CollectionSurferVariant,
	collectionSurfer,
} from "../variants";

export type { CollectionSurferItem, CollectionSurferSize, CollectionSurferVariant };

type CollectionSurferState = {
	items: CollectionSurferItem[];
	styles: ReturnType<typeof collectionSurfer>;
};

const CollectionSurferContext = createContext<CollectionSurferState | null>(null);

function useCollectionSurfer() {
	const state = useContext(CollectionSurferContext);
	if (!state)
		throw new Error("CollectionSurfer parts must be rendered inside a CollectionSurfer.");
	return state;
}

export interface CollectionSurferProps {
	items: CollectionSurferItem[];
	/** How cards react to the pointer: grow, lift, or not at all. */
	variant?: CollectionSurferVariant;
	size?: CollectionSurferSize;
	/** Scroll distance in px that moves the line one card forward. */
	scrollPerItem?: number;
	/** Accessible name of the scroll region. */
	label?: string;
	className?: string;
	children?: ReactNode;
}

/** A scroll box that surfs a 3D line of cards: CollectionSurferTrack, with an optional title and hint over it. */
export function CollectionSurfer({
	items,
	variant = "magnetic",
	size = "default",
	scrollPerItem = 300,
	label = "Collection",
	className,
	children,
}: CollectionSurferProps) {
	const rootRef = useRef<HTMLElement>(null);
	const stageRef = useRef<HTMLDivElement>(null);
	const count = items.length;
	const loop = count * scrollPerItem;
	const styles = collectionSurfer({ variant, size });

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
		<CollectionSurferContext.Provider value={{ items, styles }}>
			<section
				ref={rootRef}
				data-slot="collection-surfer"
				aria-label={label}
				// biome-ignore lint/a11y/noNoninteractiveTabindex: the scroll box needs focus for keyboard scrolling.
				tabIndex={0}
				className={cn(styles.root(), className)}
			>
				<div ref={stageRef} className={styles.stage()}>
					{children}
				</div>
				<div aria-hidden="true" style={{ height: loop * 3 }} />
			</section>
		</CollectionSurferContext.Provider>
	);
}

/** Overlay heading; the item count follows it. */
export function CollectionSurferTitle({
	className,
	children,
	...props
}: ComponentProps<"h2">) {
	const { items, styles } = useCollectionSurfer();
	return (
		<h2
			data-slot="collection-surfer-title"
			className={cn(styles.title(), className)}
			{...props}
		>
			{children}
			<span className={styles.count()}>({items.length})</span>
		</h2>
	);
}

/** A corner hint, e.g. "Scroll to surf". */
export function CollectionSurferHint({ className, ...props }: ComponentProps<"p">) {
	const { styles } = useCollectionSurfer();
	return (
		<p
			data-slot="collection-surfer-hint"
			className={cn(styles.hint(), className)}
			{...props}
		/>
	);
}

export interface CollectionSurferTrackProps {
	/** Renders each image, e.g. through your framework's image component; defaults to `<img>`. */
	image?: (props: ImageSlotProps) => ReactNode;
	className?: string;
}

/** The endless line of cards; the second set repeats the first and is hidden from screen readers. */
export function CollectionSurferTrack({ image, className }: CollectionSurferTrackProps) {
	const { items, styles } = useCollectionSurfer();
	const count = items.length;
	return (
		<div data-slot="collection-surfer-track" className={cn(styles.scene(), className)}>
			<div className={styles.track()}>
				{[...items, ...items].map((item, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
						key={`${i}-${item.src}`}
						data-surf-card=""
						aria-hidden={i >= count || undefined}
						className={styles.card()}
						style={{ "--i": i } as CSSProperties}
					>
						<span className={styles.number()}>
							{String((i % count) + 1).padStart(2, "0")}
						</span>
						<div className={styles.frame()}>
							{image ? (
								image({ src: item.src, alt: item.alt, className: styles.image() })
							) : (
								<img
									src={item.src}
									alt={item.alt}
									className={styles.image()}
									decoding="async"
									draggable={false}
								/>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
