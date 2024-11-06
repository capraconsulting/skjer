<script lang="ts">
  import { ArrowRight } from "phosphor-svelte";
  import type { EventWithAttending } from "$models/databaseView.model";
  import EventLogos from "$components/shared/EventLogos.svelte";
  import EventBadges from "./EventBadges.svelte";

  export let event: EventWithAttending;
</script>

<a
  class="flex flex-col justify-between rounded-md px-3 py-4 hover:transition-[3s] border border-gray-200 hover:border-gray-800 dark:border-zinc-800
  dark:bg-zinc-800 dark:hover:bg-zinc-700 md:flex-row"
  href={`/event/${event._id}`}
>
  <div class="flex flex-col gap-3 px-0 font-light md:flex-row lg:gap-2 lg:px-2">
    <h2 class="max-w-md truncate whitespace-pre-wrap pr-3 text-xl">
      {event.title}
    </h2>
    <EventBadges {event} />
  </div>
  <div class="flex flex-row items-center justify-between gap-6 pt-4 md:pt-0">
    <EventLogos {event} height={5} />
    <ArrowRight class="mr-2" />
  </div>
</a>
