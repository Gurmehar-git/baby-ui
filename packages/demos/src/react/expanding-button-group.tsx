"use client";

import { ExpandingButtonGroup } from "@baby-ui/react";
import type { ComponentProps, ReactNode } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

const icon = (d: string): ReactNode => (
	<svg
		aria-hidden
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={1.75}
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d={d} />
	</svg>
);
const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 600));

const ITEMS = [
	{
		id: "reply",
		label: "Reply",
		icon: icon("M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11"),
	},
	{
		id: "archive",
		label: "Archive",
		doneLabel: "Archived",
		onSelect: wait,
		icon: icon("M3 4h18v4H3zM5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4"),
	},
	{
		id: "pin",
		label: "Pin",
		doneLabel: "Pinned",
		icon: icon("M12 17v5M9 3h6l-1 7 4 3H6l4-3z"),
	},
	{
		id: "delete",
		label: "Delete",
		doneLabel: "Deleted",
		variant: "destructive" as const,
		icon: icon("M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"),
	},
];

export function ExpandingButtonGroupDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ExpandingButtonGroup>>(props);
	return (
		<ExpandingButtonGroup
			label="Message actions"
			items={ITEMS}
			variant={p.variant}
			size={p.size}
		/>
	);
}
