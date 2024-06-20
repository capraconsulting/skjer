<script lang="ts">
  import { urlFor } from "$lib/sanity/image";
  import type { Event } from "$models/sanity.model";
  import { ArrowRight } from "phosphor-svelte";
  import EventLogos from "./EventLogos.svelte";
  import EventBadges from "./EventBadges.svelte";

  export let event: Event;
</script>

<a
  class="group relative flex flex-col hover:transition-[2s] sm:flex-row"
  href={`/event/${event._id}`}
>
  <div class="flex w-full flex-col">
    {#if event.image}
      <div class="h-[300px]">
        <img
          class="h-full w-full rounded-3xl object-cover group-hover:opacity-80"
          src={urlFor(event.image).url()}
          alt="Bilde for arrangementet: {event.title}"
        />
      </div>
    {/if}

    <div class="mx-4 my-4 flex flex-col gap-2">
      <div class="flex flex-col gap-2">
        <h2 class="text-2xl font-semibold">
          {event.title}
        </h2>
        <EventBadges {event} />
        {#if event.summary}
          <p class="text-base font-light sm:text-lg">{event.summary}</p>
        {/if}
      </div>

      <div class="my-2 flex justify-between">
        <EventLogos {event} />
        <ArrowRight class="mr-2" size="20" />
      </div>
    </div>
  </div>
</a>
