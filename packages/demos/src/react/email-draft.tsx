"use client";

import {
	Badge,
	EmailDraft,
	EmailDraftActions,
	EmailDraftAmount,
	EmailDraftAttachment,
	EmailDraftAuthor,
	EmailDraftContent,
	EmailDraftDescription,
	EmailDraftDiscard,
	EmailDraftEdit,
	EmailDraftFields,
	EmailDraftFooter,
	EmailDraftHeader,
	EmailDraftHint,
	EmailDraftMessage,
	EmailDraftOptions,
	EmailDraftPanel,
	EmailDraftReceipt,
	EmailDraftSend,
	EmailDraftState,
	type EmailDraftStatus,
	EmailDraftTitle,
	EmailDraftTo,
	EmailDraftTone,
	EmailDraftTones,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@baby-ui/react";
import { type ComponentProps, useEffect, useState } from "react";
import { EMAIL_DRAFT_CONTACTS, EMAIL_DRAFT_TONES } from "../data/email-draft";
import { controlProps } from "../data/preview-props";

const FILE = "Renewal-quote.pdf";

export function EmailDraftDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof EmailDraft>>(props);
	const [status, setStatus] = useState<EmailDraftStatus>("draft");
	const [to, setTo] = useState(EMAIL_DRAFT_CONTACTS[0]?.email ?? "");
	const [tone, setTone] = useState("friendly");
	const [edited, setEdited] = useState<string | null>(null);
	const [attached, setAttached] = useState(true);
	const contact =
		EMAIL_DRAFT_CONTACTS.find((c) => c.email === to) ?? EMAIL_DRAFT_CONTACTS[0];

	// A picked tone writes the text for the current recipient; a hand edit wins until the next pick.
	const toneText = contact
		? EMAIL_DRAFT_TONES.find((t) => t.value === tone)?.text(contact)
		: "";
	const text = edited ?? toneText ?? "";

	// The demo stands in for a mail server: the send lands after a beat.
	useEffect(() => {
		if (status !== "sending") return;
		const timer = setTimeout(() => setStatus("sent"), 900);
		return () => clearTimeout(timer);
	}, [status]);

	return (
		<EmailDraft
			variant={p.variant}
			status={status}
			onSend={() => setStatus("sending")}
			onDiscard={() => setStatus("discarded")}
			onUndo={() => setStatus("draft")}
		>
			<EmailDraftHeader>
				<EmailDraftTitle>SUB-1182</EmailDraftTitle>
				<Badge variant="warning">Renews in 5 days</Badge>
				<EmailDraftAmount>$8,900</EmailDraftAmount>
				<EmailDraftDescription>Northwind Logistics</EmailDraftDescription>
			</EmailDraftHeader>
			<EmailDraftPanel>
				<EmailDraftContent>
					<EmailDraftFields>
						<EmailDraftTo>
							<Select
								value={to}
								onValueChange={setTo}
								items={EMAIL_DRAFT_CONTACTS.map((c) => ({
									value: c.email,
									label: c.name,
								}))}
							>
								<SelectTrigger variant="ghost" size="sm" aria-label="Recipient">
									<SelectValue />
								</SelectTrigger>
								<SelectContent align="start">
									{EMAIL_DRAFT_CONTACTS.map((c) => (
										<SelectItem key={c.email} value={c.email}>
											{c.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</EmailDraftTo>
						<EmailDraftAttachment
							name={FILE}
							attached={attached}
							onAttachedChange={setAttached}
						/>
					</EmailDraftFields>
					<EmailDraftMessage
						value={text}
						onValueChange={(next) => {
							setEdited(next);
							setTone("");
						}}
					>
						<a href="#quote">Review quote</a>
					</EmailDraftMessage>
					<EmailDraftOptions>
						<EmailDraftTones
							value={tone}
							onValueChange={(next) => {
								setEdited(next ? null : text);
								setTone(next);
							}}
						>
							{EMAIL_DRAFT_TONES.map((t) => (
								<EmailDraftTone key={t.value} value={t.value}>
									{t.label}
								</EmailDraftTone>
							))}
						</EmailDraftTones>
						<EmailDraftEdit />
						<EmailDraftHint />
					</EmailDraftOptions>
				</EmailDraftContent>
				<EmailDraftReceipt>
					{status === "sent" ? (
						<>
							Sent to <b>{contact?.name}</b>
							{attached ? ` with ${FILE}` : ""}
						</>
					) : (
						"Draft discarded"
					)}
				</EmailDraftReceipt>
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
