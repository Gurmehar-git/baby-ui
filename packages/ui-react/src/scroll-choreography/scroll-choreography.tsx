"use client";

import { type CSSProperties, useEffect, useRef } from "react";
import { cn } from "../lib/cn";
import { bindScrollProgress } from "../lib/scroll-frame";
import {
	CHOREOGRAPHY_SLOTS,
	type ScrollChoreographyImage,
	type ScrollChoreographyImages,
} from "./types";
import {
	type ScrollChoreographySize,
	type ScrollChoreographyVariant,
	scrollChoreography,
} from "./variants";

export type {
	ScrollChoreographyImage,
	ScrollChoreographyImages,
	ScrollChoreographySize,
	ScrollChoreographyVariant,
};

export interface ScrollChoreographyProps {
	/** Four images; `topRight` is the one that ends up filling the frame. */
	images: ScrollChoreographyImages;
	/** `expand` grows the top-right image to fill the frame at the end; `stack` stops at the stack. */
	variant?: ScrollChoreographyVariant;
	size?: ScrollChoreographySize;
	/** Accessible name of the scroll region. */
	label?: string;
	className?: string;
}

export function ScrollChoreography({
	images,
	variant = "expand",
	size = "default",
	label = "Scroll to arrange the images",
	className,
}: ScrollChoreographyProps) {
	const rootRef = useRef<HTMLElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const s = scrollChoreography({ size, variant });

	useEffect(() => {
		const root = rootRef.current;
		const track = trackRef.current;
		if (!root || !track) return;
		return bindScrollProgress(root, track);
	}, []);

	return (
		<section
			ref={rootRef}
			data-slot="scroll-choreography"
			aria-label={label}
			// biome-ignore lint/a11y/noNoninteractiveTabindex: the scroll box needs focus for keyboard scrolling.
			tabIndex={0}
			className={cn(s.root(), className)}
		>
			<div ref={trackRef} className={s.track()}>
				<div className={s.stage()}>
					{CHOREOGRAPHY_SLOTS.map((slot) => {
						const image = images[slot.key];
						return (
							<div
								key={slot.key}
								className={cn(s.image(), slot.key === "topRight" ? s.hero() : s.under())}
								style={
									{
										"--x0": slot.x,
										"--y0": slot.y,
										"--dy": slot.dy,
										zIndex: slot.z,
									} as CSSProperties
								}
							>
								<img
									src={image.src}
									alt={image.alt}
									className={s.img()}
									draggable={false}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
