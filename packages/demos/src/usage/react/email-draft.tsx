"use client";

import {
	EmailDraft,
	EmailDraftActions,
	EmailDraftAuthor,
	EmailDraftContent,
	EmailDraftDiscard,
	EmailDraftEdit,
	EmailDraftFields,
	EmailDraftFooter,
	EmailDraftHeader,
	EmailDraftMessage,
	EmailDraftOptions,
	EmailDraftPanel,
	EmailDraftReceipt,
	EmailDraftSend,
	EmailDraftState,
	type EmailDraftStatus,
	EmailDraftTitle,
	EmailDraftTo,
} from "@baby-ui/react";
import { useState } from "react";

export function Example() {
	const [status, setStatus] = useState<EmailDraftStatus>("draft");
	const [text, setText] = useState("Hi Jonas, your plan renews on October 9.");
	return (
		<EmailDraft
			status={status}
			onSend={() => setStatus("sent")}
			onDiscard={() => setStatus("discarded")}
			onUndo={() => setStatus("draft")}
		>
			<EmailDraftHeader>
				<EmailDraftTitle>SUB-1182</EmailDraftTitle>
			</EmailDraftHeader>
			<EmailDraftPanel>
				<EmailDraftContent>
					<EmailDraftFields>
						<EmailDraftTo>Jonas Weber</EmailDraftTo>
					</EmailDraftFields>
					<EmailDraftMessage value={text} onValueChange={setText} />
					<EmailDraftOptions>
						<EmailDraftEdit />
					</EmailDraftOptions>
				</EmailDraftContent>
				<EmailDraftReceipt />
				<EmailDraftFooter>
					<EmailDraftAuthor>Renewal agent</EmailDraftAuthor>
					<EmailDraftState />
					<EmailDraftActions>
						<EmailDraftDiscard />
						<EmailDraftSend />
					</EmailDraftActions>
				</EmailDraftFooter>
			</EmailDraftPanel>
		</EmailDraft>
	);
}
