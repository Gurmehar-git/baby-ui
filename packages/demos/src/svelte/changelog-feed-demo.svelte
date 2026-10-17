<script lang="ts">
import {
	Button,
	ChangelogFeed,
	ChangelogFeedDescription,
	ChangelogFeedEmpty,
	ChangelogFeedEnd,
	ChangelogFeedFilters,
	ChangelogFeedHeader,
	ChangelogFeedHeading,
	ChangelogFeedList,
	ChangelogFeedTitle,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { CHANGELOG_ENTRIES } from "../data/changelog";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ChangelogFeed>>(props));
</script>

<ChangelogFeed entries={CHANGELOG_ENTRIES} variant={p.variant} locale="en-US">
	<ChangelogFeedHeader>
		<ChangelogFeedHeading>
			<ChangelogFeedTitle>Changelog</ChangelogFeedTitle>
			<ChangelogFeedDescription>Version 4.12 shipped on September 18, 2026</ChangelogFeedDescription>
		</ChangelogFeedHeading>
		<Button variant="outline" size="sm" href="#subscribe">Subscribe</Button>
	</ChangelogFeedHeader>
	<ChangelogFeedFilters />
	<ChangelogFeedList />
	<ChangelogFeedEmpty />
	<ChangelogFeedEnd>That is everything since 4.5 in June.</ChangelogFeedEnd>
</ChangelogFeed>
