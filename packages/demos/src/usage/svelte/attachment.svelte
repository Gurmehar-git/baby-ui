<script lang="ts">
import {
	Attachment,
	AttachmentContent,
	AttachmentMeta,
	AttachmentName,
	AttachmentPreview,
	AttachmentRemove,
	AttachmentRetry,
	Attachments,
} from "@baby-ui/svelte";
</script>

<Attachments>
	<Attachment name="design-review.pdf" status="uploading" progress={62}>
		<AttachmentPreview />
		<AttachmentContent>
			<AttachmentName />
			<AttachmentMeta>2.4 MB</AttachmentMeta>
		</AttachmentContent>
		<AttachmentRetry onclick={() => console.log("retry")} />
		<AttachmentRemove onclick={() => console.log("removed")} />
	</Attachment>
</Attachments>
