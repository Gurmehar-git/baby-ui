import type {
	ChangeSummaryDirection,
	ChangeSummaryTone,
} from "../../../../components/change-summary/variants";

export type SampleChange = {
	label: string;
	change: string;
	tone: ChangeSummaryTone;
	direction?: ChangeSummaryDirection;
};

export const CHANGE_SUMMARY_CHANGES: SampleChange[] = [
	{ label: "Active users", change: "Up 6.1% to 18.2K", tone: "positive" },
	{ label: "Activation", change: "Down 2.4 points to 41%", tone: "negative" },
	{
		label: "Churn",
		change: "Down 0.3 points to 1.8%",
		tone: "positive",
		direction: "down",
	},
	{ label: "Support tickets", change: "Flat at 212", tone: "neutral" },
];
