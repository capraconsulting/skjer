<script lang="ts">
  import { dateHasPassed } from "$lib/utils/date.util";
  import { Input, Button, Spinner } from "flowbite-svelte";
  import type { Event } from "$models/sanity.model";

  export let event: Event;
  export let form;
  export let errors;
  export let delayed;
  export let enhance;
</script>

{#if !dateHasPassed(event.deadline)}
  <form
    class="mt-20 flex flex-col gap-1"
    method="POST"
    action="?/submitUnregistrationExternal"
    use:enhance
    data-testid="unregistration-form"
  >
    <input type="text" name="subject" id="subject" class="hidden" />

    <h2 id="unregistration" class="pb-4 text-base font-bold sm:text-xl">
      Ønsker du å melde deg av?
    </h2>

    <div class="flex flex-wrap gap-3 sm:flex-nowrap">
      <Input
        class=" bg-white"
        type="text"
        placeholder="Skriv inn din e-post her"
        name="email"
        bind:value={$form.email}
        data-testid="email-input"
      />
      <Button pill color="dark" type="submit" disabled={$delayed} class="w-max whitespace-nowrap" data-testid="confirm-button">
        <span class="ml-2">Meld meg av</span>
        <span class="w-2">
          {#if $delayed}
            <Spinner color="gray" class="ml-2" size="4" />
          {/if}
        </span>
      </Button>
    </div>

    {#if $errors.email}
      <p class="text-xs text-red-600 error-message" data-testid="error-message">Fyll inn gyldig e-post.</p>
    {/if}
  </form>
{/if}
