"use client";

import { PasswordInput, passwordRules } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

const RULES = passwordRules(12);

export function PasswordInputDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof PasswordInput>>(props);
	return (
		<div className="w-full max-w-xs">
			<PasswordInput
				label={p.label || "New password"}
				placeholder="New password"
				rules={RULES}
				size={p.size}
			/>
		</div>
	);
}
