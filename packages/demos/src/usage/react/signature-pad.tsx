"use client";

import { type InkStroke, SignaturePad, signatureToSvg } from "@baby-ui/react";
import { useState } from "react";

export function Example() {
	const [strokes, setStrokes] = useState<InkStroke[]>([]);
	const svg = signatureToSvg(strokes, {
		default: "#111",
		primary: "#2563eb",
		violet: "#7c3aed",
	});
	return (
		<form action="/api/sign" method="post">
			<SignaturePad value={strokes} onValueChange={setStrokes} signer="Maya Chen" />
			<input type="hidden" name="signature" value={svg} />
		</form>
	);
}
