"use client";

import { ExpandingSearch } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { WORKSPACE_ITEMS, WORKSPACE_RECENT } from "../data/expanding-search";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function ExpandingSearchDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ExpandingSearch>>(props);
	const [picked, setPicked] = useState("");
	return (
		<div className="flex w-full max-w-md flex-col gap-3">
			<ExpandingSearch
				label="Search projects and docs"
				items={WORKSPACE_ITEMS}
				suggestions={WORKSPACE_RECENT}
				variant={p.variant}
				size={p.size}
				anchor={p.anchor}
				onSelect={(item) => setPicked(item.title)}
			/>
			<p className="h-4 text-muted-foreground text-xs">{picked && `Opened ${picked}`}</p>
		</div>
	);
}
