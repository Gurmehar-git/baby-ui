<script lang="ts">
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/svelte/cn";
import QuestionOptions from "./question-options.svelte";
import type { QuestionAnswer, QuestionAnswers, QuestionItem } from "./types";
import { type QuestionLayout, question } from "./variants";

const EMPTY_ANSWER: QuestionAnswer = { selected: [] };

function isAnswered(answer: QuestionAnswer) {
	return answer.selected.length > 0 || Boolean(answer.custom?.trim());
}

let {
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
	class: classProp,
}: {
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
	class?: string;
} = $props();

// svelte-ignore state_referenced_locally -- intentional one-time seed, matching React's useState(initialValue)
let internalAnswers = $state<QuestionAnswers>(defaultAnswers);
// svelte-ignore state_referenced_locally -- intentional one-time seed, matching React's useState(initialValue)
let internalStep = $state(defaultStep);
let autoAdvanceTimer: ReturnType<typeof setTimeout> | undefined;

const slots = $derived(question({ layout }));
const currentAnswers = $derived(answers ?? internalAnswers);
const currentStep = $derived(
	Math.min(Math.max(0, step ?? internalStep), Math.max(0, questions.length - 1)),
);
const item = $derived(questions[currentStep]);
const multipleQuestions = $derived(questions.length > 1);
const currentAnswer = $derived(
	item ? (currentAnswers[item.id] ?? EMPTY_ANSWER) : EMPTY_ANSWER,
);
const last = $derived(currentStep >= questions.length - 1);

function clearAutoAdvance() {
	clearTimeout(autoAdvanceTimer);
	autoAdvanceTimer = undefined;
}

function setAnswers(next: QuestionAnswers) {
	if (answers === undefined) internalAnswers = next;
	onAnswersChange?.(next);
}

function setStep(next: number) {
	clearAutoAdvance();
	if (step === undefined) internalStep = next;
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
	autoAdvanceTimer = setTimeout(() => setStep(currentStep + 1), 240);
}
</script>

{#if item}
	<div data-slot="question" class={cn(slots.root(), classProp)}>
		{#key item.id}
			<div class="question-slide-in flex flex-col gap-1">
				<div class="flex items-start gap-2">
					<p class="min-w-0 flex-1 font-medium text-foreground text-sm">{item.title}</p>
					{#if multipleQuestions}
						<span class="shrink-0 text-xs text-muted-foreground tabular-nums">{currentStep + 1}/{questions.length}</span>
					{/if}
				</div>
				{#if item.description}
					<p class="text-muted-foreground text-xs leading-relaxed">{item.description}</p>
				{/if}

				<QuestionOptions {item} answer={currentAnswer} onChange={updateAnswer} onSingleSelect={queueAutoAdvance} />
			</div>
		{/key}

		<div class="mt-3 flex items-center gap-2">
			{#if multipleQuestions}
				<button
					type="button"
					aria-label="Previous question"
					disabled={currentStep === 0}
					onclick={() => setStep(currentStep - 1)}
					class="grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40"
				>
					<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-3.5">
						<path d="M10 3.5 5.5 8l4.5 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</button>
				<span class="flex gap-1.5">
					{#each questions as q, i (q.id)}
						<span
							aria-hidden="true"
							class={cn(
								"size-1.5 rounded-full bg-foreground transition-[opacity,scale] duration-(--duration-base) ease-[var(--ease-ui-out)]",
								i === currentStep ? "scale-100 opacity-100" : "scale-75 opacity-35",
							)}
						></span>
					{/each}
				</span>
			{/if}
			<Button
				size={last ? "sm" : "icon-sm"}
				aria-label={last ? "Submit response" : "Next question"}
				disabled={!isAnswered(currentAnswer)}
				onclick={continueQuestion}
				class="ml-auto rounded-full"
			>
				{#if last}
					{submitLabel}
					<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-3.5">
						<path d="M3.5 8h9M8.5 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				{:else}
					<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-3.5">
						<path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				{/if}
			</Button>
		</div>
	</div>
{/if}
