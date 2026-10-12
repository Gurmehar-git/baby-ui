"use client";

import { CardStack } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { DESTINATIONS } from "../data/card-stack";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function CardStackDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof CardStack>>(props);
	return (
		<CardStack
			items={DESTINATIONS}
			getKey={(item) => item.city}
			getLabel={(item) => item.city}
			labels={{ left: "Skip", right: "Shortlist" }}
			outcomes={{ left: "skipped", right: "shortlisted" }}
			label="Destinations"
			variant={p.variant ?? "stack"}
			size={p.size ?? "default"}
			buttons={p.buttons ?? true}
			renderCard={(item) => (
				<div className="flex h-full flex-col">
					<img
						src={item.image}
						alt=""
						className="min-h-0 w-full flex-1 object-cover"
						draggable={false}
					/>
					<div className="p-4">
						<p className="font-medium text-foreground">{item.city}</p>
						<p className="text-muted-foreground text-sm">
							{item.country} · {item.note}
						</p>
					</div>
				</div>
			)}
		/>
	);
}
