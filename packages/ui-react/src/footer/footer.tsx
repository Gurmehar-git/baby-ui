import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { NotchedShelf } from "../notched-shelf/notched-shelf";
import { type FooterLayout, footer } from "./variants";

export type { FooterLayout };

export type FooterLink = {
	label: string;
	href: string;
	external?: boolean;
	/** A second muted line under the label, e.g. a product's kind. */
	description?: string;
};
export type FooterColumn = { title: string; links: FooterLink[] };
/** `icon` draws the square icon button; without one the label shows as text. */
export type FooterSocialLink = { icon?: ReactNode; href: string; label: string };

export interface FooterProps {
	brand?: ReactNode;
	description?: string;
	columns: FooterColumn[];
	socials?: FooterSocialLink[];
	copyright?: ReactNode;
	/** Policy links beside the copyright. */
	legal?: FooterLink[];
	/** Small controls beside the copyright, e.g. a theme toggle. */
	actions?: ReactNode;
	/** Giant background wordmark text; omit to skip that section entirely. */
	wordmark?: string;
	/** Target of the notched layout's back-to-top tab; the tab only renders with one. */
	topHref?: string;
	topLabel?: string;
	layout?: FooterLayout;
	/** A system status link with a pulsing dot in its tone. */
	status?: FooterStatus;
	className?: string;
}

function ArrowUpRight() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
			className="size-3.5"
		>
			<path d="M17 7 7 17M8 7h9v9" />
		</svg>
	);
}

const externalProps = (link: { href: string; external?: boolean }) =>
	link.external ? { target: "_blank", rel: "noreferrer" } : {};

export interface FooterStatus {
	label: string;
	href?: string;
	tone?: "success" | "warning" | "destructive";
}

export function Footer({
	brand,
	description,
	columns,
	socials = [],
	copyright,
	legal = [],
	actions,
	wordmark,
	topHref,
	topLabel = "Back to top",
	layout = "split",
	status,
	className,
}: FooterProps) {
	const styles = footer({ layout });
	const notched = layout === "notched";

	const legalList = legal.length ? (
		<ul className={styles.legal()}>
			{legal.map((link) => (
				<li key={link.href}>
					<a href={link.href} {...externalProps(link)} className={styles.bottomLink()}>
						{link.label}
					</a>
				</li>
			))}
		</ul>
	) : null;
	const actionsSlot = actions ? <div className={styles.actions()}>{actions}</div> : null;
	const statusDot = (
		<span aria-hidden data-tone={status?.tone} className={styles.statusDot()} />
	);
	const statusLink = status ? (
		status.href ? (
			<a href={status.href} className={styles.status()}>
				{statusDot}
				{status.label}
			</a>
		) : (
			<p className={styles.status()}>
				{statusDot}
				{status.label}
			</p>
		)
	) : null;

	return (
		<footer
			data-slot="footer"
			data-layout={layout}
			className={cn(styles.root(), className)}
		>
			{notched && topHref ? (
				<div className={styles.notch()}>
					<NotchedShelf fill="text-background">
						<a href={topHref} className={styles.topLink()}>
							<svg
								viewBox="0 0 16 16"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.6"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden
								className={styles.topIcon()}
							>
								<path d="M8 13.5V3M3.5 7.5 8 3l4.5 4.5" />
							</svg>
							{topLabel}
						</a>
					</NotchedShelf>
				</div>
			) : null}
			<div className={styles.inner()}>
				<div className={styles.grid()}>
					<div className={styles.brandBlock()}>
						{brand ? (
							<span className="inline-flex items-center gap-2.5">{brand}</span>
						) : null}
						{description ? <p className={styles.description()}>{description}</p> : null}
						{socials.length ? (
							<ul className={styles.socials()}>
								{socials.map(({ icon, href, label }) => {
									const external = href.startsWith("http");
									return (
										<li key={href}>
											<a
												href={href}
												aria-label={icon && !notched ? label : undefined}
												{...externalProps({ href, external })}
												className={icon && !notched ? styles.social() : styles.link()}
											>
												{icon && !notched ? (
													icon
												) : (
													<>
														{label}
														{external ? <ArrowUpRight /> : null}
													</>
												)}
											</a>
										</li>
									);
								})}
							</ul>
						) : null}
						{!notched && copyright ? (
							<p className={styles.copyright()}>{copyright}</p>
						) : null}
						{!notched ? statusLink : null}
						{!notched ? legalList : null}
						{!notched ? actionsSlot : null}
					</div>

					<div className={styles.columns()}>
						{columns.map((column) => (
							<div key={column.title} className={styles.column()}>
								<h4 className={styles.columnTitle()}>{column.title}</h4>
								<ul className={styles.links()}>
									{column.links.map((link) => (
										<li key={link.href}>
											<a
												href={link.href}
												{...externalProps(link)}
												className={styles.link()}
											>
												<span>
													<span className="inline-flex items-center gap-1">
														{link.label}
														{link.external ? <ArrowUpRight /> : null}
													</span>
													{link.description ? (
														<span className={styles.linkDescription()}>
															{link.description}
														</span>
													) : null}
												</span>
											</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

				{notched ? (
					<>
						<span aria-hidden className={styles.rule()} />
						<div className={styles.bottom()}>
							{copyright ? <p>{copyright}</p> : null}
							{statusLink}
							{legalList}
							{actionsSlot}
						</div>
					</>
				) : null}
			</div>

			{wordmark ? (
				<div className={styles.wordmarkWrap()}>
					<span className={styles.wordmark()}>{wordmark}</span>
				</div>
			) : null}
		</footer>
	);
}
