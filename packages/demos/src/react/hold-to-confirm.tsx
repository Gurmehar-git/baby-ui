"use client";

import { HoldToConfirm } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function HoldToConfirmDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof HoldToConfirm>>(props);
	const [confirmed, setConfirmed] = useState(false);
	const [hint, setHint] = useState("");
	return (
		<div className="flex flex-col items-center gap-3">
			<HoldToConfirm
				label={p.label || "Hold to delete project"}
				confirmedLabel={p.confirmedLabel || "Deleted"}
				variant={p.variant ?? "destructive"}
				size={p.size ?? "default"}
				duration={p.duration ?? 1200}
				confirmed={confirmed}
				onConfirm={() => setConfirmed(true)}
				onHoldChange={(holding) => setHint(holding ? "Keep holding…" : "")}
			/>
			<p className="h-4 text-muted-foreground text-xs" aria-hidden>
				{confirmed ? (
					<button
						type="button"
						className="underline underline-offset-4"
						onClick={() => setConfirmed(false)}
					>
						Undo
					</button>
				) : (
					hint
				)}
			</p>
		</div>
	);
}
