<script lang="ts">
  import { dateHasPassed, endsOnDifferentDay, formatDate, formatTime } from "$lib/utils/date.util";
  import { createCategoryTranslation } from "$lib/utils/category.util";
  import type { Event } from "$models/sanity.model";
  import { _ } from "$lib/i18n";
  import {
    CalendarBlank,
    Clock,
    MapPin,
    ForkKnife,
    Tag,
    Lightbulb,
    Users,
    VideoCamera,
  } from "phosphor-svelte";

  export let event: Event;
  export let numberOfParticipants: number;

  // Create a reactive store for the category translation
  $: categoryTranslation = createCategoryTranslation(event.category);

  $: availableSpotsMessage = (() => {
    if (typeof event.maxParticipant !== 'number') return '';

    const availableSpots = event.maxParticipant - numberOfParticipants;
    if (availableSpots === 0) {
      return $_('common.noAvailableSpots');
    } else if (availableSpots === 1) {
      return $_('common.oneAvailableSpot');
    } else {
      return `${availableSpots} ` + $_('common.availableSpots');
    }
  })();

</script>

<div
  class="flex h-full w-full flex-col gap-1 hyphens-auto rounded-xl border p-3 text-sm font-light sm:p-6 sm:text-base dark:bg-zinc-800"
>
  {#if event.category}
    <div class="flex items-center">
      <Lightbulb class="mr-2 flex-none" />
      <span>{$categoryTranslation}</span>
    </div>
  {/if}

  <div class="flex items-center">
    <CalendarBlank class="mr-2 flex-none" />
    <span>
      {endsOnDifferentDay(event.start, event.end)
        ? $_('common.dateRange', { values: { start: formatDate(event.start), end: formatDate(event.end) } })
        : formatDate(event.start)}
    </span>
  </div>
  <div class="flex items-center">
    <Clock class="mr-2 flex-none" />
    <span>{$_('common.timeRange', { values: { start: formatTime(event.start), end: formatTime(event.end) } })}</span>
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

  {#if event.maxParticipant && !event.hideMaxParticipant && !dateHasPassed(event.deadline)}
    <div class="flex items-center">
      <Users class="mr-2 flex-none" />
      <span>{availableSpotsMessage}</span>
    </div>
  {/if}

  {#if event.linkStreaming}
    <div class="flex items-center">
      <VideoCamera class="mr-2 flex-none" />
      <a
        class="text-[#1b64f2] underline"
        target="_blank"
        rel="noopener noreferrer"
        href={event.linkStreaming}
      >
        {event.linkStreaming}
      </a>
    </div>
  {/if}

  <div class="flex items-center">
    <Tag class="mr-2 flex-none" />
    <span>{event.openForExternals ? $_('filter.forAll') : $_('filter.internalOnly')}</span>
  </div>
</div>
