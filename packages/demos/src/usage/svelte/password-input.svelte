<script lang="ts">
import { PasswordInput, passwordRules } from "@baby-ui/svelte";

const RULES = passwordRules(12);
</script>

<PasswordInput label="New password" name="password" rules={RULES} />
