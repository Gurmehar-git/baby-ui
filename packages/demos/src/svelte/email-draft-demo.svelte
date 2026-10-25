<script lang="ts">
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
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { EMAIL_DRAFT_CONTACTS, EMAIL_DRAFT_TONES } from "../data/email-draft";
import { controlProps } from "../data/preview-props";

const FILE = "Renewal-quote.pdf";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof EmailDraft>>(props));
let status = $state<EmailDraftStatus>("draft");
let to = $state(EMAIL_DRAFT_CONTACTS[0]?.email ?? "");
let tone = $state("friendly");
let edited = $state<string | null>(null);
let attached = $state(true);
const contact = $derived(
	EMAIL_DRAFT_CONTACTS.find((c) => c.email === to) ?? EMAIL_DRAFT_CONTACTS[0],
);

// A picked tone writes the text for the current recipient; a hand edit wins until the next pick.
const toneText = $derived(
	contact ? EMAIL_DRAFT_TONES.find((t) => t.value === tone)?.text(contact) : "",
);
const text = $derived(edited ?? toneText ?? "");

// The demo stands in for a mail server: the send lands after a beat.
$effect(() => {
	if (status !== "sending") return;
	const timer = setTimeout(() => {
		status = "sent";
	}, 900);
	return () => clearTimeout(timer);
});
</script>

<EmailDraft
	variant={p.variant}
	{status}
	onSend={() => (status = "sending")}
	onDiscard={() => (status = "discarded")}
	onUndo={() => (status = "draft")}
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
					<Select bind:value={to} items={EMAIL_DRAFT_CONTACTS.map((c) => ({ value: c.email, label: c.name }))}>
						<SelectTrigger variant="ghost" size="sm" aria-label="Recipient">
							<SelectValue />
						</SelectTrigger>
						<SelectContent align="start">
							{#each EMAIL_DRAFT_CONTACTS as c (c.email)}
								<SelectItem value={c.email} label={c.name}>{c.name}</SelectItem>
							{/each}
						</SelectContent>
					</Select>
				</EmailDraftTo>
				<EmailDraftAttachment name={FILE} bind:attached />
			</EmailDraftFields>
			<EmailDraftMessage
				value={text}
				onValueChange={(next) => {
					edited = next;
					tone = "";
				}}
			>
				<a href="#quote">Review quote</a>
			</EmailDraftMessage>
			<EmailDraftOptions>
				<EmailDraftTones
					value={tone}
					onValueChange={(next) => {
						edited = next ? null : text;
						tone = next;
					}}
				>
					{#each EMAIL_DRAFT_TONES as t (t.value)}
						<EmailDraftTone value={t.value}>{t.label}</EmailDraftTone>
					{/each}
				</EmailDraftTones>
				<EmailDraftEdit />
				<EmailDraftHint />
			</EmailDraftOptions>
		</EmailDraftContent>
		<EmailDraftReceipt>
			{#if status === "sent"}
				Sent to <b>{contact?.name}</b>{attached ? ` with ${FILE}` : ""}
			{:else}
				Draft discarded
			{/if}
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
