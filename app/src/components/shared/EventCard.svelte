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
      <img
        class="rounded-2xl object-cover group-hover:opacity-80"
        src={urlFor(event.image).width(468).height(260).url()}
        alt="Bilde for arrangementet: {event.title}"
      />
    {/if}

    <div class="mx-4 my-4 grid h-full grid-cols-1 content-between gap-2">
      <div class="flex flex-col gap-2">
        <h2 class="text-2xl font-semibold">
          {event.title}
        </h2>
        <EventBadges {event} />
        {#if event.summary}
          <p class="text-base font-light sm:text-lg">{event.summary}</p>
        {/if}
      </div>

      <div class="self mt-5 flex justify-between gap-6">
        <EventLogos {event} />
        <div class="flex flex-row items-center gap-2">
          <p>Se mer</p>
          <ArrowRight class="mr-2" />
        </div>
      </div>
    </div>
  </div>
</a>
