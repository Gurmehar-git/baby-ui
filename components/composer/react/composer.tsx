"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../../dropdown-menu/react/dropdown-menu";
import { cn } from "../../lib/react/cn";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "../../select/react/select";
import { COMPOSER_LINE_HEIGHT, type ComposerSize, composer } from "./variants";

export type ComposerModel = {
	value: string;
	label: ReactNode;
	icon?: ReactNode;
	disabled?: boolean;
};

export type ComposerAction = {
	value: string;
	label: ReactNode;
	description?: ReactNode;
	icon?: ReactNode;
	disabled?: boolean;
};

export interface ComposerProps {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	loading?: boolean;
	onStop?: () => void;
	minRows?: number;
	maxRows?: number;
	size?: ComposerSize;
	models?: ComposerModel[];
	model?: string;
	defaultModel?: string;
	onModelChange?: (model: string) => void;
	actions?: ComposerAction[];
	onAction?: (value: string) => void;
	leadingAction?: ReactNode;
	onSubmit?: (value: string, model?: string) => void;
	className?: string;
}

const ACTIONS_TRIGGER =
	"flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-(--duration-instant) hover:bg-accent hover:text-accent-foreground data-[popup-open]:bg-accent data-[popup-open]:text-foreground [&>svg]:transition-transform [&>svg]:duration-(--duration-fast) [&>svg]:ease-[var(--ease-ui-out)] data-[popup-open]:[&>svg]:rotate-45";

