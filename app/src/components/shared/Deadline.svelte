<script lang="ts">
  import { formatDate, formatTime } from "$lib/utils/date.util";
  import { Badge } from "flowbite-svelte";

  export let deadline: string;
</script>

{#if deadline}
  <div class="flex gap-1">
    <p class="text-sm">Frist for å melde seg på:</p>
    <Badge color="green" rounded>{formatDate(deadline)} kl {formatTime(deadline)}</Badge>
  </div>
{/if}
