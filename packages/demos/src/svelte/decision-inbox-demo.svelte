<script lang="ts">
import {
	Button,
	DecisionInbox,
	DecisionInboxAction,
	DecisionInboxActions,
	DecisionInboxBody,
	DecisionInboxDetail,
	DecisionInboxEmpty,
	DecisionInboxHeader,
	DecisionInboxItem,
	DecisionInboxList,
	DecisionInboxTitle,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import {
	DECISION_INBOX_COLLAPSED,
	DECISION_INBOX_DECISIONS,
} from "../data/decision-inbox";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof DecisionInbox>>(props));
let answers = $state<Record<string, string>>({});
let collapsed = $state([...DECISION_INBOX_COLLAPSED]);
</script>

<div class="flex w-full max-w-110 flex-col items-center gap-3">
	<DecisionInbox variant={p.variant} bind:value={answers} bind:collapsed>
		<DecisionInboxHeader />
		<DecisionInboxList>
			{#each DECISION_INBOX_DECISIONS as d (d.id)}
				<DecisionInboxItem value={d.id}>
					<DecisionInboxTitle>{d.title}</DecisionInboxTitle>
					<DecisionInboxBody>
						{#if d.detail}<DecisionInboxDetail>{d.detail}</DecisionInboxDetail>{/if}
						<DecisionInboxActions>
							<DecisionInboxAction value={d.primary.value} primary>{d.primary.label}</DecisionInboxAction>
							<DecisionInboxAction value={d.secondary.value}>{d.secondary.label}</DecisionInboxAction>
						</DecisionInboxActions>
					</DecisionInboxBody>
				</DecisionInboxItem>
			{/each}
		</DecisionInboxList>
		<DecisionInboxEmpty>Nothing waiting on you. New decisions show up here.</DecisionInboxEmpty>
	</DecisionInbox>
	<Button
		variant="ghost"
		size="sm"
		disabled={Object.keys(answers).length === 0}
		onclick={() => {
			answers = {};
			collapsed = [...DECISION_INBOX_COLLAPSED];
		}}
	>
		Reset
	</Button>
</div>
