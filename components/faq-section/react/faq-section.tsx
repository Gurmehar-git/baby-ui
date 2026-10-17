"use client";

import {
	type ComponentProps,
	createContext,
	type ReactNode,
	useContext,
	useId,
	useState,
} from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../../accordion/react/accordion";
import { Button } from "../../button/react/button";
import { cn } from "../../lib/cn";
import { SearchInput } from "../../search-input/react/search-input";
import { ToggleGroup, ToggleGroupItem } from "../../toggle-group/react/toggle-group";
import {
	type FaqItem,
	faqCategories,
	faqCategory,
	faqHint,
	faqKey,
	faqMatches,
	highlightParts,
} from "../faq";
import { type FaqSectionVariant, faqSection } from "../variants";

export type { FaqItem, FaqSectionVariant };

type FaqSectionState = {
	items: FaqItem[];
	variant: FaqSectionVariant;
	type: "single" | "multiple";
	titleId: string;
	categories: string[];
	open: string[];
	setOpen: (next: string | string[]) => void;
	topic: string;
	setTopic: (next: string | string[]) => void;
	text: string;
	setText: (next: string) => void;
	shown: FaqItem[];
	styles: ReturnType<typeof faqSection>;
};

const FaqSectionContext = createContext<FaqSectionState | null>(null);

function useFaqSection() {
	const state = useContext(FaqSectionContext);
	if (!state) throw new Error("FaqSection parts must be rendered inside a FaqSection.");
	return state;
}

export interface FaqSectionProps extends Omit<ComponentProps<"section">, "children"> {
	items: FaqItem[];
	/** `accordion` is one centred list, `columns` adds a topic rail, `search` filters as you type. */
	variant?: FaqSectionVariant;
	/** Several answers open at once. */
	type?: "single" | "multiple";
	/** Open item ids (an item's `id`, else its question). */
	value?: string[];
	onValueChange?: (value: string[]) => void;
	/** Active topic in the columns variant. */
	category?: string;
	onCategoryChange?: (category: string) => void;
	/** Search text in the search variant. */
	query?: string;
	onQueryChange?: (query: string) => void;
	children?: ReactNode;
}

/**
 * An FAQ section from parts: FaqSectionHeader, FaqSectionSearch, FaqSectionList and
 * FaqSectionContact; the columns variant puts the header and FaqSectionTopics in FaqSectionRail.
 */
export function FaqSection({
	items,
	variant = "accordion",
	type = "single",
	value,
	onValueChange,
	category,
	onCategoryChange,
	query,
	onQueryChange,
	className,
	children,
	...props
}: FaqSectionProps) {
	const titleId = useId();
	const styles = faqSection({ variant });
	const categories = faqCategories(items);
	const [ownOpen, setOwnOpen] = useState<string[]>(() =>
		items[0] ? [faqKey(items[0])] : [],
	);
	const [ownCategory, setOwnCategory] = useState(categories[0] ?? "General");
	const [ownQuery, setOwnQuery] = useState("");
	const text = variant === "search" ? (query ?? ownQuery) : "";

	const state: FaqSectionState = {
		items,
		variant,
		type,
		titleId,
		categories,
		open: value ?? ownOpen,
		setOpen: (next) => {
			const list = Array.isArray(next) ? next : next ? [next] : [];
			if (value === undefined) setOwnOpen(list);
			onValueChange?.(list);
		},
		topic: category ?? ownCategory,
		setTopic: (next) => {
			const picked = Array.isArray(next) ? next[0] : next;
			if (!picked) return;
			if (category === undefined) setOwnCategory(picked);
			onCategoryChange?.(picked);
		},
		text,
		setText: (next) => {
			if (query === undefined) setOwnQuery(next);
			onQueryChange?.(next);
		},
		shown: items.filter((item) => faqMatches(item, text)),
		styles,
	};

	return (
		<FaqSectionContext.Provider value={state}>
			<section
				data-slot="faq-section"
				data-variant={variant}
				aria-labelledby={titleId}
				className={cn(styles.root(), className)}
				{...props}
			>
				<div className={variant === "columns" ? styles.grid() : styles.stack()}>
					{children}
				</div>
			</section>
		</FaqSectionContext.Provider>
	);
}

