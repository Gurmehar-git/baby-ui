"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "../button/button";
import { Checkbox } from "../checkbox/checkbox";
import { Input } from "../input/input";
import { cn } from "../lib/cn";
import { RadioGroup, RadioGroupItem } from "../radio-group/radio-group";
import { type QuestionLayout, question } from "./variants";

export type QuestionOption = { value: string; label: string; disabled?: boolean };

export type QuestionItem = {
	id: string;
	title: string;
	description?: string;
	options?: QuestionOption[];
	multiple?: boolean;
	autoAdvance?: boolean;
	allowCustom?: boolean;
	customPlaceholder?: string;
};

export type QuestionAnswer = { selected: string[]; custom?: string };
export type QuestionAnswers = Record<string, QuestionAnswer>;

const EMPTY_ANSWER: QuestionAnswer = { selected: [] };

function isAnswered(answer: QuestionAnswer) {
	return answer.selected.length > 0 || Boolean(answer.custom?.trim());
}

export interface QuestionProps {
	layout?: QuestionLayout;
	questions: QuestionItem[];
	answers?: QuestionAnswers;
	defaultAnswers?: QuestionAnswers;
	onAnswersChange?: (answers: QuestionAnswers) => void;
	step?: number;
	defaultStep?: number;
	onStepChange?: (step: number) => void;
	onSubmit?: (answers: QuestionAnswers) => void;
	submitLabel?: string;
	className?: string;
}

/** One or more questions, stepped through with a sliding entrance; a single-select
 * question with autoAdvance moves on by itself once picked, matching a real form's feel. */
export function Question({
	layout = "card",
	questions,
	answers,
	defaultAnswers = {},
	onAnswersChange,
	step,
	defaultStep = 0,
	onStepChange,
	onSubmit,
	submitLabel = "Submit",
	className,
}: QuestionProps) {
	const groupId = useId();
	const [internalAnswers, setInternalAnswers] = useState<QuestionAnswers>(defaultAnswers);
	const [internalStep, setInternalStep] = useState(defaultStep);
	const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
	const { root } = question({ layout });

	const currentAnswers = answers ?? internalAnswers;
	const currentStep = Math.min(
		Math.max(0, step ?? internalStep),
		Math.max(0, questions.length - 1),
	);
	const item = questions[currentStep];
	const multipleQuestions = questions.length > 1;
	const currentAnswer = item ? (currentAnswers[item.id] ?? EMPTY_ANSWER) : EMPTY_ANSWER;
	const last = currentStep >= questions.length - 1;

	const clearAutoAdvance = useCallback(() => {
		clearTimeout(autoAdvanceTimer.current);
		autoAdvanceTimer.current = undefined;
	}, []);
	useEffect(() => clearAutoAdvance, [clearAutoAdvance]);

	function setAnswers(next: QuestionAnswers) {
		if (answers === undefined) setInternalAnswers(next);
		onAnswersChange?.(next);
	}

	function setStep(next: number) {
		clearAutoAdvance();
		if (step === undefined) setInternalStep(next);
		onStepChange?.(next);
	}

	function updateAnswer(next: QuestionAnswer) {
		if (!item) return;
		setAnswers({ ...currentAnswers, [item.id]: next });
	}

	function continueQuestion() {
		if (!last) {
			setStep(currentStep + 1);
			return;
		}
		onSubmit?.(currentAnswers);
	}

	function queueAutoAdvance() {
		if (!item || item.multiple || item.autoAdvance === false || last) return;
		clearAutoAdvance();
		autoAdvanceTimer.current = setTimeout(() => setStep(currentStep + 1), 240);
	}

	if (!item) return null;

	return (
		<div data-slot="question" className={cn(root(), className)}>
			<div key={item.id} className="question-slide-in flex flex-col gap-1">
				<div className="flex items-start gap-2">
					<p
						id={`${groupId}-title`}
						className="min-w-0 flex-1 font-medium text-foreground text-sm"
					>
						{item.title}
					</p>
					{multipleQuestions ? (
						<span className="shrink-0 text-xs text-muted-foreground tabular-nums">
							{currentStep + 1}/{questions.length}
						</span>
					) : null}
				</div>
				{item.description ? (
					<p className="text-muted-foreground text-xs leading-relaxed">
						{item.description}
					</p>
				) : null}

				{item.options?.length ? (
					<div className="mt-2">
						{item.multiple ? (
							<div className="flex flex-col gap-0.5">
								{item.options.map((option) => (
									<Checkbox
										key={option.value}
										checked={currentAnswer.selected.includes(option.value)}
										disabled={option.disabled}
										label={option.label}
										onCheckedChange={(checked) =>
											updateAnswer({
												...currentAnswer,
												selected: checked
													? [...currentAnswer.selected, option.value]
													: currentAnswer.selected.filter((v) => v !== option.value),
											})
										}
										className="min-h-9 rounded-lg px-1.5 py-1 hover:bg-foreground/[0.04]"
									/>
								))}
							</div>
						) : (
							<RadioGroup
								value={currentAnswer.selected[0] ?? ""}
								onValueChange={(value) => {
									updateAnswer({ selected: [value] });
									queueAutoAdvance();
								}}
								className="gap-0.5"
							>
								{item.options.map((option) => (
									<RadioGroupItem
										key={option.value}
										value={option.value}
										label={option.label}
										disabled={option.disabled}
										className="min-h-9 rounded-lg px-1.5 py-1 hover:bg-foreground/[0.04]"
									/>
								))}
							</RadioGroup>
						)}
					</div>
				) : null}

				{item.allowCustom ? (
					<Input
						value={currentAnswer.custom ?? ""}
						placeholder={item.customPlaceholder ?? "Add another response…"}
						onChange={(e) =>
							updateAnswer({
								selected: item.multiple ? currentAnswer.selected : [],
								custom: e.currentTarget.value,
							})
						}
						className={cn(item.options?.length && "mt-1.5")}
					/>
				) : null}
			</div>

			<div className="mt-3 flex items-center gap-2">
				{multipleQuestions ? (
					<>
						<button
							type="button"
							aria-label="Previous question"
							disabled={currentStep === 0}
							onClick={() => setStep(currentStep - 1)}
							className="grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40"
						>
							<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
								<path
									d="M10 3.5 5.5 8l4.5 4.5"
									stroke="currentColor"
									strokeWidth="1.6"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>
						<span className="flex gap-1.5">
							{questions.map((q, i) => (
								<span
									key={q.id}
									aria-hidden
									className={cn(
										"size-1.5 rounded-full bg-foreground transition-[opacity,scale] duration-(--duration-base) ease-[var(--ease-ui-out)]",
										i === currentStep ? "scale-100 opacity-100" : "scale-75 opacity-35",
									)}
								/>
							))}
						</span>
					</>
				) : null}
				<Button
					size={last ? "sm" : "icon-sm"}
					aria-label={last ? "Submit response" : "Next question"}
					disabled={!isAnswered(currentAnswer)}
					onClick={continueQuestion}
					className="ml-auto rounded-full"
				>
					{last ? (
						<>
							{submitLabel}
							<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
								<path
									d="M3.5 8h9M8.5 4l4 4-4 4"
									stroke="currentColor"
									strokeWidth="1.6"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</>
					) : (
						<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
							<path
								d="M6 3.5 10.5 8 6 12.5"
								stroke="currentColor"
								strokeWidth="1.6"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					)}
				</Button>
			</div>
		</div>
	);
}
