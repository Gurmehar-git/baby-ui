"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { Spinner } from "../../spinner/react/spinner";
import { type FieldOptions, mountField } from "../field";
import { type FisheyeOptions, mountFisheye } from "../fisheye";
import { createGallery } from "../gallery";
import { INFINITE_IMAGE_FIELD_LABELS, type InfiniteImageFieldLabels } from "../labels";
import {
	DEFAULT_LENS,
	type InfiniteImageFieldLayout,
	type InfiniteImageFieldShape,
	type InfiniteImageFieldSize,
	type InfiniteImageFieldVariant,
	type InfiniteImageItem,
	infiniteImageField,
} from "../variants";

export type {
	InfiniteImageFieldLabels,
	InfiniteImageFieldLayout,
	InfiniteImageFieldShape,
	InfiniteImageFieldSize,
	InfiniteImageFieldVariant,
	InfiniteImageItem,
};

export interface InfiniteImageFieldProps {
	/** Tiles repeat endlessly; each cell always shows the same item. */
	items: InfiniteImageItem[];
	variant?: InfiniteImageFieldVariant;
	size?: InfiniteImageFieldSize;
	/** Drift: tile corners. */
	shape?: InfiniteImageFieldShape;
	/** Drift: `staggered` offsets every other column by half a tile. */
	layout?: InfiniteImageFieldLayout;
	/** Drift and fisheye: tile size in CSS px (at the lens edge for fisheye). */
	imageWidth?: number;
	imageHeight?: number;
	/** Drift and fisheye: space between tiles in CSS px. */
	gap?: number;
	/** Drift: top speed in CSS px per frame at 60fps. */
	maxSpeed?: number;
	/** Drift: how quickly the drift follows the pointer, 0 to 1 per frame. */
	smoothing?: number;
	/** Fisheye and gallery: lens strength, 0 is flat. Defaults per variant. */
	lens?: number;
	/** Fisheye: momentum kept after a drag, 0 to 0.98. */
	inertia?: number;
	/** Fisheye: frame each image with a title and caption row. */
	captions?: boolean;
	/** Gallery: cell size in world units; the view is 2 units tall. */
	cellSize?: number;
	/** Gallery: how far the view pulls back while dragging; 1 disables it. */
	dragZoom?: number;
	/** Gallery: the "drag to explore" hint. */
	showHint?: boolean;
	labels?: Partial<InfiniteImageFieldLabels>;
	className?: string;
}

/** An endless image field: drifts toward the pointer, or pans by drag through a fisheye or WebGL lens. */
export function InfiniteImageField({
	variant = "drift",
	...props
}: InfiniteImageFieldProps) {
	if (variant === "fisheye") return <FisheyeField {...props} />;
	if (variant === "gallery") return <GalleryField {...props} />;
	return <DriftField {...props} />;
}

type EngineProps = Omit<InfiniteImageFieldProps, "variant">;

function ItemList({ items }: { items: InfiniteImageItem[] }) {
	return (
		<ul className="sr-only">
			{items.map((item, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
				<li key={`${index}-${item.src}`}>
					{item.title ? `${item.title}: ` : ""}
					{item.alt}
					{item.caption ? `, ${item.caption}` : ""}
				</li>
			))}
		</ul>
	);
}

