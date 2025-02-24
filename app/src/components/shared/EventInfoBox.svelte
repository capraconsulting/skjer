<script lang="ts">
  import { dateHasPassed, endsOnDifferentDay, formatDate, formatTime } from "$lib/utils/date.util";
  import type { Event } from "$models/sanity.model";
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

  function getAvailableSpotsMessage(maxParticipant: number, numberOfParticipants: number) {
    const availableSpots = maxParticipant - numberOfParticipants;
    if (availableSpots === 0) {
      return "Ingen ledige plasser";
    } else if (availableSpots === 1) {
      return "1 ledig plass";
    } else {
      return `${availableSpots} ledige plasser`;
    }
  }
</script>

<div
  class="flex h-full w-full flex-col gap-1 hyphens-auto rounded-xl border p-3 text-sm font-light sm:p-6 sm:text-base dark:bg-zinc-800"
>
  {#if event.category}
    <div class="flex items-center">
      <Lightbulb class="mr-2 flex-none" />
      <span>{event.category}</span>
    </div>
  {/if}

  <div class="flex items-center">
    <CalendarBlank class="mr-2 flex-none" />
    <span>
      {formatDate(event.start)}
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

  {#if event.maxParticipant && !dateHasPassed(event.deadline)}
    <div class="flex items-center">
      <Users class="mr-2 flex-none" />
      <span>{getAvailableSpotsMessage(event.maxParticipant, numberOfParticipants)}</span>
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
    <span>{event.openForExternals ? "Åpent for alle" : "Kun for interne"}</span>
  </div>
</div>
