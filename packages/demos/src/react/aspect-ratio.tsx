"use client";

import { AspectRatio, AspectRatioImage } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import { CAROUSEL_SLIDES } from "../data/carousel";
import { controlProps } from "../data/preview-props";

const RATIOS = [
	{ label: "16:9", value: 16 / 9 },
	{ label: "1:1", value: 1 },
	{ label: "4:5", value: 4 / 5 },
];

export function AspectRatioDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof AspectRatio>>(props);
	const [ratio, setRatio] = useState(p.ratio ?? 16 / 9);
	useEffect(() => setRatio(p.ratio ?? 16 / 9), [p.ratio]);
	const image = CAROUSEL_SLIDES[0];
	if (!image) return null;
	return (
		<div className="grid w-full max-w-lg gap-4">
			<fieldset className="flex justify-center gap-2">
				<legend className="sr-only">Aspect ratio</legend>
				{RATIOS.map((item) => (
					<button
						key={item.label}
						type="button"
						aria-pressed={ratio === item.value}
						className="rounded-full border border-border px-3 py-1.5 text-sm transition-[scale,background-color,color] duration-(--duration-fast) active:scale-(--press-scale) aria-pressed:bg-foreground aria-pressed:text-background"
						onClick={() => setRatio(item.value)}
					>
						{item.label}
					</button>
				))}
			</fieldset>
			<AspectRatio
				ratio={ratio}
				motion={p.motion ?? "smooth"}
				className="rounded-2xl bg-muted"
			>
				<AspectRatioImage
					src={image.image}
					alt={image.title}
					width={680}
					height={520}
					fit={(props.fit as "cover" | "contain") ?? "cover"}
				/>
			</AspectRatio>
		</div>
	);
}
