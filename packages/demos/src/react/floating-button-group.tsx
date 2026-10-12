"use client";

import { FloatingButtonGroup } from "@baby-ui/react";
import { type ComponentProps, type ReactNode, useEffect, useState } from "react";
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

export function FloatingButtonGroupDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof FloatingButtonGroup>>(props);
	const [copied, setCopied] = useState(false);
	const [presenting, setPresenting] = useState(false);
	useEffect(() => {
		if (!copied) return;
		const timer = setTimeout(() => setCopied(false), 1500);
		return () => clearTimeout(timer);
	}, [copied]);
	return (
		<FloatingButtonGroup
			label="Board actions"
			variant={p.variant}
			size={p.size}
			orientation={p.orientation}
			iconOnly={p.iconOnly}
			items={[
				{
					id: "undo",
					label: "Undo",
					shortcut: "⌘Z",
					iconOnly: true,
					icon: icon("M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3"),
				},
				{
					id: "redo",
					label: "Redo",
					shortcut: "⇧⌘Z",
					iconOnly: true,
					icon: icon("m15 14 5-5-5-5M20 9H9a5 5 0 0 0 0 10h3"),
				},
				{ type: "separator" },
				{
					id: "share",
					label: copied ? "Copied" : "Share",
					reserveLabels: ["Share", "Copied"],
					icon: icon(
						"M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7",
					),
					onSelect: () => setCopied(true),
				},
				{
					id: "present",
					label: "Present",
					pressed: presenting,
					icon: icon("M3 4h18v12H3zM8 20h8M12 16v4"),
					onSelect: () => setPresenting((value) => !value),
				},
			]}
		/>
	);
}
