<script lang="ts">
  import EventParticipantsInternal from "$components/internal/EventParticipantsInternal.svelte";
  import RegistrationFormInternal from "$components/internal/RegistrationFormInternal.svelte";
  import UnregistrationFormInternal from "$components/internal/UnregistrationFormInternal.svelte";
  import type { Event } from "$models/sanity.model";
  import { superForm } from "sveltekit-superforms/client";
  import {
    registrationSchemaInternal,
    unregistrationSchemaInternal,
    type RegistrationFormInternalType,
    type UnregistrationFormInternalType,
  } from "$lib/schemas/internal/schema";
  import { Alert } from "flowbite-svelte";
  import { getAlertColor } from "$lib/utils/form.util";
  import { zod } from "sveltekit-superforms/adapters";

  export let data;
  export let event: Event;

  const {
    form: registrationForm,
    message: registrationMessage,
    delayed: registrationDelayed,
    errors: registrationErrors,
    enhance: registrationEnhance,
  } = superForm<RegistrationFormInternalType>(data.registrationForm, {
    validators: zod(registrationSchemaInternal),
    resetForm: false,
    dataType: "json",
    delayMs: 500,
    async onSubmit() {
      await new Promise((result) => setTimeout(result, 500));
    },
  });

  const {
    message: unregistrationMessage,
    delayed: unregistrationDelayed,
    enhance: unregistrationEnhance,
  } = superForm<UnregistrationFormInternalType>(data.unregistrationForm, {
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
    <RegistrationFormInternal
      {event}
      numberOfParticipants={data.numberOfParticipants}
      isAttending={data.isAttending}
      form={registrationForm}
      errors={registrationErrors}
      delayed={registrationDelayed}
      enhance={registrationEnhance}
    />
    {#if !$unregistrationMessage?.text}
      <UnregistrationFormInternal
        {event}
        isAttending={data.isAttending}
        delayed={unregistrationDelayed}
        enhance={unregistrationEnhance}
      />
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
