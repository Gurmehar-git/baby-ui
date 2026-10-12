"use client";

import { type ThemePreference, UserMenu, type UserStatus } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";
import { fakeSignOut, MENU_ITEMS, MENU_USER } from "../data/user-menu";

type Props = Record<string, unknown>;

export function UserMenuDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof UserMenu>>(props);
	const [status, setStatus] = useState<UserStatus>("available");
	const [theme, setTheme] = useState<ThemePreference>("system");
	return (
		<div className="grid min-h-24 place-items-center">
			<UserMenu
				user={MENU_USER}
				status={status}
				onStatusChange={setStatus}
				theme={theme}
				onThemeChange={setTheme}
				items={MENU_ITEMS}
				onSignOut={fakeSignOut}
				signOutShortcut="⇧⌘Q"
				showName={p.showName}
				size={p.size}
				align="center"
			/>
		</div>
	);
}
