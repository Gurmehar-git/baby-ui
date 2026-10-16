<script lang="ts">
import type { ComponentProps } from "svelte";
import CalendarCaption from "../../calendar/svelte/calendar-caption.svelte";

let props: ComponentProps<typeof CalendarCaption> = $props();
</script>

<!-- The caption reads the shared chooser, so both calendars use one part. -->
<CalendarCaption {...props} />
