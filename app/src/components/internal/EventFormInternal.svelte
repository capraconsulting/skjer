<script lang="ts">
  import { page } from "$app/stores";
  import EventParticipantsInternal from "$components/internal/EventParticipantsInternal.svelte";
  import RegistrationFormInternal from "$components/internal/RegistrationFormInternal.svelte";
  import UnregistrationFormInternal from "$components/internal/UnregistrationFormInternal.svelte";
  import { Alert } from "flowbite-svelte";

  export let event;

  export let registrationForm;
  export let registrationEnhance;
  export let registrationDelayed;
  export let registrationMessage;

  export let isAttending;
  export let internalParticipantNames;
</script>

<div class="flex flex-col gap-12 pt-8 sm:w-[60%]">
  <div>
    <h2 class="mt-8 pb-4 text-base font-bold sm:text-xl">Deltagere:</h2>
    <EventParticipantsInternal {internalParticipantNames} />
  </div>
  <div>
    {#if $registrationMessage?.message}
      <Alert
        color={$registrationMessage.success
          ? "green"
          : $registrationMessage.warning
            ? "yellow"
            : "red"}
      >
        {$registrationMessage.message}
      </Alert>
    {:else if $page.form?.message}
      <Alert color={$page.form.success ? "green" : $page.form.warning ? "yellow" : "red"}>
        {$page.form.message}
      </Alert>
    {:else if !isAttending}
      <h2 class="pb-4 text-base font-bold sm:text-xl">Påmelding:</h2>
      <RegistrationFormInternal
        {event}
        {registrationForm}
        {registrationEnhance}
        {registrationDelayed}
      />
    {:else}
      <h2 class="pb-4 text-base font-bold sm:text-xl">Avmelding:</h2>
      <UnregistrationFormInternal />
    {/if}
  </div>
</div>
