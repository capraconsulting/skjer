<script lang="ts">
  import RegistrationFormExternal from "$components/external/RegistrationFormExternal.svelte";
  import UnregistrationFormExternal from "$components/external/UnregistrationFormExternal.svelte";
  import {
    registrationSchemaExternal,
    unregistrationSchemaExternal,
  } from "$lib/schemas/external/schema";
  import type { RegistrationFormExternalType } from "$lib/schemas/external/schema";
  import type { UnregistrationFormExternalType } from "$lib/schemas/external/schema";
  import { getAlertColor } from "$lib/utils/form.util";
  import type { Event } from "$models/sanity.model";
  import { Alert } from "flowbite-svelte";
  import { zod } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms/client";

  export let data;
  export let event: Event;

  const {
    form: registrationForm,
    message: registrationMessage,
    errors: registrationErrors,
    delayed: registrationDelayed,
    enhance: registrationEnhance,
  } = superForm<RegistrationFormExternalType>(data.registrationForm, {
    resetForm: false,
    dataType: "json",
    validators: zod(registrationSchemaExternal),
    delayMs: 500,
    async onSubmit() {
      await new Promise((result) => setTimeout(result, 500));
    },
  });

  const {
    form: unregistrationForm,
    message: unregistrationMessage,
    errors: unregistrationErrors,
    delayed: unregistrationDelayed,
    enhance: unregistrationEnhance,
  } = superForm<UnregistrationFormExternalType>(data.unregistrationForm, {
    validators: zod(unregistrationSchemaExternal),
    delayMs: 500,
    async onSubmit() {
      await new Promise((result) => setTimeout(result, 500));
    },
  });
</script>

<div class="flex flex-col gap-12 pt-8 sm:w-[60%]">
  <div class="py-6">
    {#if $registrationMessage?.text}
      <Alert color={getAlertColor($registrationMessage)}>
        {$registrationMessage.text}
      </Alert>
    {:else}
      <RegistrationFormExternal
        {event}
        numberOfParticipants={data.numberOfParticipants}
        form={registrationForm}
        errors={registrationErrors}
        enhance={registrationEnhance}
        delayed={registrationDelayed}
      />
    {/if}

    {#if $unregistrationMessage?.text}
      <Alert class="mt-20" color={getAlertColor($unregistrationMessage)}>
        {$unregistrationMessage.text}
      </Alert>
    {:else if event.openForExternals}
      <UnregistrationFormExternal
        {event}
        form={unregistrationForm}
        errors={unregistrationErrors}
        delayed={unregistrationDelayed}
        enhance={unregistrationEnhance}
      />
    {/if}
  </div>
</div>
