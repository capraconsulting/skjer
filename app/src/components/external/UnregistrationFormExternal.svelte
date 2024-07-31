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
    class="mt-20 flex flex-col gap-2"
    method="POST"
    action="?/submitUnregistrationExternal"
    use:enhance
  >
    <input type="text" name="subject" id="subject" class="hidden" />

    <h2 id="unregistration" class="pb-4 text-base font-bold sm:text-xl">
      Ønsker du å melde deg av?
    </h2>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Input
        class="bg-white"
        type="text"
        placeholder="din-epost@epost.no"
        name="email"
        bind:value={$form.email}
      />
      <div class="flex items-center">
        <Button pill color="dark" type="submit" disabled={$delayed}>
          <span class="ml-3">Meld meg av</span>
          <span class="w-3">
            {#if $delayed}
              <Spinner color="gray" class="ml-2 " size="4" />
            {/if}
          </span>
        </Button>
      </div>
      {#if $errors.email}
        <p class="text-xs text-red-600">Fyll inn gyldig epost.</p>
      {/if}
    </div>
  </form>
{/if}
