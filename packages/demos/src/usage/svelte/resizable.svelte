<script lang="ts">
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@baby-ui/svelte";
</script>

<div class="h-64">
	<ResizablePanelGroup aria-label="Editor">
		<ResizablePanel id="files" label="Files" defaultSize={30} collapsible>Files</ResizablePanel>
		<ResizableHandle />
		<ResizablePanel id="code" label="Code" defaultSize={70}>Code</ResizablePanel>
	</ResizablePanelGroup>
</div>
