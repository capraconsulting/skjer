<script lang="ts">
  import { ArrowRight } from "phosphor-svelte";
  import type { EventWithAttending } from "$models/databaseView.model";
  import EventLogos from "$components/shared/EventLogos.svelte";
  import EventBadges from "./EventBadges.svelte";

  export let event: EventWithAttending;
  export let target: string | null = null;
</script>

<a
  class="flex flex-col justify-between gap-3 rounded-md border border-gray-200 px-3 py-4 hover:border-gray-800 hover:transition-[3s] md:flex-row
  dark:border-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700"
  href={`/event/${event._id}`}
  {target}
>
  <div class="flex flex-col gap-4 font-light lg:flex-row">
    <h2 class="max-w-[375px] truncate whitespace-pre-wrap text-xl font-light">
      {event.title}
    </h2>
    <EventBadges {event} />
  </div>
  <div class="flex flex-row items-end justify-between gap-4 pt-3 md:pt-0 lg:items-center">
    <EventLogos {event} height={5} />
    <ArrowRight class="mr-2" />
  </div>
</a>
