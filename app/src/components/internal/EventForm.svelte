<script lang="ts">
  import EventParticipants from "$components/internal/EventParticipants.svelte";
  import RegistrationForm from "$components/internal/RegistrationForm.svelte";
  import UnregistrationForm from "$components/internal/UnregistrationForm.svelte";

  export let event;

  export let registrationForm;
  export let registrationEnhance;
  export let registrationDelayed;
  export let registrationMessage;

  export let internalParticipantNames;
</script>

<div class="flex flex-col gap-12 pt-8 sm:w-[60%]">
  <div>
    <h2 class="mt-8 pb-4 text-base sm:text-xl">
      <span class="font-bold">Deltagere:</span>
    </h2>
    <EventParticipants {internalParticipantNames} />
  </div>

  <div class="py-6">
    <h2 class="pb-4 text-base font-bold sm:text-xl">Påmelding:</h2>

    <RegistrationForm
      {event}
      {registrationForm}
      {registrationEnhance}
      {registrationDelayed}
      {registrationMessage}
    />

    <UnregistrationForm />
  </div>
</div>