export function FaqSectionHeader({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useFaqSection();
	return (
		<div
			data-slot="faq-section-header"
			className={cn(styles.intro(), className)}
			{...props}
		/>
	);
}

/** The heading that names the section. */
export function FaqSectionTitle({ className, ...props }: ComponentProps<"h2">) {
	const { titleId, styles } = useFaqSection();
	return (
		<h2
			data-slot="faq-section-title"
			id={titleId}
			className={cn(styles.title(), className)}
			{...props}
		/>
	);
}

export function FaqSectionDescription({ className, ...props }: ComponentProps<"p">) {
	const { styles } = useFaqSection();
	return (
		<p
			data-slot="faq-section-description"
			className={cn(styles.description(), className)}
			{...props}
		/>
	);
}

/** The search field and a live result count; filters FaqSectionList as you type. */
export function FaqSectionSearch({
	label = "Search questions",
	className,
}: {
	/** Accessible name; also the placeholder. */
	label?: string;
	className?: string;
}) {
	const { items, text, setText, shown, styles } = useFaqSection();
	return (
		<div data-slot="faq-section-search" className={cn(styles.searchRow(), className)}>
			<SearchInput label={label} value={text} onValueChange={setText} />
			<p className={styles.resultCount()} aria-live="polite">
				{text.trim()
					? `${shown.length} ${shown.length === 1 ? "answer" : "answers"}`
					: `${items.length} questions`}
			</p>
		</div>
	);
}

/** The columns variant's side column: header, FaqSectionTopics and contact. */
export function FaqSectionRail({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useFaqSection();
	return (
		<div
			data-slot="faq-section-rail"
			className={cn(styles.rail(), className)}
			{...props}
		/>
	);
}

/** A topic switcher built from each item's `category`, with a count per topic. */
export function FaqSectionTopics({
	label = "Question topics",
	className,
}: {
	label?: string;
	className?: string;
}) {
	const { items, categories, topic, setTopic, styles } = useFaqSection();
	return (
		<ToggleGroup
			data-slot="faq-section-topics"
			variant="segmented"
			orientation="vertical"
			label={label}
			value={topic}
			onValueChange={setTopic}
			className={cn(styles.topics(), className)}
		>
			{categories.map((entry) => (
				<ToggleGroupItem key={entry} value={entry} className={styles.topic()}>
					{entry}
					<span className={styles.count()}>
						{items.filter((item) => faqCategory(item) === entry).length}
					</span>
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
}

function Marked({ copy }: { copy: string }) {
	const { text, styles } = useFaqSection();
	return highlightParts(copy, text).map((part, index) =>
		part.match ? (
			// biome-ignore lint/suspicious/noArrayIndexKey: runs of one string never reorder.
			<mark key={index} className={styles.mark()}>
				{part.text}
			</mark>
		) : (
			part.text
		),
	);
}

function Questions({ entries, filtered }: { entries: FaqItem[]; filtered?: boolean }) {
	const { type, open, setOpen, text, styles } = useFaqSection();
	return (
		<Accordion
			type={type}
			value={type === "multiple" ? open : (open[0] ?? "")}
			onValueChange={setOpen}
			className={styles.list()}
		>
			{entries.map((item) => {
				const key = faqKey(item);
				const hint = faqHint(item, text, open.includes(key));
				const gone = Boolean(filtered) && !faqMatches(item, text);
				return (
					<AccordionItem
						key={key}
						value={key}
						data-hidden={gone}
						inert={gone}
						className={styles.row()}
					>
						<div className={styles.rowInner()}>
							<AccordionTrigger className={styles.trigger()}>
								<span className="min-w-0">
									<Marked copy={item.question} />
								</span>
							</AccordionTrigger>
							{hint ? (
								<p className={styles.hint()}>
									<Marked copy={hint} />
								</p>
							) : null}
							<AccordionContent className={styles.answer()}>
								<Marked copy={item.answer} />
							</AccordionContent>
						</div>
					</AccordionItem>
				);
			})}
		</Accordion>
	);
}

/** The questions; one list per topic in the columns variant, filtered rows folded away in search. */
export function FaqSectionList({ className }: { className?: string }) {
	const { items, variant, categories, topic, styles } = useFaqSection();
	if (variant !== "columns")
		return (
			<div data-slot="faq-section-list" className={className}>
				<Questions entries={items} filtered />
			</div>
		);
	return (
		<div data-slot="faq-section-list" className={cn(styles.stage(), className)}>
			{categories.map((entry) => (
				<div
					key={entry}
					data-active={entry === topic}
					inert={entry !== topic}
					className={styles.panel()}
				>
					<div className={styles.panelInner()}>
						<Questions entries={items.filter((item) => faqCategory(item) === entry)} />
					</div>
				</div>
			))}
		</div>
	);
}

/** Shown when a search matches nothing, with a button that clears it. */
export function FaqSectionEmpty({ className }: { className?: string }) {
	const { variant, text, setText, shown, styles } = useFaqSection();
	if (variant !== "search" || !text.trim() || shown.length > 0) return null;
	return (
		<div data-slot="faq-section-empty" className={cn(styles.empty(), className)}>
			<p>No answers mention "{text.trim()}".</p>
			<Button size="sm" variant="outline" onClick={() => setText("")}>
				Clear search
			</Button>
		</div>
	);
}

export interface FaqSectionContactProps {
	/** A link when set, otherwise a button. */
	href?: string;
	onClick?: () => void;
	/** A second line under the label. */
	description?: ReactNode;
	className?: string;
	children?: ReactNode;
}

/** A way to reach a person when the answer is not listed. */
export function FaqSectionContact({
	href,
	onClick,
	description,
	className,
	children,
}: FaqSectionContactProps) {
	const { styles } = useFaqSection();
	const inner = (
		<>
			<span className={styles.contactText()}>
				<span className={styles.contactLabel()}>{children}</span>
				{description ? (
					<span className={styles.contactDescription()}>{description}</span>
				) : null}
			</span>
			<svg
				aria-hidden="true"
				viewBox="0 0 16 16"
				fill="none"
				className={styles.contactArrow()}
			>
				<path
					d="M3 8h10M9 4l4 4-4 4"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</>
	);
	return href ? (
		<a
			data-slot="faq-section-contact"
			href={href}
			onClick={onClick}
			className={cn(styles.contact(), className)}
		>
			{inner}
		</a>
	) : (
		<button
			data-slot="faq-section-contact"
			type="button"
			onClick={onClick}
			className={cn(styles.contact(), className)}
		>
			{inner}
		</button>
	);
}
