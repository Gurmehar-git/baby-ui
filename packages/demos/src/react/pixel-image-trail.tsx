"use client";

import { PixelImageTrail } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function PixelImageTrailDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof PixelImageTrail>>(props);
	return (
		<PixelImageTrail
			src="https://picsum.photos/id/1015/1200/800"
			alt="A river winding through a mountain valley"
			variant={p.variant ?? "fade"}
			size={p.size ?? "default"}
			pixelSize={Number(p.pixelSize ?? 36)}
			fadeDuration={Number(p.fadeDuration ?? 900)}
			maxPixels={Number(p.maxPixels ?? 84)}
			initialPixels={Number(p.initialPixels ?? 24)}
			radius={Number(p.radius ?? 40)}
			className="max-w-3xl"
		/>
	);
}
