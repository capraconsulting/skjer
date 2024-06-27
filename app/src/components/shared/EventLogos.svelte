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

<div class="flex items-center gap-4">
  {#if event.organisers.includes("Capra")}
    <img class="block h-{height} dark:hidden" alt="Capra-logo" src={capraLogoBlack} />
    <img class="hidden h-{height} dark:block" alt="Capra-logo" src={capraLogoWhite} />
  {/if}
  {#if event.organisers.includes("Liflig")}
    <img class="block h-{height} dark:hidden" alt="Liflig-logo" src={lifligLogoBlack} />
    <img class="hidden h-{height} dark:block" alt="Liflig-logo" src={lifligLogoWhite} />
  {/if}
  {#if event.organisers.includes("Fryde")}
    <img class="block h-{height} dark:hidden" alt="Fryde-logo" src={frydeLogoBlack} />
    <img class="hidden h-{height} dark:block" alt="Fryde-logo" src={frydeLogoWhite} />
  {/if}
</div>
