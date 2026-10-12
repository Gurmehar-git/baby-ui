<script lang="ts">
import {
	Button,
	ButtonGroup,
	ButtonGroupSeparator,
	ButtonGroupText,
	Input,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ButtonGroup>>(props));
</script>

<div class="flex flex-col items-center gap-4">
	<ButtonGroup aria-label="Message actions" orientation={p.orientation}>
		<Button variant="outline">Archive</Button>
		<Button variant="outline">Report</Button>
		<Button variant="outline">Snooze</Button>
	</ButtonGroup>
	<ButtonGroup aria-label="Publish">
		<Button>Publish</Button>
		<ButtonGroupSeparator />
		<Button>Schedule</Button>
	</ButtonGroup>
	<ButtonGroup>
		<ButtonGroupText>https://</ButtonGroupText>
		<Input aria-label="Domain" placeholder="example.com" />
	</ButtonGroup>
</div>
