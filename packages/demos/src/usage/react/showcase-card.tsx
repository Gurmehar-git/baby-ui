import {
	ShowcaseCard,
	ShowcaseCardCopy,
	ShowcaseCardDescription,
	ShowcaseCardFooter,
	ShowcaseCardLink,
	ShowcaseCardPreview,
	ShowcaseCardTitle,
} from "@baby-ui/react";

export function Example() {
	return (
		<ShowcaseCard variant="morphing" className="h-72 w-full max-w-md">
			<ShowcaseCardPreview className="grid place-items-center bg-card p-8">
				<div className="w-full max-w-xs rounded-xl border bg-background p-4 shadow-surface">
					<div className="h-2 w-20 rounded-full bg-muted" />
					<div className="mt-5 grid grid-cols-3 gap-2">
						<div className="h-16 rounded-lg bg-muted" />
						<div className="h-16 rounded-lg bg-primary/12" />
						<div className="h-16 rounded-lg bg-muted" />
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
	);
}
