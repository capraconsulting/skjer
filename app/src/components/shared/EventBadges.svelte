<script lang="ts">
  import { formatDate } from "$lib/utils/date.util";
  import { Badge } from "flowbite-svelte";
  import type { EventWithAttending } from "$models/databaseView.model";

  export let event: EventWithAttending;
  $: startDate = formatDate(event.start);
</script>

<div class="flex flex-row flex-wrap content-center gap-2">
  {#if event.openForExternals}
    <Badge
      class="h-6 whitespace-nowrap rounded-lg border border-gray-300 bg-transparent dark:bg-zinc-800"
    >
      For alle
    </Badge>
  {:else}
    <Badge
      rounded
      class="h-6 whitespace-nowrap rounded-lg border border-gray-300 bg-transparent dark:bg-zinc-800"
    >
      Kun interne
    </Badge>
  {/if}
  {#if event.category}
    <Badge
      rounded
      class="h-6 whitespace-nowrap rounded-lg border border-gray-300 bg-transparent dark:bg-zinc-800"
    >
      {event.category}
    </Badge>
  {/if}
  <Badge
    rounded
    class={`h-6 whitespace-nowrap rounded-lg border ${
      startDate === "I dag"
        ? "border-transparent bg-zinc-800 text-white dark:bg-white dark:text-black"
        : "border-gray-300 bg-transparent dark:bg-zinc-800"
    }`}
  >
    {startDate}
  </Badge>

  {#if event.attending}
    <Badge rounded class="h-6 whitespace-nowrap rounded-lg border-none bg-yellowSpark text-black">
      Du er påmeldt
    </Badge>
  {/if}
</div>
