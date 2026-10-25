<script lang="ts">
import {
	TipsPanel,
	TipsPanelAction,
	TipsPanelContent,
	TipsPanelGrid,
	TipsPanelHeader,
	TipsPanelProgress,
	TipsPanelTip,
	TipsPanelTipDescription,
	TipsPanelTipTitle,
	TipsPanelTitle,
} from "@baby-ui/svelte";

let done = $state<string[]>([]);
</script>

<TipsPanel bind:value={done}>
	<TipsPanelHeader>
		<TipsPanelTitle>Tips</TipsPanelTitle>
		<TipsPanelProgress />
	</TipsPanelHeader>
	<TipsPanelContent>
		<TipsPanelGrid>
			<TipsPanelTip value="invite">
				<TipsPanelTipTitle>Invite your team</TipsPanelTipTitle>
				<TipsPanelTipDescription>Work on projects together in one place.</TipsPanelTipDescription>
				<TipsPanelAction doneLabel="Invited">Invite</TipsPanelAction>
			</TipsPanelTip>
			<TipsPanelTip value="digest">
				<TipsPanelTipTitle>Weekly digest</TipsPanelTipTitle>
				<TipsPanelTipDescription>A short summary every Monday morning.</TipsPanelTipDescription>
				<TipsPanelAction primary doneLabel="On">Turn on</TipsPanelAction>
			</TipsPanelTip>
		</TipsPanelGrid>
	</TipsPanelContent>
</TipsPanel>
