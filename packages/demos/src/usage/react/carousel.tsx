"use client";

import { Carousel, CarouselItem } from "@baby-ui/react";
import { useState } from "react";

export function Example({ rooms }: { rooms: { name: string; image: string }[] }) {
	const [index, setIndex] = useState(0);

	return (
		<Carousel
			label="Rooms at the Harbour"
			variant="showcase"
			interval={4000}
			index={index}
			onIndexChange={setIndex}
		>
			{rooms.map((room) => (
				<CarouselItem key={room.name}>
					<figure className="dark relative h-[clamp(24rem,55cqw,38rem)] overflow-hidden rounded-[inherit] bg-muted">
						<img src={room.image} alt="" className="size-full object-cover" />
						<div className="absolute inset-0 bg-linear-to-t from-background/75 to-transparent" />
						<figcaption className="absolute inset-x-0 bottom-0 p-8 font-semibold text-2xl text-foreground">
							{room.name}
						</figcaption>
					</figure>
				</CarouselItem>
			))}
		</Carousel>
	);
}
