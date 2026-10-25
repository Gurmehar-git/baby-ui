"use client";

import { DocsNav } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { DOCS_SECTIONS } from "../data/docs-nav";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function DocsNavDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof DocsNav>>(props);
	const [current, setCurrent] = useState("#installation");
	return (
		<div className="w-64 max-w-full">
			<DocsNav
				sections={DOCS_SECTIONS}
				current={current}
				variant={p.variant ?? "default"}
				connector={p.connector ?? "tick"}
				rungs={p.rungs ?? false}
				onNavigate={(href, event) => {
					event.preventDefault();
					setCurrent(href);
				}}
			/>
		</div>
	);
}
