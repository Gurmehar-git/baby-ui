"use client";

import { cn, NotchedShelf } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function NotchedShelfDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof NotchedShelf>>(props);
	const variant = p.variant ?? "solid";
	const layout = p.layout ?? "hanging";
	const size = p.size ?? "default";
	return (
		// Muted matches the card, so it bridges into a page-coloured surface instead.
		<div
			className={cn(
				"flex h-64 w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border",
				variant === "muted" ? "bg-background" : "bg-card",
				layout === "rising" ? "justify-end" : "justify-start",
			)}
		>
			<NotchedShelf
				variant={variant}
				layout={layout}
				size={size}
				shape={p.shape ?? "smooth"}
				align={p.align ?? "center"}
				edge={p.edge === true}
			>
				<a
					href="#top"
					className={cn(
						"inline-flex items-center gap-2 rounded-full font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring",
						size === "sm"
							? "px-3 text-xs"
							: size === "lg"
								? "px-6 text-sm"
								: "px-5 text-sm",
					)}
				>
					<svg
						viewBox="0 0 16 16"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.6"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden
						className="size-4"
					>
						<path d="M8 13.5V3M3.5 7.5 8 3l4.5 4.5" />
					</svg>
					Back to top
				</a>
			</NotchedShelf>
		</div>
	);
}
