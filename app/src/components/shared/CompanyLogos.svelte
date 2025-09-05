<script lang="ts">
  import type { Event } from "$models/sanity.model";
  import capraLogo from "$lib/assets/Capra_symbol_RGB.webp";
  import frydeLogo from "$lib/assets/Fryde_symbol_RGB.webp";
  import lifligLogo from "$lib/assets/Liflig_symbol_RGB.webp";

  export let event: Event;
  export let height: number;
</script>

<div class="flex w-max">
  {#if event.organisers === "Alle"}
    <div class="flex gap-2">
      <img class="h-{height} p-0.5" alt="Capra logo" src={capraLogo} />
      <img class="h-{height} p-0.5" alt="Liflig logo" src={lifligLogo} />
      <img class="h-{height} p-0.5" alt="Fryde logo" src={frydeLogo} />
    </div>
  {:else if event.organisers === "Capra"}
    <img class="flex h-{height} p-0.5" alt="Capra logo" src={capraLogo} />
  {:else if event.organisers === "Liflig"}
    <img class="flex h-{height} p-0.5" alt="Liflig logo" src={lifligLogo} />
  {:else if event.organisers === "Fryde"}
    <img class="flex h-{height} p-0.5" alt="Fryde logo" src={frydeLogo} />
  {/if}
</div>
