<script lang="ts">
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
} from "@baby-ui/svelte";

let status = $state<EmailDraftStatus>("draft");
let text = $state("Hi Jonas, your plan renews on October 9.");
</script>

<EmailDraft
	{status}
	onSend={() => (status = "sent")}
	onDiscard={() => (status = "discarded")}
	onUndo={() => (status = "draft")}
>
	<EmailDraftHeader>
		<EmailDraftTitle>SUB-1182</EmailDraftTitle>
	</EmailDraftHeader>
	<EmailDraftPanel>
		<EmailDraftContent>
			<EmailDraftFields>
				<EmailDraftTo>Jonas Weber</EmailDraftTo>
			</EmailDraftFields>
			<EmailDraftMessage bind:value={text} />
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
