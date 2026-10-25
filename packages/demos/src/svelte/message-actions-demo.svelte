<script lang="ts">
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
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import {
	MESSAGE_ACTIONS_REASONS,
	MESSAGE_ACTIONS_VERSIONS,
} from "../data/message-actions";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof MessageActions>>(props));
let feedback = $state<MessageFeedback | null>(null);
let count = $state(1);
let version = $state(0);
let writing = $state(false);
let speaking = $state(false);

// The demo stands in for a model: a new version lands after a beat.
$effect(() => {
	if (!writing) return;
	const timer = setTimeout(() => {
		writing = false;
		count = 2;
		version = 1;
	}, 1200);
	return () => clearTimeout(timer);
});
</script>

<div class="group/message flex w-full max-w-120 flex-col gap-2">
	<p class="text-pretty text-foreground text-sm leading-relaxed">{MESSAGE_ACTIONS_VERSIONS[version]}</p>
	<MessageActions variant={p.variant} bind:feedback>
		<MessageActionsBar>
			<MessageActionsCopy text={MESSAGE_ACTIONS_VERSIONS[version] ?? ""} />
			<MessageActionsRegenerate
				loading={writing}
				onclick={() => {
					if (count < 2) writing = true;
				}}
			/>
			<MessageActionsVersions bind:value={version} {count} />
			<MessageActionsFeedback />
			<MessageActionsSpeak bind:pressed={speaking} />
		</MessageActionsBar>
		<MessageActionsFeedbackPanel reasons={MESSAGE_ACTIONS_REASONS} />
	</MessageActions>
</div>
