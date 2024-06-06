<script lang="ts">
  import { useQuery } from "@sanity/svelte-loader";
  import { superForm } from "sveltekit-superforms/client";
  import { zod } from "sveltekit-superforms/adapters";
  import { registrationSchema, unregistrationSchema } from "$lib/schemas/registrationSchema.js";
  import EventForm from "$components/EventForm.svelte";
  import EventFormInternal from "$components/internal/EventForm.svelte";
  import EventSummary from "$components/EventSummary.svelte";

  export let data;

  const { query, options, auth } = data;
  const result = useQuery({ query, options });

  $: ({ data: event } = $result);
  $: internalParticipantNames = data.internalParticipantNames;

  const {
    form: registrationForm,
    errors: registrationErrors,
    message: registrationMessage,
    delayed: registrationDelayed,
    enhance: registrationEnhance,
  } = superForm(data.registrationForm, {
    validators: zod(registrationSchema),
    delayMs: 200,
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
  <EventSummary {event} />
  {#if !auth?.user}
    <EventForm
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
  {:else}
    <EventFormInternal
      {event}
      {registrationForm}
      {registrationEnhance}
      {registrationDelayed}
      {registrationMessage}
      {internalParticipantNames}
    />
  {/if}
</section>
