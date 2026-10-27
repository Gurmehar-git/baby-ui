"use client";

import { TableOfContents } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";
import { TOC_ARTICLE, TOC_ITEMS } from "../data/table-of-contents";

type Props = Record<string, unknown>;

export function TableOfContentsDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof TableOfContents>>(props);
	const [scroller, setScroller] = useState<HTMLElement | null>(null);
	return (
		<div className="flex w-full max-w-2xl gap-6">
			<section
				ref={setScroller}
				aria-label="Article"
				// biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must take focus so keyboard users can scroll it
				tabIndex={0}
				className="h-80 min-w-0 flex-1 overflow-y-auto rounded-xl border border-border p-5 [scroll-behavior:smooth]"
			>
				{TOC_ARTICLE.map((section) => {
					const Heading = section.depth === 2 ? "h2" : "h3";
					return (
						<div key={section.id}>
							<Heading
								id={section.id}
								className={
									section.depth === 2
										? "mt-8 font-semibold text-foreground text-lg first:mt-0"
										: "mt-5 font-medium text-foreground text-sm"
								}
							>
								{section.label}
							</Heading>
							<p className="mt-2 text-muted-foreground text-sm leading-6">
								{section.body}
							</p>
							<p className="mt-2 text-muted-foreground text-sm leading-6">
								Scroll the article and the outline follows along.
							</p>
						</div>
					);
				})}
				<div className="h-40" />
			</section>
			<TableOfContents
				items={TOC_ITEMS}
				root={scroller}
				scrollOffset={0}
				variant={p.variant ?? "curve"}
				indicator={props.indicator !== false}
				className={p.variant === "minimap" ? "shrink-0" : "w-44 shrink-0"}
			/>
		</div>
	);
}
