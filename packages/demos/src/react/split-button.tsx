"use client";

import {
	SplitButton,
	SplitButtonAction,
	SplitButtonContent,
	SplitButtonItem,
	SplitButtonMenu,
	SplitButtonTrigger,
} from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function SplitButtonDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof SplitButton>>(props);
	const [last, setLast] = useState("");
	return (
		<div className="flex flex-col items-center gap-3">
			<SplitButton variant={p.variant} size={p.size}>
				<SplitButtonAction onClick={() => setLast("Merged")}>Merge</SplitButtonAction>
				<SplitButtonMenu>
					<SplitButtonTrigger />
					<SplitButtonContent>
						<SplitButtonItem onClick={() => setLast("Squashed and merged")}>
							Squash and merge
						</SplitButtonItem>
						<SplitButtonItem onClick={() => setLast("Rebased and merged")}>
							Rebase and merge
						</SplitButtonItem>
						<SplitButtonItem destructive onClick={() => setLast("Closed")}>
							Close pull request
						</SplitButtonItem>
					</SplitButtonContent>
				</SplitButtonMenu>
			</SplitButton>
			<p className="h-4 text-muted-foreground text-xs">{last}</p>
		</div>
	);
}
