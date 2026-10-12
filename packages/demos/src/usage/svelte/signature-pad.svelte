<script lang="ts">
import { type InkStroke, SignaturePad, signatureToSvg } from "@baby-ui/svelte";

let strokes = $state<InkStroke[]>([]);
const svg = $derived(
	signatureToSvg(strokes, { default: "#111", primary: "#2563eb", violet: "#7c3aed" }),
);
</script>

<form action="/api/sign" method="post">
	<SignaturePad bind:value={strokes} signer="Maya Chen" />
	<input type="hidden" name="signature" value={svg} />
</form>
