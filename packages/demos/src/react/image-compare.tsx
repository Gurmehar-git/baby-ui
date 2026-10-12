"use client";

import { ImageCompare } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { photo } from "../data/media";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

const SRC = photo(1018, 900, 600);

export function ImageCompareDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ImageCompare>>(props);
	return (
		<div className="w-full max-w-xl">
			<ImageCompare
				orientation={p.orientation ?? "horizontal"}
				variant={p.variant ?? "default"}
				size={p.size ?? "default"}
				hover={p.hover ?? false}
				labels={["Graded", "Original"]}
				before={
					<img
						src={`${SRC}?grayscale`}
						alt="Mountain lake, colour graded to black and white"
					/>
				}
				after={<img src={SRC} alt="Mountain lake in original colour" />}
			/>
		</div>
	);
}
