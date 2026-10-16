<script lang="ts">
import type { Snippet } from "svelte";
import Collapsible from "../../collapsible/svelte/collapsible.svelte";
import CollapsibleContent from "../../collapsible/svelte/collapsible-content.svelte";
import CollapsibleTrigger from "../../collapsible/svelte/collapsible-trigger.svelte";
import { reasoningExtras } from "./variants";

let {
	summary,
	children,
	open = $bindable(false),
	class: classProp,
}: {
	summary: string;
	children?: Snippet;
	/** Bindable open state. */
	open?: boolean;
	class?: string;
} = $props();

const styles = reasoningExtras();
</script>

<Collapsible bind:open class={classProp}>
	<CollapsibleTrigger class={styles.detailsTrigger()}>{summary}</CollapsibleTrigger>
	<CollapsibleContent class={styles.detailsContent()}>{@render children?.()}</CollapsibleContent>
</Collapsible>
