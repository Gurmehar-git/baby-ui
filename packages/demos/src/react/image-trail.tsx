"use client";

import { ImageTrail } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

const IMAGES = [10, 11, 15, 16, 17, 20, 28, 29].map(
	(id) => `https://picsum.photos/id/${id}/300/400`,
);

export function ImageTrailDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ImageTrail>>(props);
	return (
		<ImageTrail
			images={IMAGES}
			variant={p.variant ?? "fall"}
			size={p.size ?? "default"}
			threshold={Number(props.threshold ?? 80)}
			duration={Number(props.duration ?? 1600)}
			className="w-full max-w-3xl rounded-xl border border-border"
		>
			<p className="text-muted-foreground text-sm">Move the pointer here</p>
		</ImageTrail>
	);
}
