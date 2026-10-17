<script lang="ts">
import { untrack } from "svelte";
import { cn } from "../../lib/cn";
import { flapColumns, flapRows, SPLIT_FLAP_CHARACTERS } from "../flap";
import {
	type SplitFlapIndicator,
	type SplitFlapSize,
	type SplitFlapVariant,
	splitFlap,
} from "../variants";
import SplitFlapCell from "./split-flap-cell.svelte";

let {
	value,
	columns = 24,
	variant = "solid",
	size = "default",
	indicator = "success",
	stepMs = 60,
	staggerMs = 30,
	characters = SPLIT_FLAP_CHARACTERS,
	class: className,
}: {
	/** Board text; `\n` starts a new row. Uppercased. */
	value: string;
	/** Cells per row; shorter rows pad with blanks, longer ones are cut. */
	columns?: number;
	variant?: SplitFlapVariant;
	size?: SplitFlapSize;
	/** Colour of the side strips; `none` hides them. */
	indicator?: SplitFlapIndicator;
	/** Time for one flap to fall, per character step. */
	stepMs?: number;
	/** Delay between neighbouring cells starting, for a wave. */
	staggerMs?: number;
	/** Drum order each cell flips through. */
	characters?: string;
	class?: string;
} = $props();

const styles = $derived(splitFlap({ variant, size, indicator }));
const rows = $derived(flapRows(value, columns));
const cols = $derived(flapColumns(columns));

// Rows and cells stay mounted once seen so shrinking can animate closed.
const initial = untrack(() => ({ rows: rows.length, cols }));
let seen = initial;
const extent = $derived.by(() => {
	seen = { rows: Math.max(seen.rows, rows.length), cols: Math.max(seen.cols, cols) };
	return seen;
});
</script>

<div data-slot="split-flap-display" class={cn(styles.root(), className)}>
	<span class="sr-only" aria-live="polite">{value}</span>
	<div
		aria-hidden="true"
		class={styles.board()}
		style="--split-flap-ms: {stepMs}ms; --split-flap-columns: {cols};"
	>
		{#each { length: extent.rows }, r (r)}
			<div
				class={styles.rowShell()}
				data-open={r < rows.length || undefined}
				data-enter={r >= initial.rows || undefined}
				inert={r >= rows.length}
			>
				<div class={styles.rowClip()}>
					<div class={styles.row()}>
						{#if indicator !== "none"}<span class={styles.indicator()}></span>{/if}
						<div class={styles.cells()}>
							{#each { length: extent.cols }, c (c)}
								<span
									class={styles.cellShell()}
									data-open={c < cols || undefined}
									data-enter={c >= initial.cols || undefined}
								>
									<span class={styles.cellClip()}>
										<SplitFlapCell
											char={rows[r]?.[c] ?? " "}
											delayMs={(c + r) * staggerMs}
											{stepMs}
											{characters}
											{styles}
										/>
									</span>
								</span>
							{/each}
						</div>
						{#if indicator !== "none"}<span class={styles.indicator()}></span>{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
