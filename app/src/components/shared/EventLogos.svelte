<script lang="ts">
  import type { Event } from "$models/sanity.model";
  import capraLogoBlack from "$lib/assets/capra-black-small.webp";
  import frydeLogoBlack from "$lib/assets/fryde-black-small.webp";
  import lifligLogoBlack from "$lib/assets/liflig-black-small.webp";
  import capraLogoWhite from "$lib/assets/capra-white-small.webp";
  import frydeLogoWhite from "$lib/assets/fryde-white-small.webp";
  import lifligLogoWhite from "$lib/assets/liflig-white-small.webp";

  export let event: Event;
  export let height: number;
</script>

<div class="flex w-max">
  {#if event.organisers === "Alle"}
    <div class="flex gap-4 dark:hidden">
      <img class="h-{height}" alt="Capra logo" src={capraLogoBlack} />
      <img class="h-{height}" alt="Liflig logo" src={lifligLogoBlack} />
      <img class="h-{height}" alt="Fryde logo" src={frydeLogoBlack} />
    </div>
    <div class="hidden gap-4 dark:flex">
      <img class="h-{height}" alt="Capra logo" src={capraLogoWhite} />
      <img class="h-{height}" alt="Liflig logo" src={lifligLogoWhite} />
      <img class="h-{height}" alt="Fryde logo" src={frydeLogoWhite} />
    </div>
  {:else if event.organisers === "Capra"}
    <img class="flex h-{height} dark:hidden" alt="Capra logo" src={capraLogoBlack} />
    <img class="hidden h-{height} dark:flex" alt="Capra logo" src={capraLogoWhite} />
  {:else if event.organisers === "Liflig"}
    <img class="flex h-{height} dark:hidden" alt="Liflig logo" src={lifligLogoBlack} />
    <img class="hidden h-{height} dark:flex" alt="Liflig logo" src={lifligLogoWhite} />
  {:else if event.organisers === "Fryde"}
    <img class="flex h-{height} dark:hidden" alt="Fryde logo" src={frydeLogoBlack} />
    <img class="hidden h-{height} dark:flex" alt="Fryde logo" src={frydeLogoWhite} />
  {/if}
</div>
