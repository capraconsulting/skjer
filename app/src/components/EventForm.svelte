<script lang="ts">
  import RegistrationForm from "$components/RegistrationForm.svelte";
  import UnregistrationForm from "$components/UnregistrationForm.svelte";

  export let event;

  export let registrationForm;
  export let registrationErrors;
  export let registrationEnhance;
  export let registrationDelayed;
  export let registrationMessage;

  export let unregistrationForm;
  export let unregistrationErrors;
  export let unregistrationEnhance;
  export let unregistrationMessage;
</script>

<div class="flex flex-col gap-12 pt-8 sm:w-[60%]">
  <div class="py-6">
    <h2 class="pb-4 text-base font-bold sm:text-xl">Påmelding:</h2>
    <RegistrationForm
      {event}
      {registrationForm}
      {registrationErrors}
      {registrationEnhance}
      {registrationDelayed}
      {registrationMessage}
    />
    <UnregistrationForm
      {unregistrationForm}
      {unregistrationErrors}
      {unregistrationEnhance}
      {unregistrationMessage}
    />
  </div>
</div>
