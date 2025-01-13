<script lang="ts">
  import { endsOnDifferentDay, formatDate, formatTime } from "$lib/utils/date.util";
  import type { Event } from "$models/sanity.model";
  import { CalendarBlank, Clock, MapPin, ForkKnife, Tag, Lightbulb } from "phosphor-svelte";

  export let event: Event;
</script>

<div
  class="flex h-full w-full flex-col gap-1 hyphens-auto rounded-xl border p-3 text-sm font-light dark:bg-zinc-800 sm:p-6 sm:text-base"
>
  {#if event.category}
    <div class="flex items-center">
      <Lightbulb class="mr-2 flex-none" />
      <span>{event.category}</span>
    </div>
  {/if}

  <div class="flex items-center">
    <CalendarBlank class="mr-2 flex-none" />
    <span
      >{formatDate(event.start)}
      {endsOnDifferentDay(event.start, event.end) ? `- ${formatDate(event.end)}` : ""}
    </span>
  </div>
  <div class="flex items-center">
    <Clock class="mr-2 flex-none" />
    <span>{formatTime(event.start)} - {formatTime(event.end)} </span>
  </div>

  <div class="flex items-center">
    <MapPin class="mr-2 flex-none" />
    <span>{event.place}</span>
  </div>

  {#if event.food}
    <div class="flex items-center">
      <ForkKnife class="mr-2 flex-none" />
      <span>{event.food}</span>
    </div>
  {/if}
  <div class="flex items-center">
    <Tag class="mr-2 flex-none" />
    <span>{event.openForExternals ? "Åpent for alle" : "Kun for interne"}</span>
  </div>
</div>
