"use client";

import {
	AssetMenu,
	AssetMenuContent,
	AssetMenuCopyItem,
	AssetMenuLinkItem,
	AssetMenuTrigger,
	Button,
} from "@baby-ui/react";
import { useState } from "react";

export function Example({ svg }: { svg: string }) {
	const [open, setOpen] = useState(false);
	return (
		<AssetMenu open={open} onOpenChange={setOpen}>
			<AssetMenuTrigger render={<Button variant="outline" />}>
				Asset actions
			</AssetMenuTrigger>
			<AssetMenuContent>
				<AssetMenuCopyItem value={svg}>Copy SVG</AssetMenuCopyItem>
				<AssetMenuLinkItem href="/assets.zip" download>
					Download assets
				</AssetMenuLinkItem>
			</AssetMenuContent>
		</AssetMenu>
	);
}
