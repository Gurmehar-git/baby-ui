<script lang="ts">
import Badge from "../../badge/svelte/badge.svelte";
import { cn } from "../../lib/cn";
import type { EmailDraftStatus } from "../variants";
import { emailDraftState } from "./context";

let {
	labels = {
		draft: "Ready for review",
		sending: "Sending",
		sent: "Sent",
		discarded: "Discarded",
	},
	class: classProp,
}: { labels?: Record<EmailDraftStatus, string>; class?: string } = $props();
const ctx = emailDraftState("EmailDraftState");
</script>

<!-- A Badge that follows the status. -->
<Badge data-slot="email-draft-state" variant={ctx.status === "discarded" ? "secondary" : "success"} class={cn("shrink-0", classProp)}>
	{labels[ctx.status]}
</Badge>
