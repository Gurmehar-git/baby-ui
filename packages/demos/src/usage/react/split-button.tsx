"use client";

import { SplitButton } from "@baby-ui/react";

export function Example({ save, saveAs }: { save: () => void; saveAs: () => void }) {
	return (
		<SplitButton
			label="Save"
			onClick={save}
			actions={[{ label: "Save as…", onSelect: saveAs }]}
		/>
	);
}
