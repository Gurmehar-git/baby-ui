import type {
	ReactionBarTone,
	ReactionIcon,
} from "../../../../components/reaction-bar/variants";

export type SampleReaction = {
	value: ReactionIcon;
	label: string;
	count: number;
	tone: ReactionBarTone;
};

export const REACTION_BAR_ITEMS: SampleReaction[] = [
	{ value: "like", label: "Like", count: 1284, tone: "destructive" },
	{ value: "comment", label: "Comment", count: 86, tone: "primary" },
	{ value: "repost", label: "Repost", count: 12, tone: "violet" },
	{ value: "share", label: "Share", count: 0, tone: "default" },
];
