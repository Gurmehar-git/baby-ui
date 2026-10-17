"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";
import { cn } from "../../lib/cn";
import type { ImageSlotProps } from "../../lib/image";
import {
	type ScrollTiltedGridAspect,
	type ScrollTiltedGridImage,
	type ScrollTiltedGridRadius,
	type ScrollTiltedGridSize,
	scrollTiltedGrid,
	scrubTiles,
} from "../variants";

export type {
	ScrollTiltedGridAspect,
	ScrollTiltedGridImage,
	ScrollTiltedGridRadius,
	ScrollTiltedGridSize,
};

export interface ScrollTiltedGridProps {
	images: readonly ScrollTiltedGridImage[];
	/** How many times the image list repeats down the grid. */
	repeat?: number;
	/** Largest X tilt in degrees, reached as a tile enters or leaves. */
	maxTilt?: number;
	/** Largest blur in px at the edges of the scroll box. */
	maxBlur?: number;
	/** CSS perspective on each tile, in px. */
	perspective?: number;
	size?: ScrollTiltedGridSize;
	aspect?: ScrollTiltedGridAspect;
	radius?: ScrollTiltedGridRadius;
	/** Accessible name of the gallery. */
	label?: string;
	/** Renders each image, e.g. through your framework's image component; defaults to `<img>`. */
	image?: (props: ImageSlotProps) => ReactNode;
	className?: string;
}

/** A two-column image grid whose tiles tilt, blur and dim as they scroll through view. */
export function ScrollTiltedGrid({
	images,
	repeat = 1,
	maxTilt = 62,
	maxBlur = 7,
	perspective = 1000,
	size = "default",
	aspect,
	radius,
	label = "Image gallery",
	image,
	className,
}: ScrollTiltedGridProps) {
	const root = useRef<HTMLElement>(null);
	const s = scrollTiltedGrid({ size, aspect, radius });
	const tiles = Array.from({ length: Math.max(1, repeat) }, () => images).flat();
	const count = tiles.length;

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: size.
	useEffect(() => {
		if (!root.current || count === 0) return;
		return scrubTiles(root.current);
	}, [count, size]);

	return (
		<section
			ref={root}
			data-slot="scroll-tilted-grid"
			aria-label={label}
			tabIndex={size === "auto" ? undefined : 0}
			className={cn(s.root(), className)}
		>
			<div className={s.grid()}>
				{tiles.map((tile, i) => (
					<figure
						// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
						key={i}
						data-scroll-tilted-tile=""
						className={scrollTiltedGrid({ side: i % 2 ? "right" : "left" }).figure()}
						style={
							{
								perspective: `${perspective}px`,
								"--scroll-tilted-side": i % 2 ? 1 : -1,
								"--scroll-tilted-tilt": maxTilt,
								"--scroll-tilted-blur": maxBlur,
							} as CSSProperties
						}
					>
						<div className={s.tile()}>
							{image ? (
								image({
									src: tile.src,
									alt: tile.alt,
									className: s.image(),
									loading: i < 4 ? "eager" : "lazy",
								})
							) : (
								<img
									src={tile.src}
									alt={tile.alt}
									className={s.image()}
									loading={i < 4 ? "eager" : "lazy"}
									decoding="async"
									draggable={false}
								/>
							)}
							<span aria-hidden className={s.sheen()} />
						</div>
					</figure>
				))}
			</div>
		</section>
	);
}
