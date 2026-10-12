"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

const pane = "grid h-full content-start gap-1 p-4 text-sm";

export function ResizableDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ResizablePanelGroup>>(props);
	const [sizes, setSizes] = useState<number[]>([22, 48, 30]);
	return (
		<div className="grid w-full max-w-3xl gap-2">
			<div className="h-72">
				<ResizablePanelGroup
					aria-label="Mail"
					variant={p.variant ?? "bordered"}
					onLayoutChange={setSizes}
				>
					<ResizablePanel
						id="folders"
						label="Folders"
						defaultSize={22}
						minSize={140}
						collapsible
					>
						<div className={pane}>
							<strong>Folders</strong>
							<span className="text-muted-foreground">Inbox, Sent, Archive</span>
						</div>
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel id="messages" label="Messages" defaultSize={48} minSize={200}>
						<div className={pane}>
							<strong>Messages</strong>
							<span className="text-muted-foreground">
								Drag a divider, flick it to an edge, or focus it and use the arrow keys.
							</span>
						</div>
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel
						id="preview"
						label="Preview"
						defaultSize={30}
						minSize={160}
						collapsible
					>
						<div className={pane}>
							<strong>Preview</strong>
							<span className="text-muted-foreground">
								Double-click a divider to reset.
							</span>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
			<p className="text-muted-foreground text-xs tabular-nums">
				{sizes.map((size) => `${Math.round(size)}%`).join(" · ")}
			</p>
		</div>
	);
}
