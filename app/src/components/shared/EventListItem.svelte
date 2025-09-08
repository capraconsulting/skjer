<script lang="ts">
  import type { EventWithAttending } from "$models/databaseView.model";
  import EventBadges from "./EventBadges.svelte";
  export let event: EventWithAttending;
  export let target: string | null = null;
</script>

<li>
  <a
    class="flex flex-col justify-between gap-3 rounded-md border border-gray-200 px-3 py-4 hover:border-gray-800 hover:transition-[3s] md:flex-row
    dark:border-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700"
    href={`/event/${event._id}`}
    {target}
  >
    <div class="flex max-w-[300px] flex-col gap-4 font-light lg:flex-row">
      <h2
        class="wrap line-clamp-2 max-w-[350px] whitespace-pre-line break-words text-xl font-light"
      >
        {event.title}
      </h2>
    </div>
    <div class="flex flex-row">
      <EventBadges {event} />
    </div>
  </a>
</li>
