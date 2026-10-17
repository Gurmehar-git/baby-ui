"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "../../lib/cn";
import {
	type ImageTrailOptions,
	type ImageTrailSize,
	type ImageTrailVariant,
	imageTrail,
	mountImageTrail,
} from "../trail";

export type { ImageTrailSize, ImageTrailVariant };

export interface ImageTrailProps {
	/** Image URLs; each one is a pooled element reused round-robin. */
	images: string[];
	/** Pointer travel in px between two spawned images. */
	threshold?: number;
	/** Lifetime of one image, in ms. */
	duration?: number;
	variant?: ImageTrailVariant;
	size?: ImageTrailSize;
	className?: string;
	children?: ReactNode;
}

/** Images that spawn along the pointer's path and glide, then leave in the chosen exit style. */
export function ImageTrail({
	images,
	threshold = 80,
	duration = 1600,
	variant,
	size,
	className,
	children,
}: ImageTrailProps) {
	const root = useRef<HTMLDivElement>(null);
	const trail = useRef<ReturnType<typeof mountImageTrail>>(null);
	const s = imageTrail({ variant, size });
	const options: ImageTrailOptions = { threshold, duration };
	const latest = useRef(options);
	latest.current = options;

	useEffect(() => {
		if (!root.current) return;
		trail.current = mountImageTrail(root.current, latest.current);
		return () => trail.current?.destroy();
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: threshold, duration.
	useEffect(() => {
		trail.current?.update(latest.current);
	}, [threshold, duration]);

	return (
		<div ref={root} data-slot="image-trail" className={cn(s.root(), className)}>
			{children ? <div className={s.content()}>{children}</div> : null}
			<div aria-hidden className={s.layer()}>
				{images.map((src, i) => (
					<img
						// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
						key={i}
						data-slot="image-trail-item"
						src={src}
						alt=""
						draggable={false}
						className={s.item()}
					/>
				))}
			</div>
		</div>
	);
}
