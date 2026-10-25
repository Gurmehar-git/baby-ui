<script lang="ts">
import {
	ShowcaseCard,
	ShowcaseCardCopy,
	ShowcaseCardDescription,
	ShowcaseCardFooter,
	ShowcaseCardLink,
	ShowcaseCardPreview,
	ShowcaseCardTitle,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ShowcaseCard>>(props));
</script>

<ShowcaseCard variant={p.variant} size={p.size} class="h-72 w-full max-w-md">
	<ShowcaseCardPreview class="grid place-items-center bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] p-8">
		<div class="w-full max-w-xs rounded-xl border border-border bg-background p-3 shadow-surface">
			<div class="h-2 w-20 rounded-full bg-muted"></div>
			<div class="mt-5 grid grid-cols-3 gap-2">
				<div class="h-16 rounded-lg bg-card"></div>
				<div class="h-16 rounded-lg bg-primary/12"></div>
				<div class="h-16 rounded-lg bg-card"></div>
			</div>
		</div>
	</ShowcaseCardPreview>
	<ShowcaseCardLink href="#showcase-card" aria-label="View Project overview" />
	<ShowcaseCardFooter>
		<ShowcaseCardCopy>
			<ShowcaseCardTitle>Project overview</ShowcaseCardTitle>
			<ShowcaseCardDescription>Metrics, activity and status in one screen.</ShowcaseCardDescription>
		</ShowcaseCardCopy>
	</ShowcaseCardFooter>
</ShowcaseCard>
