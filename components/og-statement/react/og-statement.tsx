import { cn } from "../../lib/cn";
import { type OgStatementMode, ogStatement } from "../variants";

export type { OgStatementMode };

export interface OgStatementProps {
	/** The statement, up to three lines, set bottom left. */
	title: string;
	/** Mark image URL, top left. */
	logo?: string;
	mode?: OgStatementMode;
	className?: string;
}

/** A 1200x630 card: a mark top left and one large statement bottom left. Render it with takumi-js. */
export function OgStatement({
	title,
	logo,
	mode = "light",
	className,
}: OgStatementProps) {
	const s = ogStatement({ mode });
	return (
		<div data-slot="og-statement" className={cn(s.root(), className)}>
			{logo ? <img src={logo} alt="" className={s.logo()} /> : <span />}
			<p className={s.title()}>{title}</p>
		</div>
	);
}
