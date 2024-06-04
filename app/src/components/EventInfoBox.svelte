<script lang="ts">
  import { formatDate, formatTime } from "$lib/utils";
  import type { Event } from "$models/sanity.model";

  export let event: Event;
</script>

<div
  class="flex h-full w-full flex-col gap-1 rounded-xl bg-zinc-100 p-3 text-sm font-light sm:p-5 sm:text-base"
>
  <div class="flex items-center">
    <span class="material-symbols-outlined mr-2 text-base">calendar_today</span>
    <span>{event.category}</span>
  </div>

  <div class="flex items-center">
    <span class="material-symbols-outlined mr-2 text-base">calendar_today</span>
    <span>{formatDate(event.start)}</span>
  </div>

  <div class="flex items-center">
    <span class="material-symbols-outlined mr-2 text-base">schedule</span>
    <span>{formatTime(event.start)} - {formatTime(event.end)}</span>
  </div>

  <div class="flex items-center">
    <span class="material-symbols-outlined mr-2 text-base">location_on</span>
    <span>{event.place}</span>
  </div>
</div>
