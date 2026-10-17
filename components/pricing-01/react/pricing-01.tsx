"use client";

import { type HTMLAttributes, useState } from "react";
import { Badge } from "../../badge/react/badge";
import { Button } from "../../button/react/button";
import {
	Card,
	CardAction,
	CardContent,
	CardFooter,
	CardHeader,
} from "../../card/react/card";
import { cn } from "../../lib/cn";
import { ToggleGroup, ToggleGroupItem } from "../../toggle-group/react/toggle-group";
import {
	PRICING_01_LABELS,
	type Pricing01Labels,
	type Pricing01Period,
	type Pricing01Plan,
} from "../types";
import { type Pricing01Variant, pricing01 } from "../variants";

export type { Pricing01Labels, Pricing01Period, Pricing01Plan, Pricing01Variant };

export interface Pricing01Props
	extends Omit<HTMLAttributes<HTMLElement>, "title" | "onSelect"> {
	plans: Pricing01Plan[];
	/** Billing periods; the toggle shows when there are two or more. */
	periods: Pricing01Period[];
	period?: string;
	defaultPeriod?: string;
	onPeriodChange?: (period: string) => void;
	/** Called by a plan's button when the plan has no `href`. */
	onSelect?: (planId: string, period: string) => void;
	eyebrow?: string;
	title?: string;
	description?: string;
	variant?: Pricing01Variant;
	labels?: Partial<Pricing01Labels>;
}

function Check({ className }: { className: string }) {
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
			<path d="M5 12l5 5l10 -10" />
		</svg>
	);
}

function ArrowUpRight({ className }: { className: string }) {
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
			<path d="M17 7l-10 10" />
			<path d="M8 7l9 0l0 9" />
		</svg>
	);
}

export function Pricing01({
	plans,
	periods,
	period: periodProp,
	defaultPeriod,
	onPeriodChange,
	onSelect,
	eyebrow,
	title,
	description,
	variant = "default",
	labels,
	className,
	...props
}: Pricing01Props) {
	const [internal, setInternal] = useState(defaultPeriod ?? periods[0]?.value ?? "");
	const period = periodProp ?? internal;
	const current = periods.find((p) => p.value === period) ?? periods[0];
	const l = { ...PRICING_01_LABELS, ...labels };
	const s = pricing01({ variant });

	function setPeriod(next: string) {
		if (!next) return;
		if (periodProp === undefined) setInternal(next);
		onPeriodChange?.(next);
	}

	return (
		<section data-slot="pricing-01" className={cn(s.root(), className)} {...props}>
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
						const f = pricing01({ variant, featured: plan.featured ?? false });
						const label = plan.cta ?? `${l.choose} ${plan.name}`;
						const hasAction = plan.href !== undefined || onSelect !== undefined;
						return (
							<div
								key={plan.id}
								data-featured={plan.featured || undefined}
								className={s.item()}
							>
								{plan.note ? (
									<p aria-hidden className={s.note()}>
										{plan.note}
									</p>
								) : null}
								<Card variant={variant} className={f.card()}>
									<CardHeader>
										<p className={s.name()}>{plan.name}</p>
										{plan.badge ? (
											<CardAction>
												<Badge variant={plan.featured ? "default" : "outline"} size="sm">
													{plan.badge}
												</Badge>
											</CardAction>
										) : null}
										<div className={s.price()}>
											<span className={s.amount()}>
												{current ? plan.prices[current.value] : null}
											</span>
											{current ? (
												<span className={s.cadence()}>{current.cadence}</span>
											) : null}
										</div>
									</CardHeader>
									<CardContent className={s.body()}>
										{plan.description ? (
											<p className={s.blurb()}>{plan.description}</p>
										) : null}
										<ul className={s.features()}>
											{plan.features.map((feature) => (
												<li key={feature} className={s.feature()}>
													<Check className={s.check()} />
													<span>{feature}</span>
												</li>
											))}
										</ul>
									</CardContent>
									{hasAction ? (
										<CardFooter>
											{plan.href !== undefined ? (
												<Button
													href={plan.href}
													variant={plan.featured ? "default" : "dark"}
													className={s.cta()}
												>
													{label}
													<ArrowUpRight className={s.arrow()} />
												</Button>
											) : (
												<Button
													variant={plan.featured ? "default" : "dark"}
													className={s.cta()}
													onClick={() => onSelect?.(plan.id, current?.value ?? "")}
												>
													{label}
													<ArrowUpRight className={s.arrow()} />
												</Button>
											)}
										</CardFooter>
									) : null}
								</Card>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
