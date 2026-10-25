"use client";

import {
	Button,
	TipsPanel,
	TipsPanelAction,
	TipsPanelContent,
	TipsPanelFooter,
	TipsPanelGrid,
	TipsPanelHeader,
	TipsPanelProgress,
	TipsPanelTip,
	TipsPanelTipDescription,
	TipsPanelTipTitle,
	TipsPanelTitle,
} from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";
import { TIPS_PANEL_TIPS } from "../data/tips-panel";

export function TipsPanelDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof TipsPanel>>(props);
	const [done, setDone] = useState<string[]>([]);
	return (
		<TipsPanel variant={p.variant} value={done} onValueChange={setDone}>
			<TipsPanelHeader>
				<TipsPanelTitle>Tips</TipsPanelTitle>
				<TipsPanelProgress />
			</TipsPanelHeader>
			<TipsPanelContent>
				<TipsPanelGrid>
					{TIPS_PANEL_TIPS.map((tip) => (
						<TipsPanelTip key={tip.id} value={tip.id}>
							<TipsPanelTipTitle>{tip.title}</TipsPanelTipTitle>
							<TipsPanelTipDescription>{tip.description}</TipsPanelTipDescription>
							<TipsPanelAction primary={tip.primary} doneLabel={tip.doneLabel}>
								{tip.action}
							</TipsPanelAction>
						</TipsPanelTip>
					))}
				</TipsPanelGrid>
			</TipsPanelContent>
			<TipsPanelFooter>
				<Button
					variant="ghost"
					size="sm"
					disabled={done.length === 0}
					onClick={() => setDone([])}
				>
					Reset
				</Button>
			</TipsPanelFooter>
		</TipsPanel>
	);
}
