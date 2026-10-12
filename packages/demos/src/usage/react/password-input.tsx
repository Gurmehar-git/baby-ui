"use client";

import { PasswordInput, passwordRules } from "@baby-ui/react";

const RULES = passwordRules(12);

export function Example() {
	return <PasswordInput label="New password" name="password" rules={RULES} />;
}
