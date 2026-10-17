import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import {
	DOT_CORNERS,
	HATCH_MARKS,
	RULE_MARKS,
	type ShowcaseFrame,
	type ShowcaseSpan,
	showcaseGrid,
	showcasePanel,
} from "../variants";

export type { ShowcaseFrame, ShowcaseSpan };

export interface ShowcaseGridProps {
	children: ReactNode;
	className?: string;
	/** `rulers` draws corner ticks and hatch squares outside the grid from `md` up. */
	frame?: ShowcaseFrame;
}

export function ShowcaseGrid({
	children,
	className,
	frame = "rulers",
}: ShowcaseGridProps) {
	const s = showcaseGrid({ frame });
	return (
		<div data-slot="showcase-grid" className={cn(s.root(), className)}>
			{children}
			<div aria-hidden="true" className={s.rules()}>
				{RULE_MARKS.map((mark) => (
					<span key={mark} className={cn(s.rule(), mark)} />
				))}
				{HATCH_MARKS.map((mark) => (
					<span key={mark} className={cn(s.hatch(), mark)} />
				))}
			</div>
		</div>
	);
}

export interface ShowcasePanelProps {
	children?: ReactNode;
	className?: string;
	/** Columns out of 12 from `md` up; below it every panel is full width. */
	span?: ShowcaseSpan;
	/** Top-right controls, shown on hover or focus and always on touch screens. */
	actions?: ReactNode;
}

export function ShowcasePanel({
	children,
	className,
	span = 12,
	actions,
}: ShowcasePanelProps) {
	const s = showcasePanel({ span });
	return (
		<div data-slot="showcase-panel" className={cn(s.root(), className)}>
			{DOT_CORNERS.map((corner) => (
				<span key={corner} aria-hidden="true" className={cn(s.dot(), corner)} />
			))}
			{actions ? <div className={s.actions()}>{actions}</div> : null}
			<div className={s.content()}>{children}</div>
		</div>
	);
}
