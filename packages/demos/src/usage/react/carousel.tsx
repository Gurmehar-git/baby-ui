"use client";

import { Carousel, CarouselItem } from "@baby-ui/react";

export function Example({ rooms }: { rooms: { name: string; image: string }[] }) {
	return (
		<Carousel label="Rooms at the Harbour" interval={4000}>
			{rooms.map((room) => (
				<CarouselItem key={room.name}>
					<img
						src={room.image}
						alt={room.name}
						className="aspect-[4/3] w-full rounded-xl object-cover"
					/>
				</CarouselItem>
			))}
		</Carousel>
	);
}
