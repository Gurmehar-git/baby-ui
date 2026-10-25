"use client";

import {
	Button,
	DecisionInbox,
	DecisionInboxAction,
	DecisionInboxActions,
	DecisionInboxBody,
	DecisionInboxDetail,
	DecisionInboxEmpty,
	DecisionInboxHeader,
	DecisionInboxItem,
	DecisionInboxList,
	DecisionInboxTitle,
} from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import {
	DECISION_INBOX_COLLAPSED,
	DECISION_INBOX_DECISIONS,
} from "../data/decision-inbox";
import { controlProps } from "../data/preview-props";

export function DecisionInboxDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof DecisionInbox>>(props);
	const [answers, setAnswers] = useState<Record<string, string>>({});
	const [collapsed, setCollapsed] = useState(DECISION_INBOX_COLLAPSED);
	return (
		<div className="flex w-full max-w-110 flex-col items-center gap-3">
			<DecisionInbox
				variant={p.variant}
				value={answers}
				onValueChange={setAnswers}
				collapsed={collapsed}
				onCollapsedChange={setCollapsed}
			>
				<DecisionInboxHeader />
				<DecisionInboxList>
					{DECISION_INBOX_DECISIONS.map((d) => (
						<DecisionInboxItem key={d.id} value={d.id}>
							<DecisionInboxTitle>{d.title}</DecisionInboxTitle>
							<DecisionInboxBody>
								{d.detail ? <DecisionInboxDetail>{d.detail}</DecisionInboxDetail> : null}
								<DecisionInboxActions>
									<DecisionInboxAction value={d.primary.value} primary>
										{d.primary.label}
									</DecisionInboxAction>
									<DecisionInboxAction value={d.secondary.value}>
										{d.secondary.label}
									</DecisionInboxAction>
								</DecisionInboxActions>
							</DecisionInboxBody>
						</DecisionInboxItem>
					))}
				</DecisionInboxList>
				<DecisionInboxEmpty>
					Nothing waiting on you. New decisions show up here.
				</DecisionInboxEmpty>
			</DecisionInbox>
			<Button
				variant="ghost"
				size="sm"
				disabled={Object.keys(answers).length === 0}
				onClick={() => {
					setAnswers({});
					setCollapsed(DECISION_INBOX_COLLAPSED);
				}}
			>
				Reset
			</Button>
		</div>
	);
}
