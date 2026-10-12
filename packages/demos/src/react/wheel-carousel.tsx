"use client";

import { WheelCarousel } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";
import { WHEEL_ITEMS } from "../data/wheel";

type Props = Record<string, unknown>;

export function WheelCarouselDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof WheelCarousel>>(props);
	return (
		<WheelCarousel
			items={WHEEL_ITEMS}
			photoSide={p.photoSide ?? "left"}
			aspect={p.aspect ?? "3/4"}
			size={p.size ?? "default"}
			visibleItems={Number(props.visibleItems ?? 7)}
			spacing={Number(props.spacing ?? 14)}
			radius={Number(props.radius ?? 320)}
			snap={p.snap ?? true}
			momentum={p.momentum ?? true}
			showMarker={p.showMarker ?? true}
			photoWidth={32}
			className="h-[420px]"
		/>
	);
}
