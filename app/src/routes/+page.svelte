<script lang="ts">
  import { useQuery } from "@sanity/svelte-loader";
  import Card from "../components/Card.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  const q = useQuery(data);

  $: ({ data: events } = $q);
</script>

<section>
  {#if events.length}
    {#each events as event}
      <Card {event} />
    {/each}
  {:else}
    <div>Fant ingen eventer</div>
  {/if}
</section>
