"use client";

import {
	MessageActions,
	MessageActionsBar,
	MessageActionsCopy,
	MessageActionsFeedback,
	MessageActionsFeedbackPanel,
	MessageActionsRegenerate,
	MessageActionsSpeak,
	MessageActionsVersions,
	type MessageFeedback,
} from "@baby-ui/react";
import { type ComponentProps, useEffect, useState } from "react";
import {
	MESSAGE_ACTIONS_REASONS,
	MESSAGE_ACTIONS_VERSIONS,
} from "../data/message-actions";
import { controlProps } from "../data/preview-props";

export function MessageActionsDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof MessageActions>>(props);
	const [feedback, setFeedback] = useState<MessageFeedback | null>(null);
	const [count, setCount] = useState(1);
	const [version, setVersion] = useState(0);
	const [writing, setWriting] = useState(false);
	const [speaking, setSpeaking] = useState(false);

	// The demo stands in for a model: a new version lands after a beat.
	useEffect(() => {
		if (!writing) return;
		const timer = setTimeout(() => {
			setWriting(false);
			setCount(2);
			setVersion(1);
		}, 1200);
		return () => clearTimeout(timer);
	}, [writing]);

	return (
		<div className="group/message flex w-full max-w-120 flex-col gap-2">
			<p className="text-pretty text-foreground text-sm leading-relaxed">
				{MESSAGE_ACTIONS_VERSIONS[version]}
			</p>
			<MessageActions
				variant={p.variant}
				feedback={feedback}
				onFeedbackChange={setFeedback}
			>
				<MessageActionsBar>
					<MessageActionsCopy text={MESSAGE_ACTIONS_VERSIONS[version] ?? ""} />
					<MessageActionsRegenerate
						loading={writing}
						onClick={() => count < 2 && setWriting(true)}
					/>
					<MessageActionsVersions
						value={version}
						count={count}
						onValueChange={setVersion}
					/>
					<MessageActionsFeedback />
					<MessageActionsSpeak pressed={speaking} onPressedChange={setSpeaking} />
				</MessageActionsBar>
				<MessageActionsFeedbackPanel reasons={MESSAGE_ACTIONS_REASONS} />
			</MessageActions>
		</div>
	);
}
