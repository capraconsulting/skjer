<script lang="ts">
  import { useQuery } from "@sanity/svelte-loader";
  import EventFormExternal from "$components/external/EventFormExternal.svelte";
  import EventFormInternal from "$components/internal/EventFormInternal.svelte";
  import EventSummary from "$components/shared/EventSummary.svelte";
  import { ArrowLeft } from "phosphor-svelte";

  export let data;

  const { query, options, auth } = data;
  const result = useQuery({ query, options });

  $: ({ data: event } = $result);
</script>

<svelte:head>
  <title>{event?.title || "Ikke funnet"} | Capra Liflig Fryde</title>
</svelte:head>
{#if event}
  <section>
    <div class="mb-9">
      <a class="flex items-center font-bold hover:underline" href="/">
        <ArrowLeft weight="bold" class="mr-2 inline-flex" /> Alle arrangementer
      </a>
    </div>
    <EventSummary {event} />
    {#if auth?.user}
      <EventFormInternal {event} {data} />
    {:else if event.openForExternals}
      <EventFormExternal {event} {data} />
    {/if}
  </section>
{:else}
  <p>Dette arrangementet ble ikke funnet 😵</p>
{/if}
