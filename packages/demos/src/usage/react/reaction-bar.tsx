"use client";

import {
	ReactionBar,
	ReactionBarCount,
	ReactionBarIcon,
	ReactionBarItem,
} from "@baby-ui/react";
import { useState } from "react";

export function Example() {
	const [pressed, setPressed] = useState<string[]>([]);
	return (
		<ReactionBar value={pressed} onValueChange={setPressed}>
			<ReactionBarItem value="like" label="Like" count={127} tone="destructive">
				<ReactionBarIcon icon="like" />
				<ReactionBarCount />
			</ReactionBarItem>
			<ReactionBarItem value="comment" label="Comment" count={18} tone="primary">
				<ReactionBarIcon icon="comment" />
				<ReactionBarCount />
			</ReactionBarItem>
			<ReactionBarItem value="share" label="Share">
				<ReactionBarIcon icon="share" />
			</ReactionBarItem>
		</ReactionBar>
	);
}
