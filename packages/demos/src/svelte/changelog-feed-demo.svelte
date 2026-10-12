<script lang="ts">
import { Button, ChangelogFeed } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { CHANGELOG_ENTRIES } from "../data/changelog";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ChangelogFeed>>(props));
</script>

<ChangelogFeed
	entries={CHANGELOG_ENTRIES}
	variant={p.variant}
	description="Version 4.12 shipped on September 18, 2026"
	endNote="That is everything since 4.5 in June."
	locale="en-US"
>
	{#snippet actions()}
		<Button variant="outline" size="sm" href="#subscribe">Subscribe</Button>
	{/snippet}
</ChangelogFeed>
