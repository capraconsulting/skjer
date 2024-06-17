<script lang="ts">
  import { formatDateWithWeekDay, formatTime } from "$lib/utils/date.util";
  import { Badge } from "flowbite-svelte";

  export let deadline: string;
</script>

<div class="flex gap-1">
  <p class="text-sm">Fristen for å melde seg på er</p>
  <Badge color="yellow" rounded class="h-5"
    >{formatDateWithWeekDay(deadline)} kl {formatTime(deadline)}</Badge
  >
</div>
