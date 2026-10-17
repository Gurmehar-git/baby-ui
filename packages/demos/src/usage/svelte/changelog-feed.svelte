<script lang="ts">
import {
	ChangelogFeed,
	ChangelogFeedFilters,
	ChangelogFeedHeader,
	ChangelogFeedList,
	ChangelogFeedTitle,
} from "@baby-ui/svelte";
</script>

<ChangelogFeed
	variant="timeline"
	entries={[
		{
			id: "dark-mode",
			date: "2026-10-01",
			version: "2.4.0",
			kind: "new",
			title: "Dark mode",
			summary: "Follows your system setting, or pick one in preferences.",
		},
		{
			id: "export",
			date: "2026-09-12",
			version: "2.3.1",
			kind: "fixed",
			title: "CSV export keeps accents",
			summary: "Names like Zoë now open correctly in every spreadsheet app.",
		},
	]}
>
	<ChangelogFeedHeader>
		<ChangelogFeedTitle>Changelog</ChangelogFeedTitle>
	</ChangelogFeedHeader>
	<ChangelogFeedFilters />
	<ChangelogFeedList />
</ChangelogFeed>
