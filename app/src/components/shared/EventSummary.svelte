<script lang="ts">
  import { Badge } from "flowbite-svelte";
  import type { Event } from "$models/sanity.model";
  import { urlFor } from "$lib/sanity/image";
  import { PortableText } from "@portabletext/svelte";
  import EventInfoBox from "$components/shared/EventInfoBox.svelte";
  import { onMount } from "svelte";

  export let event: Event;

  let imageElement: HTMLImageElement;
  let imageLoaded = false;

  onMount(() => {
    if (imageElement?.naturalHeight) {
      imageLoaded = true;
    }
  });
</script>

<Badge rounded class="mb-4 h-6 border border-black bg-transparent dark:bg-zinc-800"
  >{event.category}</Badge
>
<h1 class="pb-6 text-3xl font-light sm:text-5xl">{event.title}</h1>

{#if event.summary}
  <p class="pb-6 text-base font-light sm:text-xl">{event.summary}</p>
{/if}

<div class="flex flex-col gap-5 pb-6 sm:h-60 sm:flex-row">
  <div class="w-full sm:w-[40%]">
    <EventInfoBox {event} />
  </div>
  {#if event.image}
    <div class="relative w-full sm:w-[60%]">
      <div
        aria-hidden="true"
        class="absolute left-0 top-0 h-full w-full rounded-xl"
        style="background: {event.image.palette.darkMuted.background}"
      ></div>
      <img
        fetchpriority="high"
        class="relative h-full w-full rounded-xl object-cover opacity-0 transition-opacity duration-1000 ease-in-out"
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
  <div class="flex flex-col gap-4 text-base">
    <PortableText components={{}} value={event.body} />
  </div>
{/if}
