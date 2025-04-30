<script lang="ts">
  import { Badge } from "flowbite-svelte";
  import type { Event } from "$models/sanity.model";
  import { urlFor } from "$lib/sanity/image";
  import { PortableText } from "@portabletext/svelte";
  import EventInfoBox from "$components/shared/EventInfoBox.svelte";
  import Link from "$components/shared/Link.svelte";

  import { onMount } from "svelte";

  type Palette = {
    darkMuted: { background: string };
  };

  interface EventWithImagePalette extends Event {
    image?: Event["image"] & { palette?: Palette };
  }

  export let data;
  export let event: EventWithImagePalette;

  let imageElement: HTMLImageElement | null;
  let imageLoaded = false;

  onMount(() => {
    if (imageElement?.naturalHeight) {
      imageLoaded = true;
    }
  });
</script>

{#if event.category}
  <Badge rounded class="mb-4 h-6 border border-black bg-transparent dark:bg-zinc-800"
    >{event.category}</Badge
  >
{/if}

<h1 class="break-words pb-6 text-3xl font-semibold sm:text-5xl" data-testid="event-title">{event.title}</h1>

<p class="event-description break-words pb-6 text-base font-light sm:w-[60%] sm:text-xl" data-testid="event-description">{event.summary || ''}</p>

<div class="flex min-h-[60px] flex-col gap-5 pb-6 sm:flex-row">
  <div class="w-full sm:min-h-60 sm:w-[40%]">
    <EventInfoBox {event} numberOfParticipants={data.numberOfParticipants} />
  </div>
  {#if event.image?.palette}
    <div class="group relative w-full sm:h-60 sm:w-[60%]">
      <div
        aria-hidden="true"
        class="absolute left-0 top-0 h-full w-full rounded-xl"
        style="background: {event.image.palette.darkMuted.background}"
      ></div>

      <img
        fetchpriority="high"
        class="relative h-full w-full rounded-xl object-cover opacity-0 duration-1000 ease-in-out"
        src={urlFor(event.image).url()}
        alt={`Bilde for arrangementet: ${event.title}`}
        class:opacity-100={imageLoaded}
        on:load={() => (imageLoaded = true)}
        bind:this={imageElement}
      />
    </div>
  {/if}
</div>

{#if event.body}
  <div class="portable-text flex flex-col gap-4 text-base sm:w-[60%]">
    <PortableText
      components={{
        marks: {
          link: Link,
        },
      }}
      onMissingComponent={false}
      value={event.body}
    />
  </div>
{/if}
