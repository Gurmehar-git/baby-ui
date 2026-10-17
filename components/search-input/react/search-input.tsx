"use client";

import { type InputHTMLAttributes, useRef, useState } from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "../../input-group/react/input-group";
import type { InputGroupSize } from "../../input-group/variants";
import { cn } from "../../lib/cn";
import { Shortcut } from "../../shortcut/react/shortcut";
import { type SearchInputVariant, searchInput } from "../variants";

export type { SearchInputVariant };

export interface SearchInputProps
	extends Omit<
		InputHTMLAttributes<HTMLInputElement>,
		"type" | "value" | "defaultValue" | "size"
	> {
	/** Accessible name; also the placeholder unless one is given. */
	label: string;
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	/** A key that focuses the field from anywhere, e.g. `"/"` or `"mod+k"`; shown while empty. */
	shortcut?: string;
	variant?: SearchInputVariant;
	size?: InputGroupSize;
}

/**
 * A search field with a leading glass, a clear button in a reserved slot, and an optional
 * shortcut that focuses it. Clearing returns focus to the field.
 */
export function SearchInput({
	label,
	value,
	defaultValue = "",
	onValueChange,
	shortcut,
	variant = "default",
	size = "default",
	placeholder,
	className,
	...props
}: SearchInputProps) {
	const [own, setOwn] = useState(defaultValue);
	const text = value ?? own;
	const inputRef = useRef<HTMLInputElement>(null);
	const set = (next: string) => {
		if (value === undefined) setOwn(next);
		onValueChange?.(next);
	};
	const s = searchInput({ variant });
	return (
		<InputGroup size={size} data-slot="search-input" className={cn(s.root(), className)}>
			<InputGroupAddon>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.75"
					aria-hidden
					className={s.icon()}
				>
					<circle cx="11" cy="11" r="7" />
					<path d="m20 20-3.5-3.5" strokeLinecap="round" />
				</svg>
			</InputGroupAddon>
			<InputGroupInput
				{...props}
				ref={inputRef}
				type="search"
				aria-label={label}
				placeholder={placeholder ?? label}
				value={text}
				onChange={(event) => set(event.target.value)}
				onKeyDown={(event) => {
					props.onKeyDown?.(event);
					if (event.key === "Escape" && text) {
						event.preventDefault();
						set("");
					}
				}}
				className={s.input()}
			/>
			<InputGroupAddon align="inline-end">
				<span className={s.end()}>
					{shortcut && (
						<span data-on={!text} className={s.shortcut()}>
							<Shortcut
								shortcut={shortcut}
								size="sm"
								onTrigger={() => inputRef.current?.focus()}
							/>
						</span>
					)}
					<button
						type="button"
						aria-label="Clear search"
						data-on={!!text}
						tabIndex={text ? 0 : -1}
						className={s.clear()}
						onClick={() => {
							set("");
							inputRef.current?.focus();
						}}
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							aria-hidden
						>
							<path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
						</svg>
					</button>
				</span>
			</InputGroupAddon>
		</InputGroup>
	);
}
