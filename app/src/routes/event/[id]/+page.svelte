<script lang="ts">
  import { useQuery } from "@sanity/svelte-loader";
  import EventFormExternal from "$components/external/EventFormExternal.svelte";
  import EventFormInternal from "$components/internal/EventFormInternal.svelte";
  import EventSummary from "$components/shared/EventSummary.svelte";
  import { ArrowLeft } from "phosphor-svelte";
  import { _ } from "$lib/i18n";

  export let data;

  const { query, options, auth, params } = data;

  const result = useQuery({ query, options, params });

  $: ({ data: event } = $result);
</script>

<svelte:head>
  <title>{event?.title || $_('common.notFound')} | Capra Liflig Fryde</title>
</svelte:head>
{#if event}
  <section>
    <div class="mb-9">
      <a class="flex items-center font-bold hover:underline" href="/">
        <ArrowLeft weight="bold" class="mr-2 inline-flex" />
        <span>{$_('common.allEvents')}</span>
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
  <p>{$_('common.eventNotFound')}</p>
{/if}
