"use client";

import { Fragment, useId, useState } from "react";
import { Button } from "../../button/react/button";
import { cn } from "../../lib/cn";
import { RollingDigits } from "../../rolling-digits/react/rolling-digits";
import { Switch } from "../../switch/react/switch";
import { ToggleGroup, ToggleGroupItem } from "../../toggle-group/react/toggle-group";
import {
	type ComparisonBilling,
	type ComparisonColumn,
	type ComparisonRow,
	type ComparisonSection,
	type ComparisonValue,
	columnPrice,
	comparisonCell,
	hasBilling,
	rowIsShared,
} from "../compare";
import { type ComparisonTableVariant, comparisonTable } from "../variants";

export type {
	ComparisonBilling,
	ComparisonColumn,
	ComparisonRow,
	ComparisonSection,
	ComparisonTableVariant,
	ComparisonValue,
};

export interface ComparisonTableProps {
	columns: ComparisonColumn[];
	sections: ComparisonSection[];
	/** `plain` sits on the page; `card` frames the matrix in a bordered surface. */
	variant?: ComparisonTableVariant;
	title?: string;
	description?: string;
	/** Hide rows where every column reads the same. */
	differencesOnly?: boolean;
	onDifferencesOnlyChange?: (value: boolean) => void;
	billing?: ComparisonBilling;
	onBillingChange?: (billing: ComparisonBilling) => void;
	/** The chosen column, tinted down its length. */
	value?: string | null;
	onValueChange?: (id: string | null) => void;
	/** Caps the height and scrolls inside, with the header row sticking to the top. */
	maxHeight?: string;
	footnote?: string;
	locale?: string;
	className?: string;
}

const ICONS = {
	check: "M6.6 11.3l3 3 5.9-6.4",
	minus: "M7 11h8",
};

