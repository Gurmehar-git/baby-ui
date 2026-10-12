"use client";

import { Carousel, CarouselItem } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { CAROUSEL_SLIDES } from "../data/carousel";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function CarouselDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Carousel>>(props);
	const interval = p.interval || 4000;
	return (
		<div className="w-full max-w-2xl">
			<Carousel
				// Remount when rotation settings change, so autoplay starts as the viewer asked.
				key={`${interval}-${String(p.autoplay)}`}
				label="Rooms at the Harbour"
				variant={p.variant ?? "default"}
				size={p.size ?? "default"}
				controls={p.controls ?? "full"}
				loop={p.loop ?? false}
				interval={interval}
				autoplay={p.autoplay ?? false}
			>
				{CAROUSEL_SLIDES.map((slide) => (
					<CarouselItem key={slide.title}>
						<figure className="overflow-hidden rounded-xl border border-border bg-background">
							<img
								src={slide.image}
								alt=""
								width={680}
								height={520}
								className="aspect-[4/3] w-full object-cover"
							/>
							<figcaption className="flex items-baseline justify-between gap-3 p-3">
								<span className="min-w-0">
									<span className="block truncate font-medium text-foreground text-sm">
										{slide.title}
									</span>
									<span className="block truncate text-muted-foreground text-xs">
										{slide.detail}
									</span>
								</span>
								<span className="shrink-0 text-foreground text-sm tabular-nums">
									{slide.price}
								</span>
							</figcaption>
						</figure>
					</CarouselItem>
				))}
			</Carousel>
		</div>
	);
}
