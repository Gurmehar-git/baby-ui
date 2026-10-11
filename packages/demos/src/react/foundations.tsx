"use client";

import type { FileTreeNode } from "@baby-ui/react";
import { BentoCell, BentoGrid, Button, FileTree, MorphingModal } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function ButtonDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Button>>(props);
	const size = p.size ?? "default";
	return (
		<Button
			variant={p.variant ?? "default"}
			size={size}
			href={p.href || undefined}
			loading={p.loading ?? false}
			loadingLabel={p.loadingLabel || "Loading…"}
		>
			{size === "icon" ? (
				<svg viewBox="0 0 16 16" fill="none" aria-hidden>
					<path
						d="M8 3.5v9M3.5 8h9"
						stroke="currentColor"
						strokeWidth="1.6"
						strokeLinecap="round"
					/>
				</svg>
			) : (
				"Deploy project"
			)}
		</Button>
	);
}

const SAMPLE_TREE: FileTreeNode[] = [
	{
		name: "src",
		children: [
			{
				name: "routes",
				children: [{ name: "+layout.svelte" }, { name: "+page.svelte" }],
			},
			{ name: "lib", children: [{ name: "cn.ts" }, { name: "tokens.css" }] },
			{ name: "app.html" },
		],
	},
	{ name: "package.json" },
	{ name: "vite.config.ts" },
];

const CELLS = [
	{
		span: "2x1" as const,
		title: "Registry",
		body: "shadcn and shadcn-svelte, one spec.",
		image: "https://picsum.photos/id/1036/800/300",
	},
	{
		span: "1x1" as const,
		title: "Tokens",
		body: "Shared colour and motion.",
		image: "https://picsum.photos/id/1050/400/300",
	},
	{
		span: "1x1" as const,
		title: "Agents",
		body: "llms.txt and specs.json.",
		image: "https://picsum.photos/id/1057/400/300",
	},
	{
		span: "1x1" as const,
		title: "Playground",
		body: "Both renders, side by side.",
		image: "https://picsum.photos/id/1067/400/300",
	},
];

export function BentoGridDemo({ props }: { props: Props }) {
	return (
		<BentoGrid
			columns={Number(props.columns ?? 3)}
			gap={Number(props.gap ?? 16)}
			rowHeight={Number(props.rowHeight ?? 160)}
			className="w-full max-w-2xl"
		>
			{CELLS.map((cell) => (
				<BentoCell
					key={cell.title}
					span={cell.span}
					title={cell.title}
					description={cell.body}
				>
					<img
						src={cell.image}
						alt=""
						loading="lazy"
						className="mt-3 size-full rounded-lg object-cover"
					/>
				</BentoCell>
			))}
		</BentoGrid>
	);
}

export function FileTreeDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof FileTree>>(props);
	return (
		<FileTree
			tree={SAMPLE_TREE}
			indent={Number(props.indent ?? 14)}
			showGuides={props.showGuides !== false}
			defaultExpanded={props.defaultExpanded !== false}
			size={p.size ?? "md"}
			className="w-64"
		/>
	);
}

export function MorphingModalDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof MorphingModal>>(props);
	return (
		<MorphingModal
			title="Deploy to production"
			spring={p.spring ?? "gentle"}
			size={p.size ?? "md"}
			dismissOnBackdrop={props.dismissOnBackdrop !== false}
			backdropBlur={Number(props.backdropBlur ?? 8)}
			trigger={
				<div className="w-56 rounded-2xl border border-border bg-card p-4">
					<p className="font-medium text-foreground text-sm">Deploy to production</p>
					<p className="mt-1 text-muted-foreground text-xs">Click to expand</p>
				</div>
			}
		>
			This dialog grew out of the card&apos;s own box. Closing runs the same path in
			reverse, a little faster.
		</MorphingModal>
	);
}
