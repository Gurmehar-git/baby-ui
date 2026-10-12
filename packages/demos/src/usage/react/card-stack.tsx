"use client";

import { CardStack } from "@baby-ui/react";

type Place = { id: string; name: string };

export function Example({
	places,
	onShortlist,
}: {
	places: Place[];
	onShortlist: (place: Place) => void;
}) {
	return (
		<CardStack
			items={places}
			getKey={(place) => place.id}
			getLabel={(place) => place.name}
			labels={{ left: "Skip", right: "Shortlist" }}
			onDecide={(place, decision) => decision === "right" && onShortlist(place)}
			renderCard={(place) => <p className="p-6 font-medium">{place.name}</p>}
		/>
	);
}
