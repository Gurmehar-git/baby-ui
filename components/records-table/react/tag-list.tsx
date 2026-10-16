"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { tagToneClass } from "./variants";

function Tag({ name }: { name: string }) {
	return (
		<span
			className={`inline-flex h-5.5 shrink-0 items-center rounded-md px-1.5 font-medium text-xs ${tagToneClass(name)}`}
		>
			{name}
		</span>
	);
}

/** Measures each tag's real width to decide how many fit before collapsing the rest
 * into a "+N" pill, re-measuring on resize rather than assuming a fixed count. */
export function TagList({ tags }: { tags: string[] }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const measureRef = useRef<HTMLDivElement>(null);
	const [visibleCount, setVisibleCount] = useState(tags.length);

	useLayoutEffect(() => {
		const container = containerRef.current;
		const measure = measureRef.current;
		if (!container || !measure) return;

		function update() {
			if (!container || !measure) return;
			const available = container.clientWidth;
			const tagWidths = Array.from(
				measure.querySelectorAll<HTMLElement>("[data-tag-measure]"),
				(tag) => tag.offsetWidth,
			);
			const moreWidth =
				measure.querySelector<HTMLElement>("[data-more-measure]")?.offsetWidth ?? 0;
			let used = 0;
			let count = 0;

			for (let index = 0; index < tagWidths.length; index++) {
				const width = tagWidths[index] ?? 0;
				const nextUsed = used + (count > 0 ? 4 : 0) + width;
				const hiddenAfter = tags.length - (index + 1);
				const totalWithOverflow = nextUsed + (hiddenAfter > 0 ? 4 + moreWidth : 0);
				if (totalWithOverflow > available) break;
				used = nextUsed;
				count += 1;
			}

			setVisibleCount(count);
		}

		update();
		const observer = new ResizeObserver(update);
		observer.observe(container);
		return () => observer.disconnect();
	}, [tags]);

	const hiddenCount = tags.length - visibleCount;

	return (
		<div
			ref={containerRef}
			className="relative flex min-w-0 items-center gap-1 overflow-hidden"
			title={tags.join(", ")}
		>
			<div
				ref={measureRef}
				aria-hidden
				className="pointer-events-none absolute flex gap-1 opacity-0"
			>
				{tags.map((tag) => (
					<span key={tag} data-tag-measure>
						<Tag name={tag} />
					</span>
				))}
				<span
					data-more-measure
					className="inline-flex h-5.5 items-center rounded-md px-1.5 text-xs"
				>
					+{tags.length}
				</span>
			</div>
			{tags.slice(0, visibleCount).map((tag) => (
				<Tag key={tag} name={tag} />
			))}
			{hiddenCount > 0 ? (
				<span className="shrink-0 text-xs text-muted-foreground">+{hiddenCount}</span>
			) : null}
		</div>
	);
}
