"use client";

import {
	AssetMenu,
	AssetMenuContent,
	AssetMenuCopyItem,
	AssetMenuLabel,
	AssetMenuLinkItem,
	AssetMenuPreview,
	AssetMenuSeparator,
	AssetMenuTrigger,
	Button,
} from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;
const MARK =
	'<svg viewBox="0 0 32 32"><path fill="currentColor" d="M5 5h9v9H5zm13 0h9v22h-9zM5 18h9v9H5z"/></svg>';
const WORDMARK = `<svg viewBox="0 0 150 32">${MARK}<text x="40" y="22">Northstar</text></svg>`;

function Mark() {
	return (
		<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden className="size-6">
			<path d="M5 5h9v9H5zm13 0h9v22h-9zM5 18h9v9H5z" />
		</svg>
	);
}

export function AssetMenuDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof AssetMenu>>(props);
	const [open, setOpen] = useState(false);
	const [status, setStatus] = useState("Right-click or long press the mark");
	const copied = (name: string) => (success: boolean) =>
		setStatus(success ? `${name} copied` : `Could not copy ${name.toLowerCase()}`);

	return (
		<div className="grid place-items-center gap-3">
			<AssetMenu variant={p.variant ?? "default"} open={open} onOpenChange={setOpen}>
				<AssetMenuTrigger
					render={
						<Button
							variant="outline"
							size="xl"
							aria-label="Open Northstar asset actions"
						/>
					}
				>
					<Mark />
					Northstar assets
				</AssetMenuTrigger>
				<AssetMenuContent>
					<AssetMenuLabel>Copy</AssetMenuLabel>
					<AssetMenuCopyItem value={MARK} onCopy={copied("Mark SVG")}>
						<AssetMenuPreview>
							<Mark />
						</AssetMenuPreview>
						Mark as SVG
					</AssetMenuCopyItem>
					<AssetMenuCopyItem value={WORDMARK} onCopy={copied("Wordmark SVG")}>
						<AssetMenuPreview aria-hidden>W</AssetMenuPreview>
						Wordmark as SVG
					</AssetMenuCopyItem>
					<AssetMenuSeparator />
					<AssetMenuLinkItem href="/" onClick={() => setStatus("Guidelines opened")}>
						<AssetMenuPreview aria-hidden>↗</AssetMenuPreview>
						Usage guidelines
					</AssetMenuLinkItem>
					<AssetMenuLinkItem
						href={`data:image/svg+xml,${encodeURIComponent(MARK)}`}
						download="northstar-mark.svg"
					>
						<AssetMenuPreview aria-hidden>↓</AssetMenuPreview>
						Download mark
					</AssetMenuLinkItem>
				</AssetMenuContent>
			</AssetMenu>
			<p aria-live="polite" className="text-muted-foreground text-xs">
				{status}
			</p>
		</div>
	);
}
