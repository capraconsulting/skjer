<script lang="ts">
  import { formatDate, formatTime } from "$lib/utils";
  import type { Event } from "$models/sanity.model";
  import { CalendarBlank, Clock, MapPin } from "phosphor-svelte";

  export let event: Event;
</script>

<div
  class="flex h-full w-full flex-col gap-1 rounded-xl bg-zinc-100 p-3 text-sm font-light sm:p-6 sm:text-base"
>
  <div class="flex items-center">
    <CalendarBlank class="mr-2" />
    <span>{event.category}</span>
  </div>

  <div class="flex items-center">
    <CalendarBlank class="mr-2" />
    <span>{formatDate(event.start)}</span>
  </div>

  <div class="flex items-center">
    <Clock class="mr-2" />
    <span>{formatTime(event.start)} - {formatTime(event.end)}</span>
  </div>

  <div class="flex items-center">
    <MapPin class="mr-2" />
    <span>{event.place}</span>
  </div>
</div>
