"use client";

import {
	type ComponentProps,
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import { Badge } from "../../badge/react/badge";
import { Button } from "../../button/react/button";
import { cn } from "../../lib/cn";
import { RollingDigits } from "../../rolling-digits/react/rolling-digits";
import {
	availableCycles,
	describePlanPrice,
	formatPlanMoney,
	isCustomPlan,
	maxAnnualSavePercent,
	type PlanPrice,
	PRICING_PLANS_LABELS,
	type PricingCycle,
	type PricingPlanOption,
	type PricingPlansLabels,
	planPrice,
	planPriceLabel,
} from "../pricing-plans-core";
import {
	type PricingPlansLayout,
	type PricingPlansSize,
	pricingPlans,
} from "../variants";

type PlansCtx = {
	id: string;
	plans: PricingPlanOption[];
	cycles: PricingCycle[];
	active: PricingCycle;
	setCycle: (next: PricingCycle) => void;
	money: (cents: number) => string;
	labels: PricingPlansLabels;
	layout: PricingPlansLayout;
	size: PricingPlansSize;
	currency: string;
	locale?: string;
	onSelect?: (planId: string, cycle: PricingCycle) => void;
	loadingPlanId: string | null;
};

type PlanCtx = {
	plan: PricingPlanOption;
	price: PlanPrice | null;
	custom: boolean;
	headingId: string;
};

const PlansContext = createContext<PlansCtx | null>(null);
const PlanContext = createContext<PlanCtx | null>(null);

function usePlans(part: string): PlansCtx {
	const ctx = useContext(PlansContext);
	if (!ctx) throw new Error(`${part} must be used inside <PricingPlans>`);
	return ctx;
}

function usePlan(part: string): PlansCtx & PlanCtx {
	const plan = useContext(PlanContext);
	if (!plan) throw new Error(`${part} must be used inside <PricingPlan>`);
	return { ...usePlans(part), ...plan };
}

export interface PricingPlansProps
	extends Omit<ComponentProps<"section">, "title" | "onSelect"> {
	plans: PricingPlanOption[];
	/** Controlled cycle; falls back to the first cycle any plan is priced on. */
	cycle?: PricingCycle;
	defaultCycle?: PricingCycle;
	onCycleChange?: (cycle: PricingCycle) => void;
	/** Called by a plan's action; redirect to hosted checkout from here. */
	onSelect?: (planId: string, cycle: PricingCycle) => void;
	/** The plan whose checkout is opening; its action spins and the others disable. */
	loadingPlanId?: string | null;
	currency?: string;
	locale?: string;
	layout?: PricingPlansLayout;
	size?: PricingPlansSize;
	labels?: Partial<PricingPlansLabels>;
}

/** The root: cycle state, money formatting and the price announcement. Compose the parts inside. */
export function PricingPlans({
	plans,
	cycle: cycleProp,
	defaultCycle,
	onCycleChange,
	onSelect,
	loadingPlanId = null,
	currency = "USD",
	locale,
	layout = "cards",
	size = "default",
	labels: labelsProp,
	className,
	children,
	...rest
}: PricingPlansProps) {
	const id = useId();
	const [local, setLocal] = useState(defaultCycle);
	const labels = { ...PRICING_PLANS_LABELS, ...labelsProp };
	const cycles = availableCycles(plans);
	const wanted = cycleProp ?? local;
	const active: PricingCycle =
		wanted && cycles.includes(wanted) ? wanted : (cycles[0] ?? "monthly");

	// Empty until the first change, so the summary is announced on a cycle switch, not on load.
	const summary = plans
		.map((plan) => describePlanPrice(plan, active, labels, currency, locale))
		.join(". ");
	const [announcement, setAnnouncement] = useState("");
	const settled = useRef(false);
	useEffect(() => {
		if (settled.current) setAnnouncement(summary);
		settled.current = true;
	}, [summary]);

	const ctx: PlansCtx = {
		id,
		plans,
		cycles,
		active,
		setCycle: (next) => {
			if (next === active) return;
			if (cycleProp === undefined) setLocal(next);
			onCycleChange?.(next);
		},
		money: (cents) => formatPlanMoney(cents, currency, locale),
		labels,
		layout,
		size,
		currency,
		locale,
		onSelect,
		loadingPlanId,
	};

	return (
		<PlansContext.Provider value={ctx}>
			<section
				data-slot="pricing-plans"
				data-layout={layout}
				className={cn(pricingPlans({ layout, size }).root(), className)}
				{...rest}
			>
				{children}
				<p className="sr-only" aria-live="polite">
					{announcement}
				</p>
			</section>
		</PlansContext.Provider>
	);
}

/** The billing cycle switch, with the best annual saving beside it; hidden with one cycle. */
export function PricingPlansCycle({ className, ...props }: ComponentProps<"div">) {
	const ctx = usePlans("PricingPlansCycle");
	const s = pricingPlans({ layout: ctx.layout, size: ctx.size });
	const saveUpTo = maxAnnualSavePercent(ctx.plans);
	const index = Math.max(0, ctx.cycles.indexOf(ctx.active));
	if (ctx.cycles.length < 2) return null;

	return (
		<div data-slot="pricing-plans-cycle" className={cn(s.bar(), className)} {...props}>
			<fieldset className={s.cycles()}>
				<legend className="sr-only">{ctx.labels.cycle}</legend>
				<span
					aria-hidden="true"
					className={s.thumb()}
					style={{
						width: `calc((100% - 4px) / ${ctx.cycles.length})`,
						translate: `${index * 100}% 0`,
					}}
				/>
				{ctx.cycles.map((option) => (
					<label key={option} className={s.cycle()}>
						<input
							type="radio"
							className="sr-only"
							name={`${ctx.id}-cycle`}
							value={option}
							checked={option === ctx.active}
							onChange={() => ctx.setCycle(option)}
						/>
						{ctx.labels[option]}
					</label>
				))}
			</fieldset>
			{saveUpTo > 0 && ctx.cycles.includes("annual") ? (
				<span className={s.saveNote()}>
					{ctx.labels.saveUpTo.replace("{percent}", String(saveUpTo))}
				</span>
			) : null}
		</div>
	);
}

export function PricingPlansGrid({ className, ...props }: ComponentProps<"div">) {
	const ctx = usePlans("PricingPlansGrid");
	return (
		<div
			data-slot="pricing-plans-grid"
			className={cn(
				pricingPlans({ layout: ctx.layout, size: ctx.size }).grid(),
				className,
			)}
			{...props}
		/>
	);
}

export interface PricingPlanProps extends ComponentProps<"article"> {
	plan: PricingPlanOption;
}

/** One plan. Its parts read the plan, so they need no props of their own. */
export function PricingPlan({ plan, className, ...props }: PricingPlanProps) {
	const ctx = usePlans("PricingPlan");
	const headingId = `${ctx.id}-${plan.id}`;
	const value: PlanCtx = {
		plan,
		price: planPrice(plan, ctx.active),
		custom: isCustomPlan(plan),
		headingId,
	};
	return (
		<PlanContext.Provider value={value}>
			<article
				data-slot="pricing-plan"
				data-highlighted={plan.highlighted || undefined}
				aria-labelledby={headingId}
				className={cn(
					pricingPlans({ layout: ctx.layout, size: ctx.size }).plan(),
					className,
				)}
				{...props}
			/>
		</PlanContext.Provider>
	);
}

export function PricingPlanHeader({ className, ...props }: ComponentProps<"div">) {
	return <div data-slot="pricing-plan-header" className={className} {...props} />;
}

/** The plan name and its badge; defaults to the plan's own. */
export function PricingPlanTitle({
	className,
	children,
	...props
}: ComponentProps<"div">) {
	const ctx = usePlan("PricingPlanTitle");
	const s = pricingPlans({ layout: ctx.layout, size: ctx.size });
	return (
		<div data-slot="pricing-plan-title" className={cn(s.head(), className)} {...props}>
			<h3 id={ctx.headingId} className={s.name()}>
				{children ?? ctx.plan.name}
			</h3>
			{ctx.plan.badge ? (
				<Badge variant={ctx.plan.highlighted ? "default" : "outline"} size="sm">
					{ctx.plan.badge}
				</Badge>
			) : null}
		</div>
	);
}

export function PricingPlanDescription({
	className,
	children,
	...props
}: ComponentProps<"p">) {
	const ctx = usePlan("PricingPlanDescription");
	const text = children ?? ctx.plan.description;
	if (!text) return null;
	return (
		<p
			data-slot="pricing-plan-description"
			className={cn(
				pricingPlans({ layout: ctx.layout, size: ctx.size }).description(),
				className,
			)}
			{...props}
		>
			{text}
		</p>
	);
}

/** The price for the active cycle, rolling digit by digit on a switch, with its billing note. */
export function PricingPlanPrice({ className, ...props }: ComponentProps<"div">) {
	const ctx = usePlan("PricingPlanPrice");
	const s = pricingPlans({ layout: ctx.layout, size: ctx.size });
	const { price, custom, labels: l, active } = ctx;
	return (
		<div data-slot="pricing-plan-price" className={className} {...props}>
			{price || custom ? (
				<span className="sr-only">
					{planPriceLabel(ctx.plan, active, l, ctx.currency, ctx.locale)}
				</span>
			) : null}
			<div className={s.price()} aria-hidden="true">
				{price ? (
					<>
						<RollingDigits
							value={price.cents}
							format={ctx.money}
							startOnView={false}
							className={s.amount()}
						/>
						<span className={s.cadence()}>
							{active === "lifetime" ? l.oneTime : l.perMonth}
						</span>
					</>
				) : (
					<span className={s.amount()}>{custom ? l.custom : " "}</span>
				)}
			</div>
			<p className={s.note()}>
				{custom ? (
					l.customNote
				) : !price ? (
					l.unavailable
				) : price.billedCents !== undefined ? (
					<>
						<span>
							{ctx.money(price.billedCents)} {l.billedYearly}
						</span>
						{price.savePercent ? (
							<span className={s.save()}>
								{l.save} {price.savePercent}%
							</span>
						) : null}
					</>
				) : active === "lifetime" ? (
					l.includesUpdates
				) : null}
			</p>
			{ctx.plan.seats ? <p className={s.note()}>{ctx.plan.seats}</p> : null}
		</div>
	);
}

/** The plan's call to action; it calls the root's `onSelect` unless you pass your own `onClick`. */
export function PricingPlanAction({
	className,
	children,
	onClick,
}: {
	className?: string;
	children?: ReactNode;
	onClick?: () => void;
}) {
	const ctx = usePlan("PricingPlanAction");
	return (
		<Button
			data-slot="pricing-plan-action"
			className={cn(
				pricingPlans({ layout: ctx.layout, size: ctx.size }).cta(),
				className,
			)}
			variant={ctx.plan.highlighted ? "default" : "outline"}
			size={ctx.size === "sm" ? "sm" : "default"}
			loading={ctx.loadingPlanId === ctx.plan.id}
			loadingLabel={ctx.labels.redirecting}
			disabled={
				(!ctx.price && !ctx.custom) ||
				(ctx.loadingPlanId != null && ctx.loadingPlanId !== ctx.plan.id)
			}
			onClick={onClick ?? (() => ctx.onSelect?.(ctx.plan.id, ctx.active))}
		>
			{children ?? ctx.plan.cta}
		</Button>
	);
}

export function PricingPlanFeatures({ className, ...props }: ComponentProps<"ul">) {
	const ctx = usePlan("PricingPlanFeatures");
	const s = pricingPlans({ layout: ctx.layout, size: ctx.size });
	if (!ctx.plan.features.length) return null;
	return (
		<ul
			data-slot="pricing-plan-features"
			aria-label={`${ctx.plan.name}: ${ctx.labels.features}`}
			className={cn(s.features(), className)}
			{...props}
		>
			{ctx.plan.features.map((feature) => (
				<li key={feature} className={s.feature()}>
					<svg
						className={s.check()}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M5 12l5 5l10 -10" />
					</svg>
					<span>{feature}</span>
				</li>
			))}
		</ul>
	);
}
