<script lang="ts">
import {
	MessageActions,
	MessageActionsBar,
	MessageActionsCopy,
	MessageActionsFeedback,
	MessageActionsFeedbackPanel,
	MessageActionsRegenerate,
	type MessageFeedback,
} from "@baby-ui/svelte";

const reply = "Lisbon in May is mild: about 22°C by day. Bring a light jacket.";
let feedback = $state<MessageFeedback | null>(null);
</script>

<div class="group/message flex flex-col gap-2">
	<p class="text-sm">{reply}</p>
	<MessageActions bind:feedback>
		<MessageActionsBar>
			<MessageActionsCopy text={reply} />
			<MessageActionsRegenerate />
			<MessageActionsFeedback />
		</MessageActionsBar>
		<MessageActionsFeedbackPanel reasons={["Not accurate", "Too long", "Other"]} />
	</MessageActions>
</div>
