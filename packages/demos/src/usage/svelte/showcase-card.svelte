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
</script>

<ShowcaseCard variant="morphing" class="h-72 w-full max-w-md">
	<ShowcaseCardPreview class="grid place-items-center bg-card p-8">
		<div class="w-full max-w-xs rounded-xl border bg-background p-4 shadow-surface">
			<div class="h-2 w-20 rounded-full bg-muted"></div>
			<div class="mt-5 grid grid-cols-3 gap-2">
				<div class="h-16 rounded-lg bg-muted"></div>
				<div class="h-16 rounded-lg bg-primary/12"></div>
				<div class="h-16 rounded-lg bg-muted"></div>
			</div>
		</div>
	</ShowcaseCardPreview>
	<ShowcaseCardLink href="/projects/atlas" aria-label="View Atlas overview" />
	<ShowcaseCardFooter>
		<ShowcaseCardCopy>
			<ShowcaseCardTitle>Atlas overview</ShowcaseCardTitle>
			<ShowcaseCardDescription>
				Metrics, activity and status in one screen.
			</ShowcaseCardDescription>
		</ShowcaseCardCopy>
	</ShowcaseCardFooter>
</ShowcaseCard>
