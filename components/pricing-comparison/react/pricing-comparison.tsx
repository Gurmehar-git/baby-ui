"use client";

import {
	type ComponentProps,
	createContext,
	type ReactNode,
	useContext,
	useId,
	useState,
} from "react";
import { cn } from "../../lib/cn";
import { Switch } from "../../switch/react/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../tabs/react/tabs";
import {
	type ComparisonGroup,
	type ComparisonPlan,
	type ComparisonRow,
	type ComparisonValue,
	comparisonValue,
	comparisonValueText,
	groupDiffers,
	PRICING_COMPARISON_LABELS,
	type PricingComparisonLabels,
	rowDiffers,
} from "../pricing-comparison-core";
import { type PricingComparisonDensity, pricingComparison } from "../variants";

type ComparisonCtx = {
	id: string;
	plans: ComparisonPlan[];
	groups: ComparisonGroup[];
	labels: PricingComparisonLabels;
	styles: ReturnType<typeof pricingComparison>;
	differencesOnly: boolean;
	setDifferencesOnly: (next: boolean) => void;
	collapsedGroups: string[];
	toggleGroup: (label: string) => void;
	mobilePlan?: ComparisonPlan;
	setActivePlan: (next: string) => void;
	rowShown: (row: ComparisonRow) => boolean;
	groupShown: (group: ComparisonGroup) => boolean;
	nothingDiffers: boolean;
};

const ComparisonContext = createContext<ComparisonCtx | null>(null);

function useComparison(part: string): ComparisonCtx {
	const ctx = useContext(ComparisonContext);
	if (!ctx) throw new Error(`${part} must be used inside <PricingComparison>`);
	return ctx;
}

function useControllable<T>(
	value: T | undefined,
	initial: T,
	onChange?: (next: T) => void,
) {
	const [local, setLocal] = useState(initial);
	const current = value ?? local;
	const set = (next: T) => {
		if (value === undefined) setLocal(next);
		onChange?.(next);
	};
	return [current, set] as const;
}

const CHECK = "M5 12l5 5l10 -10";
const CROSS = "M18 6l-12 12M6 6l12 12";

function Mark({ value }: { value: ComparisonValue }) {
	const { styles: s, labels } = useComparison("PricingComparison");
	if (typeof value === "string") return value;
	return (
		<>
			<svg
				className={value ? s.check() : s.cross()}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d={value ? CHECK : CROSS} />
			</svg>
			<span className="sr-only">{comparisonValueText(value, labels)}</span>
		</>
	);
}

function Collapse({ open, children }: { open: boolean; children: ReactNode }) {
	const { styles: s } = useComparison("PricingComparison");
	return (
		<div className={s.collapse()} data-state={open ? "open" : "closed"}>
			<div className={s.collapseInner()}>{children}</div>
		</div>
	);
}

export interface PricingComparisonProps extends Omit<ComponentProps<"section">, "title"> {
	plans: ComparisonPlan[];
	groups: ComparisonGroup[];
	/** Controlled. Collapses rows that read the same on every plan. */
	differencesOnly?: boolean;
	defaultDifferencesOnly?: boolean;
	onDifferencesOnlyChange?: (differencesOnly: boolean) => void;
	/** Controlled. Labels of the collapsed groups. */
	collapsedGroups?: string[];
	defaultCollapsedGroups?: string[];
	onCollapsedGroupsChange?: (collapsedGroups: string[]) => void;
	/** Controlled. The plan shown on narrow containers; defaults to the highlighted plan. */
	activePlanId?: string;
	defaultActivePlanId?: string;
	onActivePlanChange?: (planId: string) => void;
	density?: PricingComparisonDensity;
	labels?: Partial<PricingComparisonLabels>;
}

