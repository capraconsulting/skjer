<script lang="ts">
  import EventParticipantsInternal from "$components/internal/EventParticipantsInternal.svelte";
  import RegistrationFormInternal from "$components/internal/RegistrationFormInternal.svelte";
  import UnregistrationFormInternal from "$components/internal/UnregistrationFormInternal.svelte";
  import type { Event } from "$models/sanity.model";
  import { superForm } from "sveltekit-superforms/client";
  import { zod } from "sveltekit-superforms/adapters";
  import {
    registrationSchemaInternal,
    unregistrationSchemaInternal,
  } from "$lib/schemas/internal/schema";
  import { Alert } from "flowbite-svelte";
  import { getAlertColor } from "$lib/utils/form.util";
  import { isBeforeToday } from "$lib/utils/date.util";

  export let data;
  export let event: Event;

  const {
    form: registrationForm,
    message: registrationMessage,
    delayed: registrationDelayed,
    enhance: registrationEnhance,
  } = superForm(data.registrationForm, {
    validators: zod(registrationSchemaInternal),
    delayMs: 500,
    async onSubmit() {
      await new Promise((result) => setTimeout(result, 500));
    },
  });

  const {
    message: unregistrationMessage,
    delayed: unregistrationDelayed,
    enhance: unregistrationEnhance,
  } = superForm(data.unregistrationForm, {
    validators: zod(unregistrationSchemaInternal),
    delayMs: 500,
    async onSubmit() {
      await new Promise((result) => setTimeout(result, 500));
    },
  });
</script>

<div class="flex flex-col gap-12 pt-8 sm:w-[60%]">
  <div>
    <h2 class="mt-8 pb-4 text-base font-bold sm:text-xl">Deltagere:</h2>
    <EventParticipantsInternal names={data.internalParticipantNames} />
  </div>
  <div>
    {#if isBeforeToday(event.deadline)}
      <p>Det er ikke lenger mulig å melde seg på dette arrangementet.</p>
    {:else}
      <RegistrationFormInternal
        {event}
        isAttending={data.isAttending}
        form={registrationForm}
        delayed={registrationDelayed}
        enhance={registrationEnhance}
      />
      {#if !$unregistrationMessage?.text}
        <UnregistrationFormInternal
          isAttending={data.isAttending}
          delayed={unregistrationDelayed}
          enhance={unregistrationEnhance}
        />
      {/if}
    {/if}
  </div>
  {#if $unregistrationMessage?.text}
    <Alert color={getAlertColor($unregistrationMessage)}>
      {$unregistrationMessage.text}
    </Alert>
  {/if}
  {#if $registrationMessage?.text}
    <Alert color={getAlertColor($registrationMessage)}>
      {$registrationMessage.text}
    </Alert>
  {/if}
</div>
