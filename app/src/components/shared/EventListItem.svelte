<script lang="ts">
  import { formatDate } from "$lib/utils";
  import { Badge } from "flowbite-svelte";
  import { ArrowRight } from "phosphor-svelte";
  import type { EventWithAttending } from "$models/databaseView.model";
  import EventLogos from "./EventLogos.svelte";

  export let event: EventWithAttending;
</script>

<a
  class="hover:bg-lightGreen flex flex-col justify-between rounded-md
  border border-black px-3 py-4 hover:transition-[2s] sm:flex-row
  dark:border-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700"
  href={`/event/${event._id}`}
>
  <div class="flex flex-col gap-3 px-0 font-light sm:flex-row sm:gap-2 sm:px-2">
    <h2 class="pr-3 text-xl">
      {event.title}
    </h2>
    <div class="flex flex-row items-center gap-2">
      <Badge rounded class="h-6 border border-black bg-transparent dark:bg-zinc-800"
        >{event.category}</Badge
      >
      <Badge rounded class="h-6 border border-black bg-transparent dark:bg-zinc-800">
        {formatDate(event.start)}
      </Badge>

      {#if event.attending}
        <Badge rounded class="h-6 border border-black bg-[#FFE663]">Du er påmeldt</Badge>
      {/if}
    </div>
  </div>
  <div class="flex flex-row items-center justify-between gap-6 pt-4 sm:pt-0">
    <div class="flex items-center gap-4">
      <EventLogos {event} />
    </div>
    <ArrowRight class="mr-2" />
  </div>
</a>
