<script lang="ts">
  import { formatDateWithWeekDay, formatTime } from "$lib/utils/date.util";
  export let deadline: string;
</script>

<div class="flex gap-1">
  <p>
    Fristen for å melde seg på er {formatDateWithWeekDay(deadline)} kl {formatTime(deadline)}
  </p>
</div>
