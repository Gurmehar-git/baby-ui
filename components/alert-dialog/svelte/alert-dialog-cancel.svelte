<script lang="ts">
import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
import { button } from "../../button/svelte/variants";
import { cn } from "../../lib/svelte/cn";

let { class: classProp, ...rest }: AlertDialogPrimitive.CancelProps = $props();
</script>

<AlertDialogPrimitive.Cancel
	{...rest}
	data-slot="alert-dialog-cancel"
	class={cn(button({ variant: "outline" }), classProp)}
/>
