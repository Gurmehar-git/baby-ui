"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { type ReactNode, useRef, useState } from "react";
import { button } from "../../button/variants";
import { cn } from "../../lib/cn";
import {
	type FullscreenNavAlign,
	type FullscreenNavSize,
	type FullscreenNavVariant,
	fullscreenNav,
	linkDelay,
	linkIndex,
	panelDelay,
} from "../variants";

export type { FullscreenNavAlign, FullscreenNavSize, FullscreenNavVariant };

export type NavLink = {
	href: string;
	label: string;
	/** Optional short line under the label. */
	description?: string;
};

export interface FullscreenNavProps {
	links: NavLink[];
	/** Controlled open state; pair with onOpenChange. */
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** href of the page being viewed; that link gets aria-current="page". */
	current?: string;
	title?: string;
	closeLabel?: string;
	/** Prefix each link with 01, 02…. */
	numbered?: boolean;
	variant?: FullscreenNavVariant;
	align?: FullscreenNavAlign;
	size?: FullscreenNavSize;
	/** Content pinned under the links, e.g. contact details or socials. */
	footer?: ReactNode;
	className?: string;
}

/** A full-viewport menu on Base UI's Dialog: staggered links, focus on the first, Escape to close. */
export function FullscreenNav({
	links,
	open: openProp,
	defaultOpen = false,
	onOpenChange,
	current,
	title = "Menu",
	closeLabel = "Close",
	numbered = false,
	variant = "fade",
	align,
	size,
	footer,
	className,
}: FullscreenNavProps) {
	const [innerOpen, setInnerOpen] = useState(defaultOpen);
	const open = openProp ?? innerOpen;
	const firstLinkRef = useRef<HTMLAnchorElement>(null);
	const styles = fullscreenNav({ variant, align, size });

	function setOpen(next: boolean) {
		if (openProp === undefined) setInnerOpen(next);
		onOpenChange?.(next);
	}

	return (
		<DialogPrimitive.Root open={open} onOpenChange={(next) => setOpen(next)}>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Popup
					data-slot="fullscreen-nav"
					data-variant={variant}
					initialFocus={firstLinkRef}
					style={{ transitionDelay: panelDelay(links.length, open) }}
					className={cn(styles.popup(), className)}
				>
					<div className={styles.header()}>
						<DialogPrimitive.Title className={styles.title()}>
							{title}
						</DialogPrimitive.Title>
						<DialogPrimitive.Close
							aria-label={closeLabel}
							className={button({ variant: "outline", size: "icon" })}
						>
							<svg viewBox="0 0 16 16" fill="none" aria-hidden>
								<path
									d="m4 4 8 8M12 4l-8 8"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
								/>
							</svg>
						</DialogPrimitive.Close>
					</div>

					<nav aria-label={title} className={styles.nav()}>
						{links.map((link, i) => (
							<a
								key={link.href}
								ref={i === 0 ? firstLinkRef : undefined}
								href={link.href}
								aria-current={link.href === current ? "page" : undefined}
								onClick={() => setOpen(false)}
								data-state={open ? "open" : "closed"}
								style={{ transitionDelay: linkDelay(i, links.length, open) }}
								className={styles.link()}
							>
								<span className={styles.row()}>
									{numbered ? (
										<span className={styles.index()}>{linkIndex(i)}</span>
									) : null}
									<span className={styles.text()}>
										<span className={styles.label()}>{link.label}</span>
										{link.description ? (
											<span className={styles.description()}>{link.description}</span>
										) : null}
									</span>
								</span>
							</a>
						))}
					</nav>

					{footer ? <div className={styles.footer()}>{footer}</div> : null}
				</DialogPrimitive.Popup>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}
