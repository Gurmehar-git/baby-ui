"use client";

import {
	TipsPanel,
	TipsPanelAction,
	TipsPanelContent,
	TipsPanelGrid,
	TipsPanelHeader,
	TipsPanelProgress,
	TipsPanelTip,
	TipsPanelTipDescription,
	TipsPanelTipTitle,
	TipsPanelTitle,
} from "@baby-ui/react";
import { useState } from "react";

export function Example() {
	const [done, setDone] = useState<string[]>([]);
	return (
		<TipsPanel value={done} onValueChange={setDone}>
			<TipsPanelHeader>
				<TipsPanelTitle>Tips</TipsPanelTitle>
				<TipsPanelProgress />
			</TipsPanelHeader>
			<TipsPanelContent>
				<TipsPanelGrid>
					<TipsPanelTip value="invite">
						<TipsPanelTipTitle>Invite your team</TipsPanelTipTitle>
						<TipsPanelTipDescription>
							Work on projects together in one place.
						</TipsPanelTipDescription>
						<TipsPanelAction doneLabel="Invited">Invite</TipsPanelAction>
					</TipsPanelTip>
					<TipsPanelTip value="digest">
						<TipsPanelTipTitle>Weekly digest</TipsPanelTipTitle>
						<TipsPanelTipDescription>
							A short summary every Monday morning.
						</TipsPanelTipDescription>
						<TipsPanelAction primary doneLabel="On">
							Turn on
						</TipsPanelAction>
					</TipsPanelTip>
				</TipsPanelGrid>
			</TipsPanelContent>
		</TipsPanel>
	);
}
