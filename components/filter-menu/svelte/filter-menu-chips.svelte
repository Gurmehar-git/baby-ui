<script lang="ts">
import Badge from "../../badge/svelte/badge.svelte";
import { cn } from "../../lib/cn";
import { filterChips, toggleFilter } from "../filters";
import { filterMenuState } from "./context";

let {
	removeLabel = (chip: string) => `Remove ${chip}`,
	class: classProp,
}: { removeLabel?: (chip: string) => string; class?: string } = $props();
const ctx = filterMenuState("FilterMenuChips");
const chips = $derived(filterChips(ctx.groups, ctx.value));
</script>

<!-- The picked filters as removable chips; the row folds open with the first pick. -->
<div data-slot="filter-menu-chips" data-shown={chips.length > 0 || undefined} class={cn(ctx.styles.chips(), classProp)}>
	<div class={ctx.styles.chipsClip()}>
		<div class={ctx.styles.chipList()} aria-live="polite">
			{#each chips as chip (`${chip.group}:${chip.option}`)}
				<Badge variant="secondary" class={ctx.styles.chip()}>
					{chip.label}
					<button
						type="button"
						aria-label={removeLabel(chip.label)}
						class={ctx.styles.chipRemove()}
						onclick={() => ctx.setValue(toggleFilter(ctx.value, chip.group, chip.option, false))}
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
							<path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
						</svg>
					</button>
				</Badge>
			{/each}
		</div>
	</div>
</div>
