"use client";

import { ShortcutRecorder } from "@baby-ui/react";
import { useState } from "react";

export function Example() {
	const [shortcut, setShortcut] = useState<string | null>("mod+k");
	return (
		<ShortcutRecorder
			label="Open search"
			value={shortcut}
			onValueChange={setShortcut}
			defaultValue="mod+k"
		/>
	);
}
