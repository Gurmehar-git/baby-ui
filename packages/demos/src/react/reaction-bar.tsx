"use client";

import {
	ReactionBar,
	ReactionBarCount,
	ReactionBarIcon,
	ReactionBarItem,
} from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";
import { REACTION_BAR_ITEMS } from "../data/reaction-bar";

export function ReactionBarDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof ReactionBar>>(props);
	const [pressed, setPressed] = useState<string[]>(["comment"]);
	return (
		<ReactionBar variant={p.variant} value={pressed} onValueChange={setPressed}>
			{REACTION_BAR_ITEMS.map((item) => (
				<ReactionBarItem
					key={item.value}
					value={item.value}
					label={item.label}
					count={item.count}
					tone={item.tone}
				>
					<ReactionBarIcon icon={item.value} />
					<ReactionBarCount />
				</ReactionBarItem>
			))}
		</ReactionBar>
	);
}
