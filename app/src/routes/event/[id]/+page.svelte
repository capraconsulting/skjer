<script lang="ts">
  import { useQuery } from "@sanity/svelte-loader";
  import { superForm } from "sveltekit-superforms/client";
  import { zod } from "sveltekit-superforms/adapters";
  import { registrationSchema, unregistrationSchema } from "$lib/schemas/registrationSchema.js";
  import EventFormExternal from "$components/external/EventFormExternal.svelte";
  import EventFormInternal from "$components/internal/EventFormInternal.svelte";
  import EventSummary from "$components/shared/EventSummary.svelte";
  import { ArrowLeft } from "phosphor-svelte";

  export let data;

  const { query, options, auth } = data;
  const result = useQuery({ query, options });

  $: ({ data: event } = $result);
  $: isAttending = data.isAttending;
  $: internalParticipantNames = data.internalParticipantNames;

  const {
    form: registrationForm,
    errors: registrationErrors,
    message: registrationMessage,
    delayed: registrationDelayed,
    enhance: registrationEnhance,
  } = superForm(data.registrationForm, {
    validators: zod(registrationSchema),
    delayMs: 500,
  });

  const {
    form: unregistrationForm,
    errors: unregistrationErrors,
    message: unregistrationMessage,
    enhance: unregistrationEnhance,
  } = superForm(data.unregistrationForm, {
    validators: zod(unregistrationSchema),
  });
</script>

<svelte:head>
  <title>{event.title} | Capra Liflig Fryde</title>
</svelte:head>

<section>
  <div class="mb-9 flex items-center">
    <a class="font-bold hover:underline" href="/"
      ><ArrowLeft weight="bold" class="mr-2 inline-flex" /> Alle arrangementer</a
    >
  </div>

  <EventSummary {event} />

  {#if auth?.user}
    <EventFormInternal
      {event}
      {registrationForm}
      {registrationEnhance}
      {registrationDelayed}
      {registrationMessage}
      {isAttending}
      {internalParticipantNames}
    />
  {:else}
    <EventFormExternal
      {event}
      {registrationForm}
      {registrationErrors}
      {registrationEnhance}
      {registrationDelayed}
      {registrationMessage}
      {unregistrationForm}
      {unregistrationEnhance}
      {unregistrationErrors}
      {unregistrationMessage}
    />
  {/if}
</section>
