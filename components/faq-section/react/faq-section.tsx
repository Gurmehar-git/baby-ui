"use client";

import { useId, useState } from "react";
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
	type FaqContact,
	type FaqItem,
	faqCategories,
	faqCategory,
	faqHint,
	faqKey,
	faqMatches,
	highlightParts,
} from "../faq";
import { type FaqSectionVariant, faqSection } from "../variants";

export type { FaqContact, FaqItem, FaqSectionVariant };

export interface FaqSectionProps {
	items: FaqItem[];
	/** `accordion` is one centred list, `columns` adds a topic rail, `search` filters as you type. */
	variant?: FaqSectionVariant;
	title?: string;
	description?: string;
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
	/** A way to reach a person when the answer is not listed. */
	contact?: FaqContact;
	searchLabel?: string;
	className?: string;
}

/** An FAQ section: a centred accordion, a topic rail beside its questions, or a list that filters and highlights as you type. */
export function FaqSection({
	items,
	variant = "accordion",
	title = "Frequently asked questions",
	description,
	type = "single",
	value,
	onValueChange,
	category,
	onCategoryChange,
	query,
	onQueryChange,
	contact,
	searchLabel = "Search questions",
	className,
}: FaqSectionProps) {
	const id = useId();
	const s = faqSection({ variant });
	const categories = faqCategories(items);
	const [ownOpen, setOwnOpen] = useState<string[]>(() =>
		items[0] ? [faqKey(items[0])] : [],
	);
	const [ownCategory, setOwnCategory] = useState(categories[0] ?? "General");
	const [ownQuery, setOwnQuery] = useState("");
	const open = value ?? ownOpen;
	const topic = category ?? ownCategory;
	const text = variant === "search" ? (query ?? ownQuery) : "";
	const setOpen = (next: string | string[]) => {
		const list = Array.isArray(next) ? next : next ? [next] : [];
		if (value === undefined) setOwnOpen(list);
		onValueChange?.(list);
	};
	const setTopic = (next: string | string[]) => {
		const picked = Array.isArray(next) ? next[0] : next;
		if (!picked) return;
		if (category === undefined) setOwnCategory(picked);
		onCategoryChange?.(picked);
	};
	const setText = (next: string) => {
		if (query === undefined) setOwnQuery(next);
		onQueryChange?.(next);
	};
	const shown = items.filter((item) => faqMatches(item, text));
	const marked = (copy: string) =>
		highlightParts(copy, text).map((part, index) =>
			part.match ? (
				// biome-ignore lint/suspicious/noArrayIndexKey: runs of one string never reorder.
				<mark key={index} className={s.mark()}>
					{part.text}
				</mark>
			) : (
				part.text
			),
		);

	const list = (entries: FaqItem[], hidden: (item: FaqItem) => boolean = () => false) => (
		<Accordion
			type={type}
			value={type === "multiple" ? open : (open[0] ?? "")}
			onValueChange={setOpen}
			className={s.list()}
		>
			{entries.map((item) => {
				const key = faqKey(item);
				const hint = faqHint(item, text, open.includes(key));
				const gone = hidden(item);
				return (
					<AccordionItem
						key={key}
						value={key}
						data-hidden={gone}
						inert={gone}
						className={s.row()}
					>
						<div className={s.rowInner()}>
							<AccordionTrigger className={s.trigger()}>
								<span className="min-w-0">{marked(item.question)}</span>
							</AccordionTrigger>
							{hint ? <p className={s.hint()}>{marked(hint)}</p> : null}
							<AccordionContent className={s.answer()}>
								{marked(item.answer)}
							</AccordionContent>
						</div>
					</AccordionItem>
				);
			})}
		</Accordion>
	);

	const intro = (
		<div className={s.intro()}>
			<h2 id={`${id}-title`} className={s.title()}>
				{title}
			</h2>
			{description ? <p className={s.description()}>{description}</p> : null}
		</div>
	);

	const reach = contact ? <ContactLink contact={contact} styles={s} /> : null;

	return (
		<section
			data-slot="faq-section"
			data-variant={variant}
			aria-labelledby={`${id}-title`}
			className={cn(s.root(), className)}
		>
			{variant === "columns" ? (
				<div className={s.grid()}>
					<div className={s.rail()}>
						{intro}
						<ToggleGroup
							variant="segmented"
							orientation="vertical"
							label="Question topics"
							value={topic}
							onValueChange={setTopic}
							className={s.topics()}
						>
							{categories.map((entry) => (
								<ToggleGroupItem key={entry} value={entry} className={s.topic()}>
									{entry}
									<span className={s.count()}>
										{items.filter((item) => faqCategory(item) === entry).length}
									</span>
								</ToggleGroupItem>
							))}
						</ToggleGroup>
						{reach}
					</div>
					<div className={s.stage()}>
						{categories.map((entry) => (
							<div
								key={entry}
								data-active={entry === topic}
								inert={entry !== topic}
								className={s.panel()}
							>
								<div className={s.panelInner()}>
									{list(items.filter((item) => faqCategory(item) === entry))}
								</div>
							</div>
						))}
					</div>
				</div>
			) : (
				<div className={s.stack()}>
					{intro}
					{variant === "search" ? (
						<div className={s.searchRow()}>
							<SearchInput label={searchLabel} value={text} onValueChange={setText} />
							<p className={s.resultCount()} aria-live="polite">
								{text.trim()
									? `${shown.length} ${shown.length === 1 ? "answer" : "answers"}`
									: `${items.length} questions`}
							</p>
						</div>
					) : null}
					{list(items, (item) => !faqMatches(item, text))}
					{variant === "search" && text.trim() && shown.length === 0 ? (
						<div className={s.empty()}>
							<p>No answers mention "{text.trim()}".</p>
							<Button size="sm" variant="outline" onClick={() => setText("")}>
								Clear search
							</Button>
						</div>
					) : null}
					{reach}
				</div>
			)}
		</section>
	);
}

function ContactLink({
	contact,
	styles,
}: {
	contact: FaqContact;
	styles: ReturnType<typeof faqSection>;
}) {
	const inner = (
		<>
			<span className={styles.contactText()}>
				<span className={styles.contactLabel()}>{contact.label}</span>
				{contact.description ? (
					<span className={styles.contactDescription()}>{contact.description}</span>
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
	return contact.href ? (
		<a
			data-slot="faq-contact"
			href={contact.href}
			onClick={contact.onClick}
			className={styles.contact()}
		>
			{inner}
		</a>
	) : (
		<button
			data-slot="faq-contact"
			type="button"
			onClick={contact.onClick}
			className={styles.contact()}
		>
			{inner}
		</button>
	);
}
