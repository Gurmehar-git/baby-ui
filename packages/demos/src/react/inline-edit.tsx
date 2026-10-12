"use client";

import { InlineEdit } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

const request = () => new Promise<void>((resolve) => setTimeout(resolve, 700));

export function InlineEditDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof InlineEdit>>(props);
	const [name, setName] = useState("Atlas redesign");
	return (
		<InlineEdit
			label="Project name"
			value={name}
			placeholder="Untitled project"
			variant={p.variant}
			size={p.size}
			multiline={p.multiline}
			validate={(next) => (next ? null : "A project needs a name.")}
			onSave={async (next) => {
				await request();
				setName(next);
			}}
		/>
	);
}
