"use client";

import { ClickSpark, DraggableMarquee, TextReel } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { MARQUEE_TILES, REEL_ITEMS } from "../data/obsidian";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function TextReelDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof TextReel>>(props);
	return (
		<TextReel
			items={REEL_ITEMS}
			prefix={p.prefix || "We"}
			speed={Number(p.speed ?? 0.6)}
			paused={p.paused ?? false}
			orientation={p.orientation ?? "vertical"}
			size={p.size ?? "default"}
			className="w-full"
		/>
	);
}

export function DraggableMarqueeDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof DraggableMarquee>>(props);
	return (
		<DraggableMarquee
			speed={Number(p.speed ?? 1)}
			direction={p.direction ?? "left"}
			gap={p.gap ?? "md"}
			pauseOnHover={p.pauseOnHover ?? false}
		>
			{MARQUEE_TILES.map((tile) => (
				<figure key={tile.title} className="w-56">
					<img
						src={tile.src}
						alt={tile.title}
						loading="lazy"
						className="aspect-[3/2] w-full rounded-2xl border border-border object-cover"
					/>
					<figcaption className="mt-2 flex justify-between text-sm">
						<span className="font-medium text-foreground">{tile.title}</span>
						<span className="text-muted-foreground">{tile.meta}</span>
					</figcaption>
				</figure>
			))}
		</DraggableMarquee>
	);
}

export function ClickSparkDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ClickSpark>>(props);
	return (
		<div className="relative grid h-56 w-full max-w-md place-items-center overflow-hidden rounded-2xl border border-border border-dashed text-muted-foreground text-sm">
			Click anywhere in here
			<ClickSpark
				scope="parent"
				tone={p.tone ?? "foreground"}
				count={Number(p.count ?? 8)}
				size={Number(p.size ?? 10)}
				radius={Number(p.radius ?? 15)}
				durationMs={Number(p.durationMs ?? 400)}
			/>
		</div>
	);
}
