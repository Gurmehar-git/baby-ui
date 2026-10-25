<script lang="ts">
import {
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

let answers = $state<Record<string, string>>({});
</script>

<DecisionInbox bind:value={answers}>
	<DecisionInboxHeader />
	<DecisionInboxList>
		<DecisionInboxItem value="refund">
			<DecisionInboxTitle>Refund order #4821?</DecisionInboxTitle>
			<DecisionInboxBody>
				<DecisionInboxDetail>The parcel never arrived.</DecisionInboxDetail>
				<DecisionInboxActions>
					<DecisionInboxAction value="Refunded" primary>Refund</DecisionInboxAction>
					<DecisionInboxAction value="Declined">Decline</DecisionInboxAction>
				</DecisionInboxActions>
			</DecisionInboxBody>
		</DecisionInboxItem>
	</DecisionInboxList>
	<DecisionInboxEmpty>Nothing waiting on you.</DecisionInboxEmpty>
</DecisionInbox>
