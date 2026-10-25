"use client";

import {
	MessageActions,
	MessageActionsBar,
	MessageActionsCopy,
	MessageActionsFeedback,
	MessageActionsFeedbackPanel,
	MessageActionsRegenerate,
	type MessageFeedback,
} from "@baby-ui/react";
import { useState } from "react";

const reply = "Lisbon in May is mild: about 22°C by day. Bring a light jacket.";

export function Example() {
	const [feedback, setFeedback] = useState<MessageFeedback | null>(null);
	return (
		<div className="group/message flex flex-col gap-2">
			<p className="text-sm">{reply}</p>
			<MessageActions feedback={feedback} onFeedbackChange={setFeedback}>
				<MessageActionsBar>
					<MessageActionsCopy text={reply} />
					<MessageActionsRegenerate />
					<MessageActionsFeedback />
				</MessageActionsBar>
				<MessageActionsFeedbackPanel reasons={["Not accurate", "Too long", "Other"]} />
			</MessageActions>
		</div>
	);
}
