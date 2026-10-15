<script lang="ts">
import FieldError from "../field/field-error.svelte";
import { fileUploadState } from "./context";
import { rejectionMessage } from "./core";

let { class: classProp }: { class?: string } = $props();

const ctx = fileUploadState("FileUploadError");
</script>

<FieldError
	class={classProp}
	errors={ctx.rejections.map((r) => ({
		message: rejectionMessage(r, ctx.labels, { maxSize: ctx.maxSize, maxFiles: ctx.maxFiles }),
	}))}
/>
