"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "../button/button";
import type { ButtonVariant } from "../button/variants";

export type RecommendationOption = {
	key: string;
	body: ReactNode;
	short: string;
	/** 0-3 confidence bars filled. */
	signal: number;
	/** CSS colour for the filled bars, e.g. `"var(--success)"`. */
	tone: string;
	label: string;
	cta: string;
	ctaVariant: ButtonVariant;
};

export type RecommendationLabels = {
	alternatives: string;
	otherOptions: string;
	accepted: string;
};

const DEFAULT_LABELS: RecommendationLabels = {
	alternatives: "Alternatives",
	otherOptions: "Other options",
	accepted: "Accepted",
};

function Meter({ signal, tone }: { signal: number; tone: string }) {
	return (
		<span className="flex items-end gap-0.5">
			{[0, 1, 2].map((bar) => (
				<span
					key={bar}
					className="h-2.5 w-1 rounded-full transition-colors duration-(--duration-slow)"
					style={{ background: bar < signal ? tone : "var(--border-strong)" }}
				/>
			))}
		</span>
	);
}

export interface RecommendationCardProps {
	title: string;
	options: RecommendationOption[];
	labels?: Partial<RecommendationLabels>;
}

/** The card holds its shape while switching options: picking an alternative promotes it
 * to the recommendation in place, rather than opening a separate confirmation flow. */
export function RecommendationCard({ title, options, labels }: RecommendationCardProps) {
	const t = { ...DEFAULT_LABELS, ...labels };
	const [selected, setSelected] = useState(0);
	const [open, setOpen] = useState(false);
	const [accepted, setAccepted] = useState(false);

	const active = options[selected] as RecommendationOption;
	const others = options
		.map((option, index) => ({ option, index }))
		.filter(({ index }) => index !== selected);

	return (
		<div
			data-slot="recommendation-card"
			className="w-full max-w-sm overflow-hidden rounded-2xl bg-card shadow-sm"
		>
			<div className="p-4">
				<span className="font-medium text-sm text-foreground">{title}</span>
				<p
					key={active.key}
					className="fade-in mt-1.5 min-h-12 text-sm text-muted-foreground leading-relaxed"
				>
					{active.body}
				</p>
			</div>

			<div
				className="grid transition-[grid-template-rows,opacity] duration-(--duration-slow) ease-[var(--ease-ui-out)]"
				style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
			>
				<div className="overflow-hidden">
					<div className="border-border border-t bg-card px-2 py-2">
						<p className="px-1.5 pb-1 font-medium text-xs text-muted-foreground">
							{t.otherOptions}
						</p>
						{others.map(({ option, index }) => (
							<button
								key={option.key}
								type="button"
								onClick={() => {
									setSelected(index);
									setAccepted(false);
								}}
								className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left transition-colors duration-(--duration-instant) hover:bg-accent"
							>
								<Meter signal={option.signal} tone={option.tone} />
								<span className="min-w-0 flex-1 truncate text-xs text-foreground">
									{option.short}
								</span>
								<span className="shrink-0 text-xs text-muted-foreground">
									{option.label}
								</span>
							</button>
						))}
					</div>
				</div>
			</div>

			<div className="flex items-center justify-between gap-3 border-border border-t bg-card px-4 py-3">
				<span className="flex items-center gap-2">
					<Meter signal={active.signal} tone={active.tone} />
					<span className="font-medium text-xs text-muted-foreground">
						{active.label}
					</span>
				</span>

				<span className="-mr-0.5 flex items-center gap-2">
					<Button
						variant="secondary"
						size="sm"
						aria-expanded={open}
						onClick={() => setOpen((current) => !current)}
						className="px-2.5 text-xs"
					>
						{t.alternatives}
					</Button>
					<Button
						variant={accepted ? "success" : active.ctaVariant}
						size="sm"
						onClick={() => setAccepted(true)}
						className="text-xs"
					>
						{accepted ? t.accepted : active.cta}
					</Button>
				</span>
			</div>
		</div>
	);
}
