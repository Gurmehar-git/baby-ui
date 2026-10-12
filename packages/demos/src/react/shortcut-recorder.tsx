"use client";

import { ShortcutRecorder } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

const BINDINGS = [
	{ id: "palette", label: "Command palette", shortcut: "mod+k" },
	{ id: "new", label: "New document", shortcut: "mod+shift+n" },
];

export function ShortcutRecorderDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ShortcutRecorder>>(props);
	const [value, setValue] = useState<string | null>("mod+shift+f");
	return (
		<div className="w-full max-w-sm">
			<ShortcutRecorder
				label={p.label || "Search files"}
				value={value}
				onValueChange={setValue}
				defaultValue="mod+shift+f"
				bindings={BINDINGS}
				warnReserved={p.warnReserved}
				requireModifier={p.requireModifier}
				size={p.size}
			/>
		</div>
	);
}
