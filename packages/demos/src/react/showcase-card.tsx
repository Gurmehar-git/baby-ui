"use client";

import {
	ShowcaseCard,
	ShowcaseCardCopy,
	ShowcaseCardDescription,
	ShowcaseCardFooter,
	ShowcaseCardLink,
	ShowcaseCardPreview,
	ShowcaseCardTitle,
} from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function ShowcaseCardDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ShowcaseCard>>(props);
	return (
		<ShowcaseCard variant={p.variant} size={p.size} className="h-72 w-full max-w-md">
			<ShowcaseCardPreview className="grid place-items-center bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] p-8">
				<div className="w-full max-w-xs rounded-xl border border-border bg-background p-3 shadow-surface">
					<div className="h-2 w-20 rounded-full bg-muted" />
					<div className="mt-5 grid grid-cols-3 gap-2">
						<div className="h-16 rounded-lg bg-card" />
						<div className="h-16 rounded-lg bg-primary/12" />
						<div className="h-16 rounded-lg bg-card" />
					</div>
				</div>
			</ShowcaseCardPreview>
			<ShowcaseCardLink href="#showcase-card" aria-label="View Project overview" />
			<ShowcaseCardFooter>
				<ShowcaseCardCopy>
					<ShowcaseCardTitle>Project overview</ShowcaseCardTitle>
					<ShowcaseCardDescription>
						Metrics, activity and status in one screen.
					</ShowcaseCardDescription>
				</ShowcaseCardCopy>
			</ShowcaseCardFooter>
		</ShowcaseCard>
	);
}
