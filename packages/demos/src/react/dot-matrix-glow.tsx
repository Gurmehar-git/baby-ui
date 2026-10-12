"use client";

import { Button, DotMatrixGlow } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function DotMatrixGlowDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof DotMatrixGlow>>(props);
	return (
		<div className="relative h-96 w-full max-w-3xl overflow-hidden rounded-xl border border-border">
			<DotMatrixGlow
				position="absolute"
				shape={p.shape ?? "dot"}
				size={p.size ?? "default"}
				tone={p.tone ?? "primary"}
				glowRadius={p.glowRadius ?? 160}
				ripple={p.ripple ?? true}
				ambient={p.ambient ?? false}
			>
				<div className="flex size-full flex-col items-center justify-center gap-5 px-6 text-center">
					<p className="font-medium text-muted-foreground text-xs uppercase tracking-widest">
						Observability for AI agents
					</p>
					<h2 className="max-w-md text-balance font-semibold text-3xl text-foreground tracking-tight">
						See every step your agents take
					</h2>
					<div className="flex gap-3">
						<Button>Start free trial</Button>
						<Button variant="outline">Book a demo</Button>
					</div>
				</div>
			</DotMatrixGlow>
		</div>
	);
}
