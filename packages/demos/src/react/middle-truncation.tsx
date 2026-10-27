"use client";

import {
	MiddleTruncation,
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;
const values = [
	{ text: "/workspace/products/checkout/components/payment-method.tsx", end: 4 },
	{ text: "FY26_Q1_Consolidated_Financial_Statements.pdf", end: 4 },
	{ text: "sha256:8f9ce71d07ad44b60a4c62b814c903d783f33128", minEnd: 12 },
];

export function MiddleTruncationDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof MiddleTruncation>>(props);
	return (
		<div className="h-56 w-full max-w-xl">
			<ResizablePanelGroup aria-label="Resize truncation examples" variant="bordered">
				<ResizablePanel id="examples" label="Examples" defaultSize={72} minSize={140}>
					<div className="grid h-full content-center gap-5 p-5">
						{values.map((value) =>
							"end" in value ? (
								<MiddleTruncation
									key={value.text}
									text={p.text ?? value.text}
									end={value.end}
									variant={p.variant ?? "code"}
								/>
							) : (
								<MiddleTruncation
									key={value.text}
									text={p.text ?? value.text}
									minEnd={value.minEnd}
									variant={p.variant ?? "code"}
								/>
							),
						)}
					</div>
				</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel id="space" label="Available space" defaultSize={28} minSize={0} />
			</ResizablePanelGroup>
		</div>
	);
}
