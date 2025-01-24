<script lang="ts">
  import { ArrowRight } from "phosphor-svelte";
  import type { EventWithAttending } from "$models/databaseView.model";
  import EventLogos from "$components/shared/EventLogos.svelte";
  import EventBadges from "./EventBadges.svelte";

  export let event: EventWithAttending;
</script>

<a
  class="flex flex-wrap md:flex-nowrap items-center rounded-md px-3 py-4 border border-gray-200
  hover:border-gray-800 dark:border-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700"
  href={`/event/${event._id}`}
  style="gap: 4px;"
>
  <div class="md:w-[45%] mr-1">
    <h2 class="max-w-full truncate whitespace-pre-wrap text-xl">
      {event.title}
    </h2>
  </div>
  <div class="md:w-[30%] mr-1">
    <EventBadges {event} />
  </div>
  <div class="md:w-[20%] mr-1">
    <EventLogos {event} height={5} />
  </div>
  <div class="w-auto ml-auto flex-shrink-0 flex items-center justify-end">
    <ArrowRight class="w-5 h-5" />
  </div>
</a>
