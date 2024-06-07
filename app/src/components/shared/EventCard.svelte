<script lang="ts">
  import { urlFor } from "$lib/sanity/image";
  import type { Event } from "$models/sanity.model";
  import { ArrowRight } from "phosphor-svelte";
  import EventLogos from "./EventLogos.svelte";

  export let event: Event;
</script>

<a
  class="group relative flex flex-col rounded-xl border border-black hover:bg-[#E5FFE3] hover:transition-[2s] sm:flex-row dark:border-white dark:hover:bg-zinc-800"
  href={`/event/${event._id}`}
>
  <div class="flex w-full flex-col">
    {#if event.image}
      <img
        class="h-44 rounded-t-xl object-cover"
        src={urlFor(event.image).width(468).height(176).format("webp").url()}
        alt="Bilde for arrangementet: {event.title}"
      />
    {/if}

    <div class="mx-4 my-4 flex flex-col gap-2">
      <h2 class="text-2xl font-semibold">
        {event.title}
      </h2>
      {#if event.summary}
        <p class="text-base font-light sm:text-lg">{event.summary}</p>
      {/if}

      <div class="mt-5 flex items-center justify-between gap-6">
        <div class="flex gap-4">
          <EventLogos {event} />
        </div>
        <div class="flex flex-row items-center gap-2">
          <p>Se mer</p>
          <ArrowRight class="mr-2" />
        </div>
      </div>
    </div>
  </div>
</a>
