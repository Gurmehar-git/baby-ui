"use client";

import {
	SplitButton,
	SplitButtonAction,
	SplitButtonContent,
	SplitButtonItem,
	SplitButtonMenu,
	SplitButtonTrigger,
} from "@baby-ui/react";

export function Example({ save, saveAs }: { save: () => void; saveAs: () => void }) {
	return (
		<SplitButton>
			<SplitButtonAction onClick={save}>Save</SplitButtonAction>
			<SplitButtonMenu>
				<SplitButtonTrigger />
				<SplitButtonContent>
					<SplitButtonItem onClick={saveAs}>Save as…</SplitButtonItem>
				</SplitButtonContent>
			</SplitButtonMenu>
		</SplitButton>
	);
}
