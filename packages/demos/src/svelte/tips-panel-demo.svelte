<script lang="ts">
import {
	Button,
	TipsPanel,
	TipsPanelAction,
	TipsPanelContent,
	TipsPanelFooter,
	TipsPanelGrid,
	TipsPanelHeader,
	TipsPanelProgress,
	TipsPanelTip,
	TipsPanelTipDescription,
	TipsPanelTipTitle,
	TipsPanelTitle,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { TIPS_PANEL_TIPS } from "../data/tips-panel";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof TipsPanel>>(props));
let done = $state<string[]>([]);
</script>

<TipsPanel variant={p.variant} bind:value={done}>
	<TipsPanelHeader>
		<TipsPanelTitle>Tips</TipsPanelTitle>
		<TipsPanelProgress />
	</TipsPanelHeader>
	<TipsPanelContent>
		<TipsPanelGrid>
			{#each TIPS_PANEL_TIPS as tip (tip.id)}
				<TipsPanelTip value={tip.id}>
					<TipsPanelTipTitle>{tip.title}</TipsPanelTipTitle>
					<TipsPanelTipDescription>{tip.description}</TipsPanelTipDescription>
					<TipsPanelAction primary={tip.primary} doneLabel={tip.doneLabel}>{tip.action}</TipsPanelAction>
				</TipsPanelTip>
			{/each}
		</TipsPanelGrid>
	</TipsPanelContent>
	<TipsPanelFooter>
		<Button variant="ghost" size="sm" disabled={done.length === 0} onclick={() => (done = [])}>Reset</Button>
	</TipsPanelFooter>
</TipsPanel>