/** The root: the matrix data and its filters. Compose the toolbar, table, mobile view and empty note inside. */
export function PricingComparison({
	plans,
	groups,
	differencesOnly: differencesOnlyProp,
	defaultDifferencesOnly = false,
	onDifferencesOnlyChange,
	collapsedGroups: collapsedGroupsProp,
	defaultCollapsedGroups = [],
	onCollapsedGroupsChange,
	activePlanId: activePlanIdProp,
	defaultActivePlanId,
	onActivePlanChange,
	density = "comfortable",
	labels: labelsProp,
	className,
	children,
	...rest
}: PricingComparisonProps) {
	const id = useId();
	const [differencesOnly, setDifferencesOnly] = useControllable(
		differencesOnlyProp,
		defaultDifferencesOnly,
		onDifferencesOnlyChange,
	);
	const [collapsedGroups, setCollapsedGroups] = useControllable(
		collapsedGroupsProp,
		defaultCollapsedGroups,
		onCollapsedGroupsChange,
	);
	const [activePlanId, setActivePlanId] = useControllable(
		activePlanIdProp,
		defaultActivePlanId,
		(next) => (next ? onActivePlanChange?.(next) : undefined),
	);
	const styles = pricingComparison({ density });
	const planIds = plans.map((plan) => plan.id);
	const mobilePlan =
		plans.find((plan) => plan.id === activePlanId) ??
		plans.find((plan) => plan.highlighted) ??
		plans[0];

	const ctx: ComparisonCtx = {
		id,
		plans,
		groups,
		labels: { ...PRICING_COMPARISON_LABELS, ...labelsProp },
		styles,
		differencesOnly,
		setDifferencesOnly,
		collapsedGroups,
		toggleGroup: (label) =>
			setCollapsedGroups(
				collapsedGroups.includes(label)
					? collapsedGroups.filter((item) => item !== label)
					: [...collapsedGroups, label],
			),
		mobilePlan,
		setActivePlan: (next) => {
			if (next && next !== mobilePlan?.id) setActivePlanId(next);
		},
		rowShown: (row) => !differencesOnly || rowDiffers(row, planIds),
		groupShown: (group) => !differencesOnly || groupDiffers(group, planIds),
		nothingDiffers:
			differencesOnly && !groups.some((group) => groupDiffers(group, planIds)),
	};

	return (
		<ComparisonContext.Provider value={ctx}>
			<section
				data-slot="pricing-comparison"
				className={cn(styles.root(), className)}
				{...rest}
			>
				{children}
			</section>
		</ComparisonContext.Provider>
	);
}

export function PricingComparisonToolbar({ className, ...props }: ComponentProps<"div">) {
	const ctx = useComparison("PricingComparisonToolbar");
	return (
		<div
			data-slot="pricing-comparison-toolbar"
			className={cn(ctx.styles.toolbar(), className)}
			{...props}
		/>
	);
}

/** The "differences only" switch: rows that read the same on every plan fold away. */
export function PricingComparisonDifferences({ className }: { className?: string }) {
	const ctx = useComparison("PricingComparisonDifferences");
	return (
		<Switch
			size="sm"
			className={className}
			label={ctx.labels.differencesOnly}
			checked={ctx.differencesOnly}
			onCheckedChange={ctx.setDifferencesOnly}
		/>
	);
}

/** The full matrix from a 42rem container up; groups fold by grid rows. */
export function PricingComparisonTable({ className, ...props }: ComponentProps<"table">) {
	const ctx = useComparison("PricingComparisonTable");
	const s = ctx.styles;
	const rowId = (g: number, r: number) => `${ctx.id}-g${g}-r${r}`;
	return (
		<table
			data-slot="pricing-comparison-table"
			className={cn(s.table(), className)}
			{...props}
		>
			<caption className="sr-only">{ctx.labels.caption}</caption>
			<colgroup>
				<col className="w-[34%]" />
				{ctx.plans.map((plan) => (
					<col key={plan.id} />
				))}
			</colgroup>
			<thead className={s.head()}>
				<tr>
					<th scope="col" className={s.corner()}>
						{ctx.labels.feature}
					</th>
					{ctx.plans.map((plan) => (
						<th
							key={plan.id}
							scope="col"
							className={cn(
								s.planHead(),
								plan.highlighted && [s.highlight(), s.highlightTop()],
							)}
						>
							{plan.name}
						</th>
					))}
				</tr>
			</thead>
			{ctx.groups.map((group, g) => {
				const open = !ctx.collapsedGroups.includes(group.label);
				const shown = ctx.groupShown(group);
				return (
					<tbody key={group.label} data-slot="pricing-comparison-group">
						<tr aria-hidden={!shown || undefined} inert={!shown || undefined}>
							<th scope="rowgroup" className="p-0 text-left font-normal">
								<Collapse open={shown}>
									<div className={cn(s.cell(), g === 0 && "border-t-0")}>
										<button
											type="button"
											className={s.groupButton()}
											aria-expanded={open}
											aria-controls={group.rows.map((_, r) => rowId(g, r)).join(" ")}
											onClick={() => ctx.toggleGroup(group.label)}
										>
											<svg
												className={s.chevron()}
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												aria-hidden="true"
											>
												<path d="M9 6l6 6l-6 6" />
											</svg>
											{group.label}
										</button>
									</div>
								</Collapse>
							</th>
							{ctx.plans.map((plan) => (
								<td
									key={plan.id}
									className={cn("p-0", plan.highlighted && s.highlight())}
								>
									<Collapse open={shown}>
										<div className={cn(s.cell(), g === 0 && "border-t-0", "h-full")}>
											{" "}
										</div>
									</Collapse>
								</td>
							))}
						</tr>
						{group.rows.map((row, r) => {
							const visible = shown && open && ctx.rowShown(row);
							return (
								<tr
									key={row.feature}
									id={rowId(g, r)}
									aria-hidden={!visible || undefined}
									inert={!visible || undefined}
								>
									<th scope="row" className="p-0 text-left font-normal">
										<Collapse open={visible}>
											<div className={s.cell()}>
												<span className={s.feature()}>{row.feature}</span>
												{row.hint ? <span className={s.hint()}>{row.hint}</span> : null}
											</div>
										</Collapse>
									</th>
									{ctx.plans.map((plan) => (
										<td
											key={plan.id}
											className={cn("p-0", plan.highlighted && s.highlight())}
										>
											<Collapse open={visible}>
												<div className={cn(s.cell(), s.value())}>
													<Mark value={comparisonValue(row, plan.id)} />
												</div>
											</Collapse>
										</td>
									))}
								</tr>
							);
						})}
					</tbody>
				);
			})}
			<tfoot aria-hidden="true">
				<tr>
					<td className="h-3 p-0" />
					{ctx.plans.map((plan) => (
						<td
							key={plan.id}
							className={cn(
								"h-3 p-0",
								plan.highlighted && [s.highlight(), s.highlightEnd()],
							)}
						/>
					))}
				</tr>
			</tfoot>
		</table>
	);
}

