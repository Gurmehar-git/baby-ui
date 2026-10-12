"use client";

import { LetterMorph } from "@baby-ui/react";

export function Example({ following }: { following: boolean }) {
	return <LetterMorph text={following ? "Following" : "Follow"} />;
}
