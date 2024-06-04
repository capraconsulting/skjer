<script lang="ts">
  import { urlFor } from "$lib/sanity/image";
  import type { Event } from "$models/sanity.types";
  import capraLogo from "$lib/assets/capra-black-small.webp";
  import frydeLogo from "$lib/assets/fryde-black-small.webp";
  import lifligLogo from "$lib/assets/liflig-black-small.webp";

  export let event: Event;
</script>

<a
  class="flex flex-col relative border border-black rounded-xl sm:flex-row group hover:bg-zinc-100 hover:transition-[2s]"
  href={`/event/${event._id}`}
>
  <div class="flex flex-col w-full">
    {#if event.image}
      <img
        class="rounded-t-xl object-cover h-44"
        src={urlFor(event.image).url()}
        alt="Bilde for arrangementet: {event.title}"
      />
    {/if}

    <div class="my-4 mx-4 flex flex-col gap-2">
      <h2 class="text-3xl">
        {event.title}
      </h2>
      {#if event.summary}
        <p class="text-lg font-light">{event.summary}</p>
      {/if}

      <div class="mt-5 flex gap-6 items-center justify-between">
        <div class="flex gap-4">
          {#if event.organisers?.includes("Capra")}
            <img class="h-5" alt="Capra-logo" src={capraLogo} />
          {/if}
          {#if event.organisers?.includes("Liflig")}
            <img class="h-5" alt="Liflig-logo" src={lifligLogo} />
          {/if}
          {#if event.organisers?.includes("Fryde")}
            <img class="h-5" alt="Fryde-logo" src={frydeLogo} />
          {/if}
        </div>
        <div class="items-center flex flex-row gap-2">
          <p>Se mer</p>
          <span class="material-icons mr-2 text-base">arrow_forward</span>
        </div>
      </div>
    </div>
  </div>
</a>
