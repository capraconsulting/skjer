<script lang="ts">
  import { formatDate, formatTime } from "$lib/utils/date.util";
  import { _ } from "$lib/i18n";
  export let deadline: string;
</script>

<div class="flex w-fit gap-1 rounded-xl bg-gray-100 px-4 py-2 text-sm dark:text-black">
  <p>
    {$_('registration.deadline')} {formatTime(deadline)}, {formatDate(deadline)}
  </p>
</div>
