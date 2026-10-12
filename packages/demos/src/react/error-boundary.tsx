"use client";

import { Badge, Button, ErrorBoundary } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

// Stands in for a widget whose data source fails; demo only.
function ProfileCard({ crash }: { crash: boolean }) {
	if (crash) throw new Error("Profile service answered 503 Service Unavailable");
	return (
		<div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
			<span className="grid size-10 place-items-center rounded-full bg-primary/10 font-medium text-primary">
				AR
			</span>
			<div className="flex min-w-0 flex-1 flex-col">
				<span className="font-medium text-sm">Ana Ruiz</span>
				<span className="text-muted-foreground text-xs">Design lead</span>
			</div>
			<Badge size="sm" variant="secondary">
				Online
			</Badge>
		</div>
	);
}

export function ErrorBoundaryDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ErrorBoundary>>(props);
	const [crash, setCrash] = useState(false);
	return (
		<div className="flex w-full max-w-md flex-col gap-3">
			<Button
				size="sm"
				variant="outline"
				disabled={crash}
				onClick={() => setCrash(true)}
				className="self-start"
			>
				Break the widget
			</Button>
			<ErrorBoundary
				variant={p.variant ?? "card"}
				layout={p.layout ?? "vertical"}
				size={p.size ?? "default"}
				details={p.details ?? true}
				onReset={() => setCrash(false)}
			>
				<ProfileCard crash={crash} />
			</ErrorBoundary>
		</div>
	);
}