/** A feature matrix for plans or products: prices with a billing switch, sections, and a differences-only filter. */
export function ComparisonTable({
	columns,
	sections,
	variant = "plain",
	title,
	description,
	differencesOnly: diffProp,
	onDifferencesOnlyChange,
	billing: billingProp,
	onBillingChange,
	value,
	onValueChange,
	maxHeight,
	footnote,
	locale,
	className,
}: ComparisonTableProps) {
	const id = useId();
	const s = comparisonTable({ variant });
	const [ownDiff, setOwnDiff] = useState(false);
	const [ownBilling, setOwnBilling] = useState<ComparisonBilling>("monthly");
	const [ownValue, setOwnValue] = useState<string | null>(null);
	const diff = diffProp ?? ownDiff;
	const billing = billingProp ?? ownBilling;
	const chosen = value !== undefined ? value : ownValue;
	const money = new Intl.NumberFormat(locale, {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	});
	const rows = sections.flatMap((section) => section.rows);
	const shown = rows.filter((row) => !(diff && rowIsShared(row, columns))).length;
	const setDiff = (next: boolean) => {
		if (diffProp === undefined) setOwnDiff(next);
		onDifferencesOnlyChange?.(next);
	};
	const setBilling = (next: string | string[]) => {
		const picked = next === "yearly" ? "yearly" : next === "monthly" ? "monthly" : null;
		if (!picked) return;
		if (billingProp === undefined) setOwnBilling(picked);
		onBillingChange?.(picked);
	};
	const choose = (column: ComparisonColumn) => {
		const next = chosen === column.id ? null : column.id;
		if (value === undefined) setOwnValue(next);
		onValueChange?.(next);
		column.action?.onClick?.();
	};

	const mark = (raw: ComparisonValue | undefined) => {
		const cell = comparisonCell(raw);
		const icon = (d: string, className: string, label: string) => (
			<>
				<svg aria-hidden="true" viewBox="0 0 22 22" fill="none" className={className}>
					<circle
						cx="11"
						cy="11"
						r="9.5"
						stroke="currentColor"
						strokeWidth="1.5"
						opacity={0.35}
					/>
					<path
						d={d}
						stroke="currentColor"
						strokeWidth="1.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
				<span className="sr-only">{label}</span>
			</>
		);
		return (
			<>
				{cell.value === true ? (
					icon(ICONS.check, s.check(), "Included")
				) : cell.value === false ? (
					icon(ICONS.minus, s.missing(), "Not included")
				) : cell.value === "partial" ? (
					<>
						<svg
							aria-hidden="true"
							viewBox="0 0 22 22"
							fill="none"
							className={s.partial()}
						>
							<circle cx="11" cy="11" r="9.25" stroke="currentColor" strokeWidth="1.5" />
							<path d="M11 1.75a9.25 9.25 0 0 1 0 18.5z" fill="currentColor" />
						</svg>
						<span className="sr-only">Partly</span>
					</>
				) : (
					<span>{cell.value}</span>
				)}
				{cell.note ? <span className={s.note()}>{cell.note}</span> : null}
			</>
		);
	};

	return (
		<section
			data-slot="comparison-table"
			data-variant={variant}
			aria-labelledby={title ? `${id}-title` : undefined}
			className={cn(s.root(), className)}
		>
			<div className={s.inner()}>
				<header className={s.header()}>
					<div className={s.heading()}>
						{title ? (
							<h2 id={`${id}-title`} className={s.title()}>
								{title}
							</h2>
						) : null}
						{description ? <p className={s.description()}>{description}</p> : null}
					</div>
					<div className={s.controls()}>
						{hasBilling(columns) ? (
							<ToggleGroup
								variant="segmented"
								size="sm"
								label="Billing period"
								value={billing}
								onValueChange={setBilling}
							>
								<ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
								<ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
							</ToggleGroup>
						) : null}
						<Switch checked={diff} onCheckedChange={setDiff} label="Differences only" />
						<span className={s.count()} aria-live="polite">
							<RollingDigits value={shown} startOnView={false} /> of {rows.length}{" "}
							features
						</span>
					</div>
				</header>
				<div
					className={s.scroller()}
					style={maxHeight ? { maxHeight, overflowY: "auto" } : undefined}
				>
					{/* biome-ignore lint/a11y: rows fold on CSS grid rows, which a native table cannot animate. */}
					<div
						role="table"
						aria-label={title ?? "Comparison"}
						className={s.table()}
						style={{
							gridTemplateColumns: `minmax(11rem, 1.4fr) repeat(${columns.length}, minmax(8rem, 1fr))`,
						}}
					>
						{/* biome-ignore lint/a11y: rows fold on CSS grid rows, which a native table cannot animate. */}
						<div role="row" className={cn(s.row(), s.headRow())} style={{ top: 0 }}>
							{/* biome-ignore lint/a11y: rows fold on CSS grid rows, which a native table cannot animate. */}
							<div role="columnheader" className={s.labelCell()}>
								<span className="sr-only">Feature</span>
							</div>
							{columns.map((column) => {
								const price = columnPrice(column, billing);
								return (
									// biome-ignore lint/a11y: rows fold on CSS grid rows, which a native table cannot animate.
									<div
										key={column.id}
										role="columnheader"
										data-highlight={Boolean(column.highlight)}
										data-selected={chosen === column.id}
										className={cn(s.cell(), s.colHead())}
									>
										<span className={s.colName()}>{column.name}</span>
										{column.caption ? (
											<span className={s.colCaption()}>{column.caption}</span>
										) : null}
										{price !== undefined ? (
											<span>
												<RollingDigits
													variant="count"
													value={price}
													format={money.format}
													startOnView={false}
													className={s.price()}
												/>
												<span className={s.period()}> per seat / month</span>
											</span>
										) : null}
										{column.action ? (
											column.action.href ? (
												<Button
													size="sm"
													variant={column.highlight ? "default" : "outline"}
													href={column.action.href}
												>
													{column.action.label}
												</Button>
											) : (
												<Button
													size="sm"
													variant={
														chosen === column.id || column.highlight
															? "default"
															: "outline"
													}
													aria-pressed={chosen === column.id}
													onClick={() => choose(column)}
												>
													{chosen === column.id ? "Selected" : column.action.label}
												</Button>
											)
										) : null}
									</div>
								);
							})}
						</div>
						{sections.map((section) => (
							<Fragment key={section.id}>
								{section.title ? (
									// biome-ignore lint/a11y: rows fold on CSS grid rows, which a native table cannot animate.
									<div role="row" className={s.row()}>
										{/* biome-ignore lint/a11y: rows fold on CSS grid rows, which a native table cannot animate. */}
										<div role="rowheader" className={s.section()}>
											{section.title}
										</div>
									</div>
								) : null}
								{section.rows.map((row) => {
									const gone = diff && rowIsShared(row, columns);
									return (
										// biome-ignore lint/a11y: rows fold on CSS grid rows, which a native table cannot animate.
										<div
											key={row.id}
											role="row"
											data-hidden={gone}
											aria-hidden={gone || undefined}
											className={s.fold()}
										>
											<div className={s.foldInner()}>
												{/* biome-ignore lint/a11y: rows fold on CSS grid rows, which a native table cannot animate. */}
												<div role="rowheader" className={s.labelCell()}>
													<span>{row.feature}</span>
													{row.hint ? <span className={s.hint()}>{row.hint}</span> : null}
												</div>
												{columns.map((column) => (
													// biome-ignore lint/a11y: rows fold on CSS grid rows, which a native table cannot animate.
													<div
														key={column.id}
														role="cell"
														data-highlight={Boolean(column.highlight)}
														data-selected={chosen === column.id}
														className={s.cell()}
													>
														{mark(row.values[column.id])}
													</div>
												))}
											</div>
										</div>
									);
								})}
							</Fragment>
						))}
					</div>
				</div>
				{footnote ? <p className={s.footnote()}>{footnote}</p> : null}
			</div>
		</section>
	);
}
