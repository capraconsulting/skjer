<script lang="ts">
  import { formatDate } from "$lib/utils/date.util";
  import { Badge } from "flowbite-svelte";
  import type { EventWithAttending } from "$models/databaseView.model";

  export let event: EventWithAttending;
</script>

<div class="flex flex-wrap items-center gap-2">
  {#if event.openForExternals}
    <Badge
      class="h-6 whitespace-nowrap rounded-lg border border-gray-300 bg-transparent dark:bg-zinc-800"
      >For alle</Badge
    >
  {:else}
    <Badge
      rounded
      class="h-6 whitespace-nowrap rounded-lg border border-gray-300 bg-transparent dark:bg-zinc-800"
      >Kun interne</Badge
    >
  {/if}
  {#if event.category}
    <Badge
      rounded
      class="h-6 whitespace-nowrap rounded-lg border border-gray-300 bg-transparent dark:bg-zinc-800"
      >{event.category}</Badge
    >
  {/if}
  <Badge
    rounded
    class="h-6 whitespace-nowrap rounded-lg border border-gray-300 bg-transparent dark:bg-zinc-800"
  >
    {formatDate(event.start)}
  </Badge>

  {#if event.attending}
    <Badge rounded class="h-6 whitespace-nowrap rounded-lg border-none bg-yellowSpark text-black"
      >Du er påmeldt</Badge
    >
  {/if}
</div>