function DriftField({
	items,
	size,
	shape = "rounded",
	layout = "grid",
	imageWidth = 160,
	imageHeight = 220,
	gap = 24,
	maxSpeed = 5,
	smoothing = 0.07,
	labels,
	className,
}: EngineProps) {
	const root = useRef<HTMLElement>(null);
	const canvas = useRef<HTMLCanvasElement>(null);
	const engine = useRef<ReturnType<typeof mountField>>(null);
	const l = { ...INFINITE_IMAGE_FIELD_LABELS.drift, ...labels };
	const s = infiniteImageField({ variant: "drift", shape, layout, size });
	const options: FieldOptions = {
		images: items.map((item) => item.src),
		shape,
		layout,
		imageWidth,
		imageHeight,
		gap,
		maxSpeed,
		smoothing,
	};
	const latest = useRef(options);
	latest.current = options;

	useEffect(() => {
		if (!root.current || !canvas.current) return;
		engine.current = mountField(root.current, canvas.current, latest.current);
		return () => engine.current?.destroy();
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: items, shape, layout and more.
	useEffect(() => {
		engine.current?.update(latest.current);
	}, [items, shape, layout, imageWidth, imageHeight, gap, maxSpeed, smoothing]);

	return (
		<section
			ref={root}
			data-slot="infinite-image-field"
			data-variant="drift"
			aria-label={l.label}
			// biome-ignore lint/a11y/noNoninteractiveTabindex: focus is how arrow keys drift the field
			tabIndex={0}
			className={cn(s.root(), className)}
		>
			<ItemList items={items} />
			<canvas ref={canvas} aria-hidden className={s.canvas()} />
		</section>
	);
}

function FisheyeField({
	items,
	size,
	imageWidth = 150,
	imageHeight = 180,
	gap = 8,
	lens = DEFAULT_LENS.fisheye,
	inertia = 0.94,
	captions = true,
	labels,
	className,
}: EngineProps) {
	const root = useRef<HTMLElement>(null);
	const canvas = useRef<HTMLCanvasElement>(null);
	const engine = useRef<ReturnType<typeof mountFisheye>>(null);
	const l = { ...INFINITE_IMAGE_FIELD_LABELS.fisheye, ...labels };
	const s = infiniteImageField({ variant: "fisheye", size });
	const options: FisheyeOptions = {
		items,
		captions,
		tileWidth: imageWidth,
		tileHeight: imageHeight,
		gap,
		lens,
		inertia,
	};
	const latest = useRef(options);
	latest.current = options;

	useEffect(() => {
		if (!root.current || !canvas.current) return;
		engine.current = mountFisheye(root.current, canvas.current, latest.current);
		return () => engine.current?.destroy();
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: items, captions, imageWidth and more.
	useEffect(() => {
		engine.current?.update(latest.current);
	}, [items, captions, imageWidth, imageHeight, gap, lens, inertia]);

	return (
		<section
			ref={root}
			data-slot="infinite-image-field"
			data-variant="fisheye"
			data-dragging="false"
			aria-label={l.label}
			aria-roledescription="gallery"
			// biome-ignore lint/a11y/noNoninteractiveTabindex: focus is how arrow keys pan the grid
			tabIndex={0}
			className={cn(s.root(), className)}
		>
			<ItemList items={items} />
			<canvas ref={canvas} aria-hidden className={s.canvas()} />
			<div aria-hidden className={s.vignette()} />
		</section>
	);
}

function GalleryField({
	items,
	size,
	lens = DEFAULT_LENS.gallery,
	cellSize = 0.75,
	dragZoom = 1.25,
	showHint = true,
	labels,
	className,
}: EngineProps) {
	const rootRef = useRef<HTMLElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const galleryRef = useRef<ReturnType<typeof createGallery>>(null);
	const [phase, setPhase] = useState<"loading" | "webgl" | "fallback">("loading");
	const l = { ...INFINITE_IMAGE_FIELD_LABELS.gallery, ...labels };
	const s = infiniteImageField({ variant: "gallery", size });
	const options = { cellSize, dragZoom, lens };

	// biome-ignore lint/correctness/useExhaustiveDependencies: options left out on purpose, the listed values decide when it runs.
	useEffect(() => {
		if (!rootRef.current || !canvasRef.current) return;
		setPhase("loading");
		const gallery = createGallery(
			rootRef.current,
			canvasRef.current,
			items,
			options,
			(webgl) => setPhase(webgl ? "webgl" : "fallback"),
		);
		galleryRef.current = gallery;
		return () => gallery.destroy();
		// Options flow through update(); only new items rebuild the atlases.
	}, [items]);

	useEffect(() => {
		galleryRef.current?.update(options);
	});

	return (
		<section
			ref={rootRef}
			data-slot="infinite-image-field"
			data-variant="gallery"
			aria-label={l.label}
			aria-roledescription="gallery"
			aria-busy={phase === "loading"}
			// biome-ignore lint/a11y/noNoninteractiveTabindex: focus is how arrow keys pan the grid
			tabIndex={0}
			className={cn(s.root(), className)}
		>
			<ItemList items={items} />
			<canvas
				ref={canvasRef}
				className={cn(s.canvas(), phase !== "webgl" && "opacity-0")}
			/>
			{phase === "loading" ? (
				<div className={s.status()}>
					<Spinner label={l.loading} />
				</div>
			) : null}
			{phase === "fallback" ? (
				<div className={s.fallback()}>
					{items.map((item, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
						<figure key={`${index}-${item.src}`}>
							<img src={item.src} alt={item.alt} className={s.fallbackImage()} />
							<figcaption className={s.fallbackCaption()}>
								<span>{item.title ?? item.alt}</span>
								{item.caption ? <span>{item.caption}</span> : null}
							</figcaption>
						</figure>
					))}
				</div>
			) : null}
			{phase === "webgl" && showHint ? (
				<p aria-hidden="true" className={s.hint()}>
					{l.hint}
				</p>
			) : null}
		</section>
	);
}