/** Controlled/uncontrolled `value` and `model`, same contract as Select/Accordion elsewhere in this registry. */
export function Composer({
	value,
	defaultValue = "",
	onValueChange,
	placeholder = "Send a message…",
	disabled = false,
	loading = false,
	onStop,
	minRows = 1,
	maxRows = 8,
	size = "default",
	models = [],
	model,
	defaultModel,
	onModelChange,
	actions = [],
	onAction,
	leadingAction,
	onSubmit,
	className,
}: ComposerProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const mirrorRef = useRef<HTMLDivElement>(null);
	const [internalValue, setInternalValue] = useState(defaultValue);
	const [internalModel, setInternalModel] = useState(defaultModel ?? models[0]?.value);
	const [actionsOpen, setActionsOpen] = useState(false);

	const currentValue = value ?? internalValue;
	const currentModelValue = model ?? internalModel;
	const currentModel = models.find((m) => m.value === currentModelValue);
	const canSubmit = currentValue.trim() !== "" && !disabled && !loading;
	const lineHeight = COMPOSER_LINE_HEIGHT[size];
	const { root, textarea, toolbar } = composer({ size });

	const resize = useCallback(() => {
		const el = textareaRef.current;
		const mirror = mirrorRef.current;
		if (!el || !mirror) return;
		const next = Math.min(
			Math.max(mirror.scrollHeight, minRows * lineHeight),
			maxRows * lineHeight,
		);
		el.style.height = `${next}px`;
	}, [minRows, maxRows, lineHeight]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: currentValue.
	useLayoutEffect(resize, [resize, currentValue]);

	function setValue(next: string) {
		if (value === undefined) setInternalValue(next);
		onValueChange?.(next);
	}

	function setModel(next: string) {
		if (model === undefined) setInternalModel(next);
		onModelChange?.(next);
	}

	function submit() {
		const text = currentValue.trim();
		if (!text || disabled || loading) return;
		onSubmit?.(text, currentModelValue);
		if (value === undefined) setInternalValue("");
		textareaRef.current?.focus();
	}

	// Enter sends, Shift+Enter breaks the line; a composing Enter (finishing an IME
	// conversion) commits text, not the message, and must not submit.
	function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
		if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
		event.preventDefault();
		submit();
	}

	return (
		<div
			data-slot="composer"
			className={cn(root(), disabled && "pointer-events-none opacity-50", className)}
		>
			<div
				ref={mirrorRef}
				aria-hidden
				className={cn(
					textarea(),
					"pointer-events-none invisible absolute inset-x-2 top-0 whitespace-pre-wrap [overflow-wrap:break-word]",
				)}
			>
				{`${currentValue}​`}
			</div>
			<textarea
				ref={textareaRef}
				rows={minRows}
				value={currentValue}
				placeholder={placeholder}
				disabled={disabled}
				onChange={(e) => setValue(e.currentTarget.value)}
				onKeyDown={onKeyDown}
				className={textarea()}
			/>

			<div className={toolbar()}>
				{actions.length ? (
					<DropdownMenu open={actionsOpen} onOpenChange={setActionsOpen}>
						<DropdownMenuTrigger aria-label="Add to prompt" className={ACTIONS_TRIGGER}>
							<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
								<path
									d="M8 3.5v9M3.5 8h9"
									stroke="currentColor"
									strokeWidth="1.6"
									strokeLinecap="round"
								/>
							</svg>
						</DropdownMenuTrigger>
						<DropdownMenuContent side="top" align="start" className="w-56">
							{actions.map((action) => (
								<DropdownMenuItem
									key={action.value}
									disabled={action.disabled}
									onClick={() => {
										onAction?.(action.value);
										setActionsOpen(false);
									}}
									className="items-start gap-2.5 py-2"
								>
									{action.icon ? (
										<span className="mt-0.5 grid size-5 shrink-0 place-items-center text-muted-foreground [&_svg]:size-4">
											{action.icon}
										</span>
									) : null}
									<span className="min-w-0">
										<span className="block text-foreground text-sm">{action.label}</span>
										{action.description ? (
											<span className="mt-0.5 block text-muted-foreground text-xs leading-4">
												{action.description}
											</span>
										) : null}
									</span>
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				) : null}

				{leadingAction}

				{models.length ? (
					<Select
						value={currentModelValue}
						onValueChange={setModel}
						items={models}
						disabled={disabled || loading}
					>
						<SelectTrigger className="h-8 w-auto max-w-52 gap-1.5 rounded-full border-0 bg-transparent px-2 text-xs hover:bg-accent">
							<span className="flex min-w-0 items-center gap-1.5">
								{currentModel?.icon ? (
									<span className="grid size-4 shrink-0 place-items-center text-muted-foreground [&_svg]:size-3.5">
										{currentModel.icon}
									</span>
								) : null}
								<span className="truncate text-muted-foreground">
									{currentModel?.label ?? "Choose model"}
								</span>
							</span>
						</SelectTrigger>
						<SelectContent align="start" className="w-52">
							{models.map((m) => (
								<SelectItem
									key={m.value}
									value={m.value}
									disabled={m.disabled}
									className="py-2"
								>
									<span className="flex min-w-0 items-center gap-2">
										{m.icon ? (
											<span className="grid size-5 shrink-0 place-items-center text-muted-foreground [&_svg]:size-4">
												{m.icon}
											</span>
										) : null}
										<span className="min-w-0 truncate text-foreground text-sm">
											{m.label}
										</span>
									</span>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				) : null}

				<button
					type="button"
					onClick={loading ? onStop : submit}
					disabled={loading ? !onStop : !canSubmit}
					aria-label={loading ? "Stop generating" : "Send message"}
					className="ml-auto grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-[transform,scale,translate] duration-[var(--duration-press)] ease-[var(--ease-ui-out)] active:scale-[var(--press-scale)] disabled:pointer-events-none disabled:opacity-40"
				>
					{loading ? (
						<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden className="size-2.5">
							<rect x="1" y="1" width="14" height="14" rx="3" />
						</svg>
					) : (
						<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
							<path
								d="M8 13V3.5M4 7l4-4 4 4"
								stroke="currentColor"
								strokeWidth="1.6"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					)}
				</button>
			</div>
		</div>
	);
}
