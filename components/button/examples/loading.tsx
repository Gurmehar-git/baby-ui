import { Button } from "@baby-ui/components/react/button";
import { useState } from "react";

export default function ButtonLoading() {
	const [saving, setSaving] = useState(false);

	async function save() {
		setSaving(true);
		await new Promise((done) => setTimeout(done, 1200));
		setSaving(false);
	}

	return (
		<Button onClick={save} loading={saving} loadingLabel="Saving changes">
			Save changes
		</Button>
	);
}
