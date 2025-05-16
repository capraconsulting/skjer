<script lang="ts">
  import { formatDate, formatTime } from "$lib/utils/date.util";
  import { _, locale } from "$lib/i18n";
  export let deadline: string;

  // Reactive variables to update when locale changes
  $: formattedTime = formatTime(deadline);
  $: formattedDate = formatDate(deadline);

  // Update formatted values when locale changes
  $: if ($locale) {
    formattedTime = formatTime(deadline);
    formattedDate = formatDate(deadline);
  }
</script>

<div class="flex w-fit gap-1 rounded-xl bg-gray-100 px-4 py-2 text-sm dark:text-black">
  <p>
    {$_('registration.deadline')} {formattedTime}, {formattedDate}
  </p>
</div>
