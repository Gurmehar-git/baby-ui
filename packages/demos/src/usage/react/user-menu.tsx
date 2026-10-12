"use client";

import { UserMenu, type UserStatus } from "@baby-ui/react";
import { useState } from "react";

export function Example() {
	const [status, setStatus] = useState<UserStatus>("available");
	return (
		<UserMenu
			user={{ name: "Sam Rivera", email: "sam@acme.dev" }}
			status={status}
			onStatusChange={setStatus}
			items={[{ label: "Settings", shortcut: "⌘," }]}
			onSignOut={() => fetch("/logout", { method: "POST" })}
		/>
	);
}
