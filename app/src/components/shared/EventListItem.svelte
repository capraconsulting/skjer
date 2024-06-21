<script lang="ts">
  import { formatDate } from "$lib/utils/date.util";
  import { Badge } from "flowbite-svelte";
  import { ArrowRight } from "phosphor-svelte";
  import type { EventWithAttending } from "$models/databaseView.model";
  import EventLogos from "$components/shared/EventLogos.svelte";
  import EventBadges from "./EventBadges.svelte";

  export let event: EventWithAttending;
</script>

<a
  class="hover:bg-ireneGreen flex flex-col justify-between rounded-md bg-zinc-100 px-3 py-4 hover:transition-[2s] lg:flex-row
  dark:border-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700"
  href={`/event/${event._id}`}
>
  <div class="flex flex-col gap-3 px-0 font-light lg:flex-row lg:gap-2 lg:px-2">
    <h2 class="max-w-md truncate whitespace-pre-wrap pr-3 text-xl">
      {event.title}
    </h2>
    <EventBadges {event} />
  </div>
  <div class="flex flex-row items-center justify-between gap-6 pt-4 lg:pt-0">
    <EventLogos {event} height={5} />
    <ArrowRight class="mr-2" />
  </div>
</a>
