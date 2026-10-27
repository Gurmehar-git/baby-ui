"use client";

import { Carousel, CarouselItem } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { CAROUSEL_SLIDES } from "../data/carousel";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function CarouselDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Carousel>>(props);
	const interval = p.interval || 4000;
	const projection = p.projection ?? "linear";
	const cylindrical = projection !== "linear";
	const variant = p.variant ?? "default";
	const showcase = variant === "showcase";
	const [index, setIndex] = useState(0);
	return (
		<div
			className={
				cylindrical
					? "w-full max-w-5xl"
					: showcase
						? "w-full max-w-6xl"
						: "w-full max-w-2xl"
			}
		>
			<Carousel
				// Remount when rotation settings change, so autoplay starts as the viewer asked.
				key={`${interval}-${String(p.autoplay)}`}
				label="Rooms at the Harbour"
				projection={projection}
				visibleItems={p.visibleItems ?? 5}
				minScale={p.minScale ?? 0.58}
				arc={p.arc}
				variant={variant}
				size={p.size ?? "default"}
				index={index}
				onIndexChange={setIndex}
				controls={p.controls ?? "full"}
				loop={p.loop ?? cylindrical}
				interval={interval}
				autoplay={p.autoplay ?? false}
			>
				{CAROUSEL_SLIDES.map((slide) => (
					<CarouselItem key={slide.title}>
						<figure
							className={
								showcase
									? cylindrical
										? "dark relative aspect-[4/5] overflow-hidden rounded-[inherit] bg-muted"
										: "dark relative h-[clamp(24rem,55cqw,38rem)] overflow-hidden rounded-[inherit] bg-muted"
									: "overflow-hidden rounded-xl border border-border bg-background"
							}
						>
							<img
								src={slide.image}
								alt=""
								width={680}
								height={520}
								className={
									showcase
										? "absolute inset-0 size-full object-cover"
										: "aspect-[4/3] w-full object-cover"
								}
							/>
							{showcase ? (
								<div
									aria-hidden
									className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/80 via-background/10 to-transparent"
								/>
							) : null}
							<figcaption
								className={
									showcase
										? "absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-8 text-foreground @max-[640px]:p-5"
										: "flex items-baseline justify-between gap-3 p-3"
								}
							>
								<span className="min-w-0">
									<span
										className={
											showcase
												? "block text-balance font-semibold text-2xl tracking-tight"
												: "block truncate font-medium text-foreground text-sm"
										}
									>
										{slide.title}
									</span>
									<span
										className={
											showcase
												? "mt-1 block max-w-lg text-pretty text-sm text-foreground/75"
												: "block truncate text-muted-foreground text-xs"
										}
									>
										{slide.detail}
									</span>
								</span>
								<span
									className={
										showcase
											? "shrink-0 rounded-full bg-background/75 px-3 py-1.5 font-medium text-sm tabular-nums backdrop-blur-md"
											: "shrink-0 text-foreground text-sm tabular-nums"
									}
								>
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
