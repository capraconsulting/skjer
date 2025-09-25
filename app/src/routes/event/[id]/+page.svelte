<script lang="ts">
  import { useQuery } from "@sanity/svelte-loader";
  import EventFormExternal from "$components/external/EventFormExternal.svelte";
  import EventFormInternal from "$components/internal/EventFormInternal.svelte";
  import EventSummary from "$components/shared/EventSummary.svelte";
  import { ArrowLeft } from "phosphor-svelte";
  import { urlFor } from "$lib/sanity/image";
  import type { Event } from "$models/sanity.model";
  import { stegaClean } from "@sanity/client/stega";

  export let data;

  const { query, options, auth, params } = data;

  const result = useQuery<Event>({ query, options, params });

  $: ({ data: event } = $result);

  $: title = stegaClean(event?.title) || "Ikke funnet | Capra Liflig Fryde";
  $: description = stegaClean(event?.summary) || "";
  $: imageUrl = event?.image?.asset?._ref ? urlFor(event.image.asset._ref).url() : null;
  $: canonicalUrl = `https://skjer.capraconsulting.no/event/${event?._id}`;
</script>

<svelte:head>
  <title>{title}</title>
  {#if event}
    <meta name="description" content={description} />

    <!-- Canonical URL for LinkedIn Ads -->
    <link rel="canonical" href={canonicalUrl} />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="article" />

    <!-- LinkedIn Ads Requirements -->
    <meta name="robots" content="index,follow" />
    <meta name="author" content="Capra Consulting" />
    <meta name="publisher" content="Capra Consulting" />

    {#if imageUrl}
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@capraconsulting" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    {/if}

    {#if event.start}
      <meta name="article:published_time" content={event.start} />
    {/if}
  {/if}
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
