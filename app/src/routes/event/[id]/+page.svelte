<script lang="ts">
  import { useQuery } from "@sanity/svelte-loader";
  import EventFormExternal from "$components/external/EventFormExternal.svelte";
  import EventFormInternal from "$components/internal/EventFormInternal.svelte";
  import EventSummary from "$components/shared/EventSummary.svelte";
  import { ArrowLeft } from "phosphor-svelte";

  export let data;

  const { query, options, auth, params } = data;

  const result = useQuery({ query, options, params });

  $: ({ data: event } = $result);
</script>

<svelte:head>
  <title>{event?.title || "Ikke funnet"} | Capra Liflig Fryde</title>
  <meta name="description" content={event?.summary || "Detaljert informasjon om arrangementet. Her finner du all informasjon om arrangementet, inkludert tid, sted, og hvordan du melder deg på."} />
  <link rel="canonical" href={`https://skjer.capraconsulting.no/event/${event?._id || ''}`} />
  <meta property="og:title" content={event?.title || "Arrangement"} />
  <meta property="og:description" content={event?.summary || "Detaljert informasjon om arrangementet. Her finner du all informasjon om arrangementet, inkludert tid, sted, og hvordan du melder deg på."} />
  <meta property="og:image" content={event?.image ? `https://skjer.capraconsulting.no/api/image/${event._id}` : "https://skjer.capraconsulting.no/logo.png"} />
  <meta property="og:url" content={`https://skjer.capraconsulting.no/event/${event?._id || ''}`} />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>
{#if event}
  <section>
    <div class="mb-9">
      <a class="flex items-center font-bold hover:underline" href="/">
        <ArrowLeft weight="bold" class="mr-2 inline-flex" />
        <span>Alle arrangementer</span>
      </a>
    </div>
    <EventSummary {event} {data} />
    {#if auth?.user?.email && auth.user.name}
      <EventFormInternal {event} {data} />
    {:else}
      <EventFormExternal {event} {data} />
    {/if}
  </section>
{:else}
  <p>Dette arrangementet ble ikke funnet 😵</p>
{/if}
