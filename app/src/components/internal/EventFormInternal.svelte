<script lang="ts">
  import { page } from "$app/stores";
  import EventParticipantsInternal from "$components/internal/EventParticipantsInternal.svelte";
  import RegistrationFormInternal from "$components/internal/RegistrationFormInternal.svelte";
  import UnregistrationFormInternal from "$components/internal/UnregistrationFormInternal.svelte";
  import type { Event } from "$models/sanity.model";
  import { Alert } from "flowbite-svelte";

  export let event: Event;

  export let form;
  export let enhance;
  export let delayed;
  export let message;

  export let isAttending;
  export let internalParticipantNames;
</script>

<div class="flex flex-col gap-12 pt-8 sm:w-[60%]">
  <div>
    <h2 class="mt-8 pb-4 text-base font-bold sm:text-xl">Deltagere:</h2>
    <EventParticipantsInternal {internalParticipantNames} />
  </div>
  <div>
    {#if $message?.text}
      <Alert color={$message.success ? "green" : $message.warning ? "yellow" : "red"}>
        {$message.text}
      </Alert>
    {:else if $page.form?.text}
      <Alert color={$page.form.success ? "green" : $page.form.warning ? "yellow" : "red"}>
        {$page.form.text}
      </Alert>
    {:else if !isAttending}
      <h2 class="pb-4 text-base font-bold sm:text-xl">Påmelding:</h2>
      <RegistrationFormInternal {event} {form} {enhance} {delayed} />
    {:else}
      <h2 class="pb-4 text-base font-bold sm:text-xl">Avmelding:</h2>
      <UnregistrationFormInternal />
    {/if}
  </div>
</div>
