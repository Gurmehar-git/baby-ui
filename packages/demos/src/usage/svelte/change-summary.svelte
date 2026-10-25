<script lang="ts">
import {
	ChangeSummary,
	ChangeSummaryChange,
	ChangeSummaryHeader,
	ChangeSummaryItem,
	ChangeSummaryLabel,
	ChangeSummaryList,
	ChangeSummaryPeriod,
	ChangeSummaryTitle,
} from "@baby-ui/svelte";
</script>

<ChangeSummary>
	<ChangeSummaryHeader>
		<ChangeSummaryTitle>What's changed</ChangeSummaryTitle>
		<ChangeSummaryPeriod>This week</ChangeSummaryPeriod>
	</ChangeSummaryHeader>
	<ChangeSummaryList>
		<ChangeSummaryItem tone="positive">
			<ChangeSummaryLabel>Active users</ChangeSummaryLabel>
			<ChangeSummaryChange>Up 6.1% to 18.2K</ChangeSummaryChange>
		</ChangeSummaryItem>
		<ChangeSummaryItem tone="positive" direction="down">
			<ChangeSummaryLabel>Churn</ChangeSummaryLabel>
			<ChangeSummaryChange>Down 0.3 points to 1.8%</ChangeSummaryChange>
		</ChangeSummaryItem>
	</ChangeSummaryList>
</ChangeSummary>
