"use client";

import { ScrollTiltedGrid } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";
import { TILTED_IMAGES } from "../data/stacks";

type Props = Record<string, unknown>;

export function ScrollTiltedGridDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ScrollTiltedGrid>>(props);
	return (
		<ScrollTiltedGrid
			images={TILTED_IMAGES}
			size={p.size ?? "default"}
			aspect={p.aspect ?? "portrait"}
			radius={p.radius ?? "sm"}
			maxTilt={Number(props.maxTilt ?? 62)}
			maxBlur={Number(props.maxBlur ?? 7)}
			perspective={Number(props.perspective ?? 1000)}
			repeat={Number(props.repeat ?? 1)}
			className="max-w-3xl"
		/>
	);
}
