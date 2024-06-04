<script lang="ts">
  import { urlFor } from "$lib/sanity/image";
  import type { Event } from "$models/sanity.types";
  import capraLogo from "$lib/assets/capra-black-small.webp";
  import frydeLogo from "$lib/assets/fryde-black-small.webp";
  import lifligLogo from "$lib/assets/liflig-black-small.webp";

  export let event: Event;
</script>

<a
  class="group relative flex flex-col rounded-xl border border-black hover:bg-zinc-100 hover:transition-[2s] sm:flex-row"
  href={`/event/${event._id}`}
>
  <div class="flex w-full flex-col">
    {#if event.image}
      <img
        class="h-44 rounded-t-xl object-cover"
        src={urlFor(event.image).url()}
        alt="Bilde for arrangementet: {event.title}"
      />
    {/if}

    <div class="mx-4 my-4 flex flex-col gap-2">
      <h2 class="text-3xl">
        {event.title}
      </h2>
      {#if event.summary}
        <p class="text-lg font-light">{event.summary}</p>
      {/if}

      <div class="mt-5 flex items-center justify-between gap-6">
        <div class="flex gap-4">
          <img class="h-5" alt="Capra-logo" src={capraLogo} />
          <img class="h-5" alt="Liflig-logo" src={lifligLogo} />
          <img class="h-5" alt="Fryde-logo" src={frydeLogo} />
        </div>
        <div class="flex flex-row items-center gap-2">
          <p>Se mer</p>
          <span class="material-icons mr-2 text-base">arrow_forward</span>
        </div>
      </div>
    </div>
  </div>
</a>
