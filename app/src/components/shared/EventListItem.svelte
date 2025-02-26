<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowRight } from "phosphor-svelte";
  import type { EventWithAttending } from "$models/databaseView.model";
  import EventLogos from "$components/shared/EventLogos.svelte";
  import EventBadges from "./EventBadges.svelte";

  export let event: EventWithAttending;
  export let target: string | null = null;

  let titleElement: HTMLHeadingElement;

  onMount(() => {
    // Measure the content width and set the width of the title element
    // to ensure the element takes up only the necessary space based on its content.
    if (titleElement) {
      const range = document.createRange();
      range.selectNodeContents(titleElement);
      const width = range.getBoundingClientRect().width;
      titleElement.style.width = `${width}px`;
    }
  });
</script>

<a
  class="flex flex-col justify-between gap-3 rounded-md border border-gray-200 px-3 py-4 hover:border-gray-800 hover:transition-[3s] dark:border-zinc-800
  dark:bg-zinc-800 dark:hover:bg-zinc-700 md:flex-row"
  href={`/event/${event._id}`}
  {target}
>
  <div class="flex flex-col gap-4 font-light lg:flex-row">
    <h2
      bind:this={titleElement}
      class="max-w-[375px] truncate whitespace-pre-wrap text-xl font-light"
    >
      {event.title}
    </h2>
    <EventBadges {event} />
  </div>
  <div class="flex flex-row items-end justify-between gap-4 pt-3 md:pt-0 lg:items-center">
    <EventLogos {event} height={5} />
    <ArrowRight class="mr-2" />
  </div>
</a>
