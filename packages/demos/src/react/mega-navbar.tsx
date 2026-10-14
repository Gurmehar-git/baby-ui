"use client";

import { Button, type MegaMenuGroup, MegaNavbar } from "@baby-ui/react";
import type { ComponentProps, ReactNode } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

function RecastMark() {
	return (
		<svg width="20" height="20" viewBox="0 0 584 584" fill="none" aria-hidden>
			<rect width="584" height="584" rx="75" className="fill-foreground" />
			<path
				d="M200.12 204.56C200.12 167.8 170.32 138 133.56 138C96.7999 138 67 167.8 67 204.56V378.64C67 415.4 96.7999 445.2 133.56 445.2C170.32 445.2 200.12 415.4 200.12 378.64V204.56Z"
				className="fill-background"
			/>
			<path
				d="M358.84 204.56C358.84 167.8 329.04 138 292.28 138C255.52 138 225.72 167.8 225.72 204.56V378.64C225.72 415.4 255.52 445.2 292.28 445.2C329.04 445.2 358.84 415.4 358.84 378.64V204.56Z"
				className="fill-background"
			/>
			<path
				d="M517.56 204.56C517.56 167.8 487.76 138 451 138C414.24 138 384.44 167.8 384.44 204.56V378.64C384.44 415.4 414.24 445.2 451 445.2C487.76 445.2 517.56 415.4 517.56 378.64V204.56Z"
				className="fill-background"
			/>
		</svg>
	);
}

function Icon({ children }: { children: ReactNode }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			{children}
		</svg>
	);
}

const GROUPS: MegaMenuGroup[] = [
	{
		label: "Product",
		href: "https://recast.li/features",
		eyebrow: "What Recast does",
		description:
			"Record your screen, trim it and share a link in seconds, from one desktop app.",
		items: [
			{
				label: "Features",
				href: "https://recast.li/features",
				description: "Everything Recast does, end to end",
				external: true,
				icon: (
					<Icon>
						<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
					</Icon>
				),
			},
			{
				label: "Download",
				href: "https://recast.li/download",
				description: "macOS, Windows and Linux builds",
				external: true,
				icon: (
					<Icon>
						<path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
					</Icon>
				),
			},
			{
				label: "Pricing",
				href: "https://recast.li/pricing",
				description: "Free to record, paid to share at scale",
				external: true,
				icon: (
					<Icon>
						<path d="m20.5 12.5-8 8a2 2 0 0 1-2.8 0L4 15.8a2 2 0 0 1 0-2.8l8-8A2 2 0 0 1 13.4 4H19a1 1 0 0 1 1 1v5.6a2 2 0 0 1-.5 1.4Z" />
						<path d="M15.5 8.5h.01" />
					</Icon>
				),
			},
		],
		footer: {
			label: "Start recording free",
			href: "https://recast.li/download",
			hint: "No account needed",
		},
	},
	{
		label: "Tools",
		href: "https://recast.li/tools",
		eyebrow: "Free in the browser",
		description:
			"Quick fixes for any video file. Everything runs on your device; nothing is uploaded.",
		items: [
			{
				label: "Trim video",
				href: "https://recast.li/tools/trim-video",
				description: "Cut to the part you want, losslessly",
				external: true,
				icon: (
					<Icon>
						<circle cx="6" cy="6" r="3" />
						<circle cx="6" cy="18" r="3" />
						<path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12" />
					</Icon>
				),
			},
			{
				label: "Compress video",
				href: "https://recast.li/tools/compress-video",
				description: "Shrink a file to fit an upload cap",
				external: true,
				icon: (
					<Icon>
						<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
						<path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
					</Icon>
				),
			},
		],
		footer: {
			label: "Browse all tools",
			href: "https://recast.li/tools",
			hint: "Free, nothing uploaded",
		},
	},
	{
		label: "Resources",
		href: "https://recast.li/blog",
		eyebrow: "Follow along",
		description: "What we are shipping, how it is built and where the code lives.",
		items: [
			{
				label: "Blog",
				href: "https://recast.li/blog",
				description: "What we are building and why",
				external: true,
				icon: (
					<Icon>
						<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
						<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
					</Icon>
				),
			},
			{
				label: "GitHub",
				href: "https://github.com/kanakkholwal/recast",
				description: "Source, issues and releases",
				external: true,
				icon: (
					<Icon>
						<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
					</Icon>
				),
			},
		],
	},
];

export function MegaNavbarDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof MegaNavbar>>(props);
	const variant = p.variant ?? "solid";
	return (
		// No overflow clipping: the menu panels open past the bar, as on a real page.
		<div className="isolate w-full max-w-5xl rounded-xl border border-border bg-background">
			<MegaNavbar
				active={p.active || undefined}
				sticky={false}
				blur={props.blur !== false}
				variant={variant}
				className={
					variant === "solid"
						? "rounded-t-[11px] border-border border-b bg-card"
						: undefined
				}
				brand={
					<>
						<span className="grid size-7 place-items-center rounded-lg bg-foreground p-1">
							<RecastMark />
						</span>
						<span className="whitespace-nowrap font-semibold text-foreground text-lg tracking-wide">
							Recast
						</span>
					</>
				}
				groups={GROUPS}
				links={[
					{ label: "Changelog", href: "https://recast.li/changelog", external: true },
				]}
				actions={
					<Button href="https://recast.li/download" variant="dark">
						Download
					</Button>
				}
			/>
			<div className="flex min-h-[26rem] flex-col items-center justify-center gap-4 px-6 text-center">
				<h3 className="max-w-md text-balance font-sans font-semibold text-3xl text-foreground tracking-tight">
					Record, trim and share in one place
				</h3>
				<p className="max-w-sm text-pretty text-muted-foreground">
					Hover the menu to open a section; move along the bar to slide between them.
				</p>
			</div>
		</div>
	);
}
