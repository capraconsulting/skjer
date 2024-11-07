<script lang="ts">
  import { formatDate, formatTime } from "$lib/utils/date.util";
  export let deadline: string;
</script>

<div class="flex text-sm gap-1 rounded-xl bg-gray-100 py-2 px-4 w-fit">
  <p>
    Påmeldingsfrist kl.{formatTime(deadline)}, {formatDate(deadline)}
  </p>
</div>
