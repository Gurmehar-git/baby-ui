"use client";

import { Autocomplete } from "@base-ui/react/autocomplete";
import {
	type CSSProperties,
	type ReactNode,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { cn } from "../../lib/react/cn";
import { glideHighlight } from "../../lib/react/glide";
import {
	type ExpandingSearchGroup,
	type ExpandingSearchItem,
	groupSearch,
	rankSearch,
	splitSearchMatch,
} from "./search";
import {
	type ExpandingSearchSize,
	type ExpandingSearchVariant,
	expandingSearch,
} from "./variants";

export type { ExpandingSearchItem, ExpandingSearchSize, ExpandingSearchVariant };

export interface ExpandingSearchProps {
	/** Names the button, the field and the results, e.g. "Search projects and docs". */
	label: string;
	items: ExpandingSearchItem[];
	/** Shown before anything is typed, such as recent searches. */
	suggestions?: ExpandingSearchItem[];
	suggestionsLabel?: string;
	placeholder?: string;
	onSelect?: (item: ExpandingSearchItem) => void;
	expanded?: boolean;
	defaultExpanded?: boolean;
	onExpandedChange?: (expanded: boolean) => void;
	/** The typed query, paired with `onValueChange`. */
	value?: string;
	onValueChange?: (value: string) => void;
	/** The widest the field grows, in px; never past its container. */
	expandedWidth?: number;
	maxResults?: number;
	/** The edge the button sits on; the field grows away from it. */
	anchor?: "start" | "end";
	emptyHint?: string;
	variant?: ExpandingSearchVariant;
	size?: ExpandingSearchSize;
	className?: string;
}

const SearchIcon = (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.75"
		aria-hidden
	>
		<circle cx="11" cy="11" r="7" />
		<path d="m20 20-3.5-3.5" strokeLinecap="round" />
	</svg>
);

/**
 * A search that waits as an icon button: it morphs into the field, results unfold beneath it,
 * and Escape, choosing a result or leaving it empty folds it back.
 */
export function ExpandingSearch({
	label,
	items,
	suggestions = [],
	suggestionsLabel = "Recent",
	placeholder,
	onSelect,
	expanded: expandedProp,
	defaultExpanded = false,
	onExpandedChange,
	value,
	onValueChange,
	expandedWidth = 360,
	maxResults = 6,
	anchor = "end",
	emptyHint = "Try a shorter word or check the spelling.",
	variant = "default",
	size = "default",
	className,
}: ExpandingSearchProps) {
	const [ownExpanded, setOwnExpanded] = useState(defaultExpanded);
	const expanded = expandedProp ?? ownExpanded;
	const [ownQuery, setOwnQuery] = useState("");
	const query = value ?? ownQuery;
	const [focused, setFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const highlighted = useRef<ExpandingSearchItem | undefined>(undefined);
	const [list, setList] = useState<HTMLDivElement | null>(null);
	const pillRef = useRef<HTMLSpanElement>(null);

	const setQuery = (next: string) => {
		if (value === undefined) setOwnQuery(next);
		onValueChange?.(next);
	};
	const setExpanded = (next: boolean) => {
		if (expandedProp === undefined) setOwnExpanded(next);
		onExpandedChange?.(next);
	};

	const trimmed = query.trim();
	const results = useMemo(
		() => (trimmed ? rankSearch(items, trimmed, maxResults) : []),
		[items, trimmed, maxResults],
	);
	const mode = !trimmed
		? suggestions.length
			? "suggestions"
			: null
		: results.length
			? "results"
			: "empty";
	const groups: ExpandingSearchGroup[] =
		mode === "suggestions"
			? [{ name: suggestionsLabel, items: suggestions }]
			: mode === "results"
				? groupSearch(results, items)
				: [];
	const open = expanded && focused && mode !== null;

	useEffect(() => {
		if (list && pillRef.current) return glideHighlight(list, pillRef.current);
	}, [list]);

	// Focus moves inside the click so touch keyboards open; the field is inert until it renders expanded.
	const expand = () => {
		const input = inputRef.current;
		if (input) {
			input.inert = false;
			input.focus({ preventScroll: true });
		}
		setFocused(true);
		setExpanded(true);
	};
	const collapse = (returnFocus: boolean) => {
		setQuery("");
		setFocused(false);
		setExpanded(false);
		if (returnFocus)
			requestAnimationFrame(() => buttonRef.current?.focus({ preventScroll: true }));
	};
	const choose = (item: ExpandingSearchItem | undefined) => {
		if (!item) return;
		collapse(true);
		onSelect?.(item);
	};

	const s = expandingSearch({ size, variant });
	const match = (text: string): ReactNode => {
		if (mode !== "results") return text;
		const [before, hit, after] = splitSearchMatch(text, trimmed);
		return (
			<>
				{before}
				{hit && <mark>{hit}</mark>}
				{after}
			</>
		);
	};

	return (
		<div
			data-slot="expanding-search"
			data-anchor={anchor}
			className={cn(s.root(), className)}
			style={{ "--es-max": `${expandedWidth}px` } as CSSProperties}
		>
			<Autocomplete.Root
				items={groups}
				filteredItems={groups}
				value={query}
				onValueChange={(next, details) => {
					if (details.reason === "item-press") {
						choose(
							highlighted.current ??
								[...items, ...suggestions].find((item) => item.title === next),
						);
						return;
					}
					setQuery(next);
				}}
				open={open}
				onOpenChange={(next, details) => {
					if (!next && details.reason === "escape-key") collapse(true);
				}}
				onItemHighlighted={(item) => {
					highlighted.current = item;
				}}
				itemToStringValue={(item: ExpandingSearchItem) => item.title}
				autoHighlight={mode === "results"}
			>
				<div data-expanded={expanded || undefined} className={s.shell()}>
					<button
						ref={buttonRef}
						type="button"
						aria-label={label}
						hidden={expanded}
						className={s.trigger()}
						onClick={expand}
					/>
					<span className={s.icon()}>{SearchIcon}</span>
					<Autocomplete.Input
						ref={inputRef}
						inert={!expanded}
						aria-label={label}
						placeholder={placeholder ?? label}
						autoComplete="off"
						spellCheck={false}
						enterKeyHint="search"
						className={s.input()}
						onFocus={() => setFocused(true)}
						onKeyDown={(event) => {
							if (event.key === "Escape" && !open) collapse(true);
						}}
						onBlur={() => {
							// Switching windows keeps the search as it was.
							if (!document.hasFocus()) return;
							setFocused(false);
							if (!inputRef.current?.value.trim()) collapse(false);
						}}
					/>
					{expanded && query && (
						<button
							type="button"
							tabIndex={-1}
							aria-label="Clear search"
							className={s.clear()}
							onMouseDown={(event) => event.preventDefault()}
							onClick={() => {
								setQuery("");
								inputRef.current?.focus({ preventScroll: true });
							}}
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.75"
								aria-hidden
							>
								<path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
							</svg>
						</button>
					)}
				</div>
				<Autocomplete.Portal>
					<Autocomplete.Positioner
						sideOffset={8}
						align={anchor === "end" ? "end" : "start"}
						className="isolate z-50"
					>
						<Autocomplete.Popup className={s.popup()}>
							{mode === "empty" ? (
								<div className={s.empty()}>
									<p className={s.emptyTitle()}>No results for "{trimmed}"</p>
									<p className={s.emptyHint()}>{emptyHint}</p>
								</div>
							) : (
								<Autocomplete.List ref={setList} className={s.list()}>
									<span ref={pillRef} aria-hidden className={s.pill()} />
									{groups.map((group) => (
										<Autocomplete.Group key={group.name} items={group.items}>
											{group.name && (
												<Autocomplete.GroupLabel className={s.groupLabel()}>
													{group.name}
												</Autocomplete.GroupLabel>
											)}
											{group.items.map((item) => (
												<Autocomplete.Item
													key={item.id}
													value={item}
													className={s.item()}
												>
													<span className="grid min-w-0">
														<span className={s.title()}>{match(item.title)}</span>
														{item.meta && <span className={s.meta()}>{item.meta}</span>}
													</span>
												</Autocomplete.Item>
											))}
										</Autocomplete.Group>
									))}
								</Autocomplete.List>
							)}
						</Autocomplete.Popup>
					</Autocomplete.Positioner>
				</Autocomplete.Portal>
			</Autocomplete.Root>
		</div>
	);
}
