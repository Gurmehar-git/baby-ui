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
