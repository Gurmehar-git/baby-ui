"use client";

import { SplitButton } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function SplitButtonDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof SplitButton>>(props);
	const [last, setLast] = useState("");
	return (
		<div className="flex flex-col items-center gap-3">
			<SplitButton
				label={p.label || "Merge"}
				variant={p.variant}
				size={p.size}
				onClick={() => setLast("Merged")}
				actions={[
					{ label: "Squash and merge", onSelect: () => setLast("Squashed and merged") },
					{ label: "Rebase and merge", onSelect: () => setLast("Rebased and merged") },
					{
						label: "Close pull request",
						destructive: true,
						onSelect: () => setLast("Closed"),
					},
				]}
			/>
			<p className="h-4 text-muted-foreground text-xs">{last}</p>
		</div>
	);
}