/** One plan at a time below a 42rem container, picked from underline tabs. */
export function PricingComparisonMobile({ className, ...props }: ComponentProps<"div">) {
	const ctx = useComparison("PricingComparisonMobile");
	const s = ctx.styles;
	if (!ctx.plans.length) return null;
	return (
		<div
			data-slot="pricing-comparison-mobile"
			className={cn(s.mobile(), className)}
			{...props}
		>
			<Tabs
				variant="underline"
				size="sm"
				value={ctx.mobilePlan?.id ?? ""}
				onValueChange={ctx.setActivePlan}
			>
				<TabsList aria-label={ctx.labels.choosePlan}>
					{ctx.plans.map((plan) => (
						<TabsTrigger key={plan.id} value={plan.id}>
							{plan.name}
						</TabsTrigger>
					))}
				</TabsList>
				{ctx.plans.map((plan) => (
					<TabsContent key={plan.id} value={plan.id}>
						{ctx.groups.map((group, g) => {
							const shown = ctx.groupShown(group);
							const labelId = `${ctx.id}-m${plan.id}-g${g}`;
							return (
								<div
									key={group.label}
									className={s.collapse()}
									data-state={shown ? "open" : "closed"}
									inert={!shown || undefined}
								>
									<div className={s.collapseInner()}>
										<h3 className={s.mobileGroupLabel()} id={labelId}>
											{group.label}
										</h3>
										<ul aria-labelledby={labelId}>
											{group.rows.map((row) => {
												const visible = ctx.rowShown(row);
												return (
													<li
														key={row.feature}
														className={s.collapse()}
														data-state={visible ? "open" : "closed"}
														inert={!visible || undefined}
													>
														<div className={s.collapseInner()}>
															<div className={s.mobileRow()}>
																<span>
																	<span className={s.feature()}>{row.feature}</span>
																	{row.hint ? (
																		<span className={s.hint()}>{row.hint}</span>
																	) : null}
																</span>
																<span className={s.mobileValue()}>
																	<Mark value={comparisonValue(row, plan.id)} />
																</span>
															</div>
														</div>
													</li>
												);
											})}
										</ul>
									</div>
								</div>
							);
						})}
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}

/** Announces, and shows, when "differences only" leaves nothing to compare. */
export function PricingComparisonEmpty({
	className,
	children,
}: {
	className?: string;
	children?: ReactNode;
}) {
	const ctx = useComparison("PricingComparisonEmpty");
	return (
		<p
			className={cn(ctx.nothingDiffers ? ctx.styles.empty() : "sr-only", className)}
			role="status"
		>
			{ctx.nothingDiffers ? (children ?? ctx.labels.noDifferences) : ""}
		</p>
	);
}
