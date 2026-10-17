<script lang="ts">
import { cn } from "../../lib/cn";
import RollingDigits from "../../rolling-digits/svelte/rolling-digits.svelte";
import ToggleGroup from "../../toggle-group/svelte/toggle-group.svelte";
import ToggleGroupItem from "../../toggle-group/svelte/toggle-group-item.svelte";
import { CHANGELOG_KINDS, kindCount } from "../changelog";
import { changelogFeedState } from "./context";

let { label = "Filter by kind", class: classProp }: { label?: string; class?: string } =
	$props();
const feed = changelogFeedState();
</script>

<!-- New / Improved / Fixed chips with counts, and a rolling total of what is shown. -->
<div data-slot="changelog-feed-filters" class={cn(feed.styles.toolbar(), classProp)}>
	<ToggleGroup
		type="multiple"
		variant="chip"
		size="sm"
		{label}
		value={feed.kinds}
		onValueChange={feed.setKinds}
	>
		{#each CHANGELOG_KINDS as kind (kind.id)}
			<ToggleGroupItem value={kind.id}>
				{kind.label}
				<span class={feed.styles.filterCount()}>{kindCount(feed.entries, kind.id)}</span>
			</ToggleGroupItem>
		{/each}
	</ToggleGroup>
	<p class={feed.styles.count()} aria-live="polite">
		<RollingDigits value={feed.shown.length} startOnView={false} /> updates
	</p>
</div>
