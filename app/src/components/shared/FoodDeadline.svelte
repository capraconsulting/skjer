<script lang="ts">
  import { formatDate, formatTime } from "$lib/utils/date.util";
  export let foodDeadline: string;
</script>

<div class="flex w-fit gap-1 rounded-xl bg-gray-100 px-4 py-2 text-sm dark:text-black">
  <p>
    Matpåmeldingsfrist kl. {formatTime(foodDeadline)}, {formatDate(foodDeadline)}
  </p>
</div>
