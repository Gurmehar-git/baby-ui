"use client";

import { ExpandableCard } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function ExpandableCardDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ExpandableCard>>(props);
	return (
		<ExpandableCard
			title={p.title || "Production deploy"}
			description={p.description || "Ready in 42s · 3 checks passed"}
			width={320}
			expandedWidth={440}
			variant={p.variant}
			size={p.size}
		>
			<dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5">
				<dt>Branch</dt>
				<dd className="text-foreground">main</dd>
				<dt>Commit</dt>
				<dd className="text-foreground tabular-nums">8f3c21a</dd>
				<dt>Region</dt>
				<dd className="text-foreground">Frankfurt, Virginia</dd>
			</dl>
		</ExpandableCard>
	);
}
