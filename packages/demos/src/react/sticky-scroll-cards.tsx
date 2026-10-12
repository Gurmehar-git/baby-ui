"use client";

import { StickyScrollCards } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";
import { STICKY_CARDS } from "../data/stacks";

type Props = Record<string, unknown>;

export function StickyScrollCardsDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof StickyScrollCards>>(props);
	return (
		<StickyScrollCards
			cards={STICKY_CARDS}
			variant={p.variant ?? "polaroid"}
			size={p.size ?? "default"}
			tilt={Number(props.tilt ?? 1)}
			hint={p.hint ?? "Scroll to explore"}
			className="max-w-3xl"
		/>
	);
}
