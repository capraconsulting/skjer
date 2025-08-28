<script lang="ts">
  import type { Event } from "$models/sanity.model";
  import capraLogo from "$lib/assets/Capra_symbol_RGB.png";
  import frydeLogo from "$lib/assets/Fryde_symbol_RGB.png";
  import lifligLogo from "$lib/assets/Liflig_symbol_RGB.png";

  export let event: Event;
  export let height: number;
</script>

<div class="flex w-max">
  {#if event.organisers === "Alle"}
    <div class="flex gap-2">
      <img class="h-{height}" alt="Capra logo" src={capraLogo} />
      <img class="h-{height}" alt="Liflig logo" src={lifligLogo} />
      <img class="h-{height}" alt="Fryde logo" src={frydeLogo} />
    </div>
  {:else if event.organisers === "Capra"}
    <img class="flex h-{height}" alt="Capra logo" src={capraLogo} />
  {:else if event.organisers === "Liflig"}
    <img class="flex h-{height}" alt="Liflig logo" src={lifligLogo} />
  {:else if event.organisers === "Fryde"}
    <img class="flex h-{height}" alt="Fryde logo" src={frydeLogo} />
  {/if}
</div>
