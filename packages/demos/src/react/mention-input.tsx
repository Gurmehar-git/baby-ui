"use client";

import { EMPTY_MENTIONS, MentionInput, serializeMentions } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { MENTION_CHANNELS, MENTION_PEOPLE } from "../data/mentions";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function MentionInputDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof MentionInput>>(props);
	const [value, setValue] = useState(EMPTY_MENTIONS);
	const [sent, setSent] = useState("");
	return (
		<div className="grid w-full max-w-md gap-2">
			<MentionInput
				value={value}
				onValueChange={setValue}
				people={MENTION_PEOPLE}
				channels={MENTION_CHANNELS}
				placeholder="Type @ to mention someone, # for a channel"
				submitOnEnter={p.submitOnEnter}
				onSubmit={(next) => {
					setSent(serializeMentions(next));
					setValue(EMPTY_MENTIONS);
				}}
				side={p.side}
				size={p.size}
			/>
			{sent && (
				<p className="truncate font-mono text-muted-foreground text-xs">Sent: {sent}</p>
			)}
		</div>
	);
}
