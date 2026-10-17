"use client";

import { type CSSProperties, type HTMLAttributes, useState } from "react";
import { Button } from "../../button/react/button";
import { Card } from "../../card/react/card";
import { cn } from "../../lib/cn";
import { ToggleGroup, ToggleGroupItem } from "../../toggle-group/react/toggle-group";
import {
	digitDelay,
	PRICING_02_LABELS,
	type Pricing02Labels,
	type Pricing02Period,
	type Pricing02Plan,
} from "../types";
import { type Pricing02Variant, pricing02 } from "../variants";

export type { Pricing02Labels, Pricing02Period, Pricing02Plan, Pricing02Variant };

export interface Pricing02Props
	extends Omit<HTMLAttributes<HTMLElement>, "title" | "onSelect"> {
	plans: Pricing02Plan[];
	/** Billing periods; the toggle shows when there are two or more. */
	periods: Pricing02Period[];
	period?: string;
	defaultPeriod?: string;
	onPeriodChange?: (period: string) => void;
	/** Called by a plan's button when the plan has no `href`. */
	onSelect?: (planId: string, period: string) => void;
	eyebrow?: string;
	/** Line breaks in the string are kept. */
	title?: string;
	description?: string;
	/** Small print under the plans. */
	footnotes?: string[];
	variant?: Pricing02Variant;
	labels?: Partial<Pricing02Labels>;
}

function Icon({ paths, className }: { paths: string[]; className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
			className={className}
		>
			{paths.map((d) => (
				<path key={d} d={d} />
			))}
		</svg>
	);
}

const ARROW = ["M5 12l14 0", "M13 18l6 -6", "M13 6l6 6"];
const CHECK = ["M5 12l5 5l10 -10"];

export function Pricing02({
	plans,
	periods,
	period: periodProp,
	defaultPeriod,
	onPeriodChange,
	onSelect,
	eyebrow,
	title,
	description,
	footnotes,
	variant = "soft",
	labels,
	className,
	...props
}: Pricing02Props) {
	const [internal, setInternal] = useState(defaultPeriod ?? periods[0]?.value ?? "");
	const period = periodProp ?? internal;
	const currentIndex = Math.max(
		0,
		periods.findIndex((p) => p.value === period),
	);
	const current = periods[currentIndex];
	const l = { ...PRICING_02_LABELS, ...labels };
	const s = pricing02({ variant });

	// Digits only roll once the period has changed, never on first paint.
	const [initial] = useState(current?.value);
	const [moved, setMoved] = useState(false);
	if (!moved && current?.value !== initial) setMoved(true);

	function setPeriod(next: string) {
		if (!next) return;
		if (periodProp === undefined) setInternal(next);
		onPeriodChange?.(next);
	}

	return (
		<section data-slot="pricing-02" className={cn(s.root(), className)} {...props}>
			<div className={s.inner()}>
				<div className={s.header()}>
					<div className={s.heading()}>
						{eyebrow ? <p className={s.eyebrow()}>{eyebrow}</p> : null}
						{title ? <h2 className={s.title()}>{title}</h2> : null}
					</div>
					<div className={s.aside()}>
						{description ? <p className={s.description()}>{description}</p> : null}
						{periods.length > 1 ? (
							<ToggleGroup
								type="single"
								size="sm"
								value={current?.value ?? ""}
								onValueChange={(next) => setPeriod(next as string)}
								label={l.period}
							>
								{periods.map((p) => (
									<ToggleGroupItem key={p.value} value={p.value}>
										{p.label}
									</ToggleGroupItem>
								))}
							</ToggleGroup>
						) : null}
					</div>
				</div>

				<div className={s.plans()}>
					{plans.map((plan) => {
						const f = pricing02({ variant, featured: plan.featured ?? false });
						const price = current ? (plan.prices[current.value] ?? "") : "";
						const chars = [...price];
						const label = plan.cta ?? `${l.choose} ${plan.name}`;
						const buttonVariant = plan.featured ? "default" : "outline";
						return (
							<Card key={plan.id} className={s.plan()}>
								<div aria-hidden className={s.glow()} />
								<div className={f.panel()}>
									<p className={s.name()}>{plan.name}</p>
									{plan.description ? (
										<p className={s.blurb()}>{plan.description}</p>
									) : null}
									<div className={s.price()}>
										<span className="sr-only">{price}</span>
										<span
											aria-hidden
											className={s.amount()}
											style={
												{ "--digit-dir": currentIndex > 0 ? 1 : -1 } as CSSProperties
											}
										>
											{chars.map((char, i) => (
												<span
													// biome-ignore lint/suspicious/noArrayIndexKey: characters of one string never reorder, so position is the identity.
													key={`${current?.value}-${i}-${char}`}
													data-animate={moved ? "" : undefined}
													className={s.digit()}
													style={
														{
															"--digit-delay": digitDelay(i, chars.length),
														} as CSSProperties
													}
												>
													{char}
												</span>
											))}
										</span>
										{current ? (
											<span className={s.cadence()}>{current.cadence}</span>
										) : null}
									</div>
									{plan.href !== undefined ? (
										<Button href={plan.href} variant={buttonVariant} className={s.cta()}>
											{label}
											<Icon paths={ARROW} className={s.arrow()} />
										</Button>
									) : onSelect ? (
										<Button
											variant={buttonVariant}
											className={s.cta()}
											onClick={() => onSelect(plan.id, current?.value ?? "")}
										>
											{label}
											<Icon paths={ARROW} className={s.arrow()} />
										</Button>
									) : null}
								</div>
								<div className={s.list()}>
									{plan.featuresLabel ? (
										<p className={s.listLabel()}>{plan.featuresLabel}</p>
									) : null}
									<ul className={s.features()}>
										{plan.features.map((feature) => (
											<li key={feature} className={s.feature()}>
												<span className={s.tick()}>
													<Icon paths={CHECK} className="size-3" />
												</span>
												{feature}
											</li>
										))}
									</ul>
								</div>
							</Card>
						);
					})}
				</div>

				{footnotes?.length ? (
					<div className={s.footnotes()}>
						{footnotes.map((note) => (
							<p key={note}>{note}</p>
						))}
					</div>
				) : null}
			</div>
		</section>
	);
}
